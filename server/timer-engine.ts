import { storage } from "./storage.js";
import type { TimerSession } from "../shared/schema.js";

// Import broadcast function
let broadcastMessage: (message: any) => void;

export function setBroadcastFunction(broadcastFn: (message: any) => void) {
  broadcastMessage = broadcastFn;
}

class TimerEngine {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private startTimes: Map<string, number> = new Map();
  private initialTimes: Map<string, number> = new Map();

  async startTimer(sessionId: string) {
    // Clear existing interval
    this.stopTimer(sessionId);

    // Get current session to determine initial time
    const session = await storage.getTimerSession(sessionId);
    if (!session) return;

    // Store start time and initial time for precise calculations
    const now = Date.now();
    this.startTimes.set(sessionId, now);
    this.initialTimes.set(sessionId, session.currentTime);

    // Use more frequent updates for better precision (100ms instead of 1000ms)
    const interval = setInterval(async () => {
      await this.updateTimer(sessionId);
    }, 100);

    this.intervals.set(sessionId, interval);
    console.log(`Timer started for session ${sessionId} with precise timing`);
  }

  stopTimer(sessionId: string) {
    const interval = this.intervals.get(sessionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(sessionId);
      this.startTimes.delete(sessionId);
      this.initialTimes.delete(sessionId);
      console.log(`Timer stopped for session ${sessionId}`);
    }
  }

  private async updateTimer(sessionId: string) {
    try {
      const session = await storage.getTimerSession(sessionId);
      if (!session || !session.isRunning) {
        this.stopTimer(sessionId);
        return;
      }

      // Calculate precise elapsed time
      const startTime = this.startTimes.get(sessionId);
      const initialTime = this.initialTimes.get(sessionId);
      
      if (!startTime || initialTime === undefined) {
        this.stopTimer(sessionId);
        return;
      }

      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const currentTime = Math.max(0, initialTime - elapsedSeconds);

      let updates: Partial<TimerSession> = {};
      let shouldStop = false;

      if (session.isResting) {
        // Rest period countdown
        if (currentTime > 0) {
          updates.currentTime = currentTime;
        } else {
          // Rest period ended, start next round
          const nextRound = session.currentRound + 1;
          if (nextRound <= session.rounds) {
            updates.currentRound = nextRound;
            updates.currentTime = session.roundDuration * 60;
            updates.isResting = false;
            
            // Update start time for new round
            this.startTimes.set(sessionId, Date.now());
            this.initialTimes.set(sessionId, session.roundDuration * 60);
          } else {
            // Training completed
            updates.isRunning = false;
            updates.isResting = false;
            shouldStop = true;
          }
        }
      } else {
        // Round countdown
        if (currentTime > 0) {
          updates.currentTime = currentTime;
        } else {
          // Round ended, start rest period
          if (session.currentRound < session.rounds) {
            updates.currentTime = session.restTime;
            updates.isResting = true;
            
            // Update start time for rest period
            this.startTimes.set(sessionId, Date.now());
            this.initialTimes.set(sessionId, session.restTime);
          } else {
            // Training completed
            updates.isRunning = false;
            updates.isResting = false;
            shouldStop = true;
          }
        }
      }

      // Only update if there are changes (avoid unnecessary database calls)
      if (Object.keys(updates).length > 0) {
        await storage.updateTimerSession(sessionId, updates);
      }

      // Broadcast timer update to all clients (more frequent for better sync)
      if (broadcastMessage) {
        const updatedSession = await storage.getTimerSession(sessionId);
        if (updatedSession) {
          broadcastMessage({
            type: "timer_update",
            data: {
              currentTime: updatedSession.currentTime,
              currentRound: updatedSession.currentRound,
              isRunning: updatedSession.isRunning,
              isResting: updatedSession.isResting,
              totalRounds: updatedSession.rounds,
              timestamp: Date.now(), // Add timestamp for client sync
            },
          });
        }
      }

      if (shouldStop) {
        this.stopTimer(sessionId);
      }
    } catch (error) {
      console.error(`Error updating timer ${sessionId}:`, error);
      this.stopTimer(sessionId);
    }
  }

  // Clean up all intervals
  cleanup() {
    for (const [sessionId] of this.intervals) {
      this.stopTimer(sessionId);
    }
  }
}

export const timerEngine = new TimerEngine();

// Cleanup on process exit
process.on('SIGINT', () => {
  timerEngine.cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  timerEngine.cleanup();
  process.exit(0);
});
