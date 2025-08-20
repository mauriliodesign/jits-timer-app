import { storage } from "./storage.js";
import type { TimerSession } from "../shared/schema.js";

// Import broadcast function
let broadcastMessage: (message: any) => void;

export function setBroadcastFunction(broadcastFn: (message: any) => void) {
  broadcastMessage = broadcastFn;
}

class TimerEngine {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  async startTimer(sessionId: string) {
    // Clear existing interval
    this.stopTimer(sessionId);

    const interval = setInterval(async () => {
      await this.updateTimer(sessionId);
    }, 1000);

    this.intervals.set(sessionId, interval);
    console.log(`Timer started for session ${sessionId}`);
  }

  stopTimer(sessionId: string) {
    const interval = this.intervals.get(sessionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(sessionId);
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

      let updates: Partial<TimerSession> = {};
      let shouldStop = false;

      if (session.isResting) {
        // Rest period countdown
        if (session.currentTime > 0) {
          updates.currentTime = session.currentTime - 1;
        } else {
          // Rest period ended, start next round
          const nextRound = session.currentRound + 1;
          if (nextRound <= session.rounds) {
            updates.currentRound = nextRound;
            updates.currentTime = session.roundDuration * 60;
            updates.isResting = false;
          } else {
            // Training completed
            updates.isRunning = false;
            updates.isResting = false;
            shouldStop = true;
          }
        }
      } else {
        // Round countdown
        if (session.currentTime > 0) {
          updates.currentTime = session.currentTime - 1;
        } else {
          // Round ended, start rest period
          if (session.currentRound < session.rounds) {
            updates.currentTime = session.restTime;
            updates.isResting = true;
          } else {
            // Training completed
            updates.isRunning = false;
            updates.isResting = false;
            shouldStop = true;
          }
        }
      }

      // Update session
      await storage.updateTimerSession(sessionId, updates);

      // Broadcast timer update to all clients
      if (broadcastMessage && Object.keys(updates).length > 0) {
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
