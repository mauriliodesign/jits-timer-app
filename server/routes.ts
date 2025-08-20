import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage.js";
import { insertTimerSessionSchema, insertAcademyProfileSchema, wsMessageSchema, type WSMessage } from "../shared/schema.js";
import { requireAuth, publicRoute, logAuthErrors } from "./middleware/auth.js";
import { timerEngine } from "./timer-engine.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Adicionar middleware de logging de erros de autenticação
  app.use(logAuthErrors);
  
  // Test route
  app.get("/api/test", (req, res) => {
    res.json({ message: "Server is working", env: process.env.NODE_ENV });
  });

  // Timer session routes
  app.get("/api/timer/current", async (req, res) => {
    try {
      const session = await storage.getCurrentSession();
      if (!session) {
        return res.status(404).json({ message: "No active session found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current session" });
    }
  });

  app.post("/api/timer/config", requireAuth, async (req, res) => {
    try {
      console.log("Received config request:", req.body);
      const config = insertTimerSessionSchema.parse(req.body);
      console.log("Parsed config:", config);
      const session = await storage.createTimerSession(config);
      
      // Broadcast config update to all connected clients
      broadcastMessage({
        type: "config_update",
        data: {
          rounds: session.rounds,
          roundDuration: session.roundDuration,
          restTime: session.restTime,
        },
      });
      
      res.json(session);
    } catch (error) {
      console.error("Config error:", error);
      res.status(400).json({ message: "Invalid configuration data", error: error.message });
    }
  });

  app.post("/api/timer/control", requireAuth, async (req, res) => {
    try {
      const { action } = req.body;
      const currentSession = await storage.getCurrentSession();
      
      if (!currentSession) {
        return res.status(404).json({ message: "No active session found" });
      }

      let updates: Partial<typeof currentSession> = {};

      switch (action) {
        case "start":
          updates.isRunning = true;
          updates.currentTime = updates.currentTime || currentSession.roundDuration * 60;
          break;
        case "pause":
          updates.isRunning = !currentSession.isRunning;
          break;
        case "reset":
          updates.isRunning = false;
          updates.currentRound = 1;
          updates.currentTime = currentSession.roundDuration * 60;
          updates.isResting = false;
          break;
      }

      const updatedSession = await storage.updateTimerSession(currentSession.id, updates);
      
      if (updatedSession) {
        // Start/stop timer engine based on action
        if (action === "start" && updatedSession.isRunning) {
          timerEngine.startTimer(updatedSession.id);
        } else if (action === "pause" || action === "reset") {
          timerEngine.stopTimer(updatedSession.id);
        }

        // Broadcast control action to all connected clients
        broadcastMessage({
          type: "timer_control",
          data: { action },
        });
        
        // Also broadcast timer update
        broadcastMessage({
          type: "timer_update",
          data: {
            currentTime: updatedSession.currentTime,
            currentRound: updatedSession.currentRound,
            isRunning: updatedSession.isRunning,
            isResting: updatedSession.isResting,
            totalRounds: updatedSession.rounds,
          },
        });
      }
      
      res.json(updatedSession);
    } catch (error) {
      console.error("Timer control error:", error);
      res.status(400).json({ message: "Invalid control action" });
    }
  });

  // Academy profile routes
  // Public academy profile for TV display (must come before :userId route)
  app.get("/api/profile/public", async (req, res) => {
    try {
      const profile = await storage.getLatestAcademyProfile();
      if (!profile) {
        return res.status(404).json({ message: "No academy profile found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error getting public profile:", error);
      res.status(500).json({ message: "Failed to get public profile" });
    }
  });

  app.get("/api/profile/:userId", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getAcademyProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  app.post("/api/profile", requireAuth, async (req, res) => {
    try {
      const profileData = insertAcademyProfileSchema.parse(req.body);
      const profile = await storage.createAcademyProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  app.put("/api/profile/:userId", requireAuth, async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateAcademyProfile(req.params.userId, updates);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Set<WebSocket>();

  wss.on("connection", (ws: WebSocket) => {
    clients.add(ws);
    console.log("New WebSocket connection established");

    // Send current session state to new client
    storage.getCurrentSession().then(session => {
      if (session) {
        ws.send(JSON.stringify({
          type: "timer_update",
          data: {
            currentTime: session.currentTime,
            currentRound: session.currentRound,
            isRunning: session.isRunning,
            isResting: session.isResting,
            totalRounds: session.rounds,
          },
        }));
      }
    });

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        const validatedMessage = wsMessageSchema.parse(message);
        handleWebSocketMessage(validatedMessage);
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });

  function broadcastMessage(message: WSMessage) {
    const messageString = JSON.stringify(message);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }

  async function handleWebSocketMessage(message: WSMessage) {
    // Handle incoming WebSocket messages if needed
    console.log("Received WebSocket message:", message);
  }

  // Timer tick logic
  setInterval(async () => {
    const session = await storage.getCurrentSession();
    if (!session || !session.isRunning) return;

    let updates: Partial<typeof session> = {};
    let needsUpdate = false;

    if (session.currentTime > 0) {
      updates.currentTime = session.currentTime - 1;
      needsUpdate = true;
    } else {
      // Time is up
      if (session.isResting) {
        // Rest period ended, start next round
        if (session.currentRound < session.rounds) {
          updates.currentRound = session.currentRound + 1;
          updates.currentTime = session.roundDuration * 60;
          updates.isResting = false;
        } else {
          // Training complete
          updates.isRunning = false;
          updates.isResting = false;
        }
      } else {
        // Round ended, start rest period
        if (session.currentRound < session.rounds) {
          updates.currentTime = session.restTime;
          updates.isResting = true;
        } else {
          // Last round completed
          updates.isRunning = false;
        }
      }
      needsUpdate = true;
    }

    if (needsUpdate) {
      const updatedSession = await storage.updateTimerSession(session.id, updates);
      if (updatedSession) {
        broadcastMessage({
          type: "timer_update",
          data: {
            currentTime: updatedSession.currentTime,
            currentRound: updatedSession.currentRound,
            isRunning: updatedSession.isRunning,
            isResting: updatedSession.isResting,
            totalRounds: updatedSession.rounds,
          },
        });
      }
    }
  }, 1000);

  return httpServer;
}
