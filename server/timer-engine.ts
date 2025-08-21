import { storage } from "./storage.js";
import type { TimerSession } from "../shared/schema.js";

// Import broadcast function
let broadcastMessage: (message: any) => void;

export function setBroadcastFunction(broadcastFn: (message: any) => void) {
  broadcastMessage = broadcastFn;
}

// Simple Timer Implementation
class SimpleTimerEngine {
  private interval: NodeJS.Timeout | null = null;
  private currentTime: number = 0;
  private isRunning: boolean = false;
  private isResting: boolean = false;
  private currentRound: number = 1;
  private totalRounds: number = 5;
  private fightTime: number = 300; // 5 minutes
  private restTime: number = 60; // 1 minute
  private sessionId: string = 'default';

  async startTimer(sessionId: string) {
    this.sessionId = sessionId;
    
    // Stop existing timer
    this.stopTimer(sessionId);

    // Get current session
    const session = await storage.getTimerSession(sessionId);
    if (!session) return;

    // Set configuration from session
    this.totalRounds = session.rounds;
    this.fightTime = session.fightTime;
    this.restTime = session.restTime;
    this.currentRound = session.currentRound;
    this.currentTime = session.currentTime || this.fightTime;
    this.isResting = session.isResting || false;

    // Start the timer
    this.isRunning = true;
    
    // Update session state
    await storage.updateTimerSession(sessionId, {
      isRunning: true,
      currentTime: this.currentTime
    });

    // Start interval
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);

    console.log(`Timer started for session ${sessionId}`);
  }

  stopTimer(sessionId: string) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
      console.log(`Timer stopped for session ${sessionId}`);
    }
  }

  private async tick() {
    if (!this.isRunning) return;

    this.currentTime--;

    console.log(`Round ${this.currentRound}/${this.totalRounds} - ${this.formatTime(this.currentTime)} - ${this.isResting ? 'REST' : 'FIGHT'}`);

    // Update database
    await storage.updateTimerSession(this.sessionId, {
      currentTime: this.currentTime,
      currentRound: this.currentRound,
      isRunning: this.isRunning,
      isResting: this.isResting
    });

    // Broadcast update
    if (broadcastMessage) {
      broadcastMessage({
        type: "timer_update",
        data: {
          currentTime: this.currentTime,
          currentRound: this.currentRound,
          isRunning: this.isRunning,
          isResting: this.isResting,
          isFinished: false,
          totalRounds: this.totalRounds,
          timestamp: Date.now()
        }
      });
    }

    if (this.currentTime <= 0) {
      await this.handleTimeUp();
    }
  }

  private async handleTimeUp() {
    if (this.isResting) {
      // Rest ended, next round
      this.currentRound++;
      if (this.currentRound <= this.totalRounds) {
        this.currentTime = this.fightTime;
        this.isResting = false;
        console.log(`Round ${this.currentRound} started!`);
      } else {
        // Training completed
        this.isRunning = false;
        this.isResting = false;
        this.currentTime = 0;
        console.log('Training FINISHED!');
        this.stopTimer(this.sessionId);
      }
    } else {
      // Round ended, rest
      if (this.currentRound < this.totalRounds) {
        this.currentTime = this.restTime;
        this.isResting = true;
        console.log('Rest period started!');
      } else {
        // Last round ended
        this.isRunning = false;
        this.isResting = false;
        this.currentTime = 0;
        console.log('Training FINISHED!');
        this.stopTimer(this.sessionId);
      }
    }

    // Update database with new state
    await storage.updateTimerSession(this.sessionId, {
      currentTime: this.currentTime,
      currentRound: this.currentRound,
      isRunning: this.isRunning,
      isResting: this.isResting,
      isFinished: !this.isRunning && this.currentRound >= this.totalRounds
    });

    // Broadcast final update
    if (broadcastMessage) {
      broadcastMessage({
        type: "timer_update",
        data: {
          currentTime: this.currentTime,
          currentRound: this.currentRound,
          isRunning: this.isRunning,
          isResting: this.isResting,
          isFinished: !this.isRunning && this.currentRound >= this.totalRounds,
          totalRounds: this.totalRounds,
          timestamp: Date.now()
        }
      });
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Clean up all intervals
  cleanup() {
    this.stopTimer(this.sessionId);
  }
}

export const timerEngine = new SimpleTimerEngine();

// Cleanup on process exit
process.on('SIGINT', () => {
  timerEngine.cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  timerEngine.cleanup();
  process.exit(0);
});
