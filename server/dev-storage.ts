import { type TimerSession, type InsertTimerSession, type AcademyProfile, type InsertAcademyProfile } from "../shared/schema.js";
import { randomUUID } from "crypto";

export class DevStorage {
  private currentSession: TimerSession | null = null;
  private academyProfile: AcademyProfile | null = null;

  // Timer Session methods
  async getTimerSession(id: string): Promise<TimerSession | undefined> {
    if (this.currentSession && this.currentSession.id === id) {
      return this.currentSession;
    }
    return undefined;
  }

  async getCurrentSession(): Promise<TimerSession | undefined> {
    if (!this.currentSession) {
      // Create default session for development
      console.log("Creating default session for development");
      this.currentSession = await this.createTimerSession({
        rounds: 5,
        roundDuration: 6,
        restTime: 60,
      });
    }
    return this.currentSession;
  }

  async createTimerSession(sessionData: InsertTimerSession): Promise<TimerSession> {
    const session: TimerSession = {
      id: randomUUID(),
      rounds: sessionData.rounds,
      roundDuration: sessionData.roundDuration,
      restTime: sessionData.restTime,
      currentRound: 1,
      currentTime: sessionData.roundDuration * 60, // Start with full time
      isRunning: false,
      isResting: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.currentSession = session;
    console.log("Created session:", session);
    return session;
  }

  async updateTimerSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession | undefined> {
    if (!this.currentSession || this.currentSession.id !== id) {
      return undefined;
    }

    this.currentSession = {
      ...this.currentSession,
      ...updates,
      updatedAt: new Date(),
    };

    console.log("Updated session:", this.currentSession);
    return this.currentSession;
  }

  // Academy Profile methods
  async getAcademyProfile(userId: string): Promise<AcademyProfile | undefined> {
    if (this.academyProfile && this.academyProfile.userId === userId) {
      return this.academyProfile;
    }
    return undefined;
  }

  async getLatestAcademyProfile(): Promise<AcademyProfile | undefined> {
    return this.academyProfile || undefined;
  }

  async createAcademyProfile(profileData: InsertAcademyProfile): Promise<AcademyProfile> {
    const profile: AcademyProfile = {
      id: randomUUID(),
      userId: profileData.userId,
      academyName: profileData.academyName,
      instructorName: profileData.instructorName,
      logoUrl: profileData.logoUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.academyProfile = profile;
    console.log("Created academy profile:", profile);
    return profile;
  }

  async updateAcademyProfile(userId: string, updates: Partial<AcademyProfile>): Promise<AcademyProfile | undefined> {
    if (!this.academyProfile || this.academyProfile.userId !== userId) {
      return undefined;
    }

    this.academyProfile = {
      ...this.academyProfile,
      ...updates,
      updatedAt: new Date(),
    };

    console.log("Updated academy profile:", this.academyProfile);
    return this.academyProfile;
  }
}
