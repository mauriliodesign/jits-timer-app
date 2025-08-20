import { type TimerSession, type InsertTimerSession, type AcademyProfile, type InsertAcademyProfile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTimerSession(id: string): Promise<TimerSession | undefined>;
  getCurrentSession(): Promise<TimerSession | undefined>;
  createTimerSession(session: InsertTimerSession): Promise<TimerSession>;
  updateTimerSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession | undefined>;
  
  getAcademyProfile(userId: string): Promise<AcademyProfile | undefined>;
  getLatestAcademyProfile(): Promise<AcademyProfile | undefined>;
  createAcademyProfile(profile: InsertAcademyProfile): Promise<AcademyProfile>;
  updateAcademyProfile(userId: string, updates: Partial<AcademyProfile>): Promise<AcademyProfile | undefined>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, TimerSession>;
  private profiles: Map<string, AcademyProfile>;
  private currentSessionId: string | null = null;

  constructor() {
    this.sessions = new Map();
    this.profiles = new Map();
    // Create default session
    this.createDefaultSession();
  }

  private createDefaultSession() {
    const defaultSession: TimerSession = {
      id: randomUUID(),
      rounds: 5,
      roundDuration: 6,
      restTime: 60,
      currentRound: 1,
      currentTime: 6 * 60, // 6 minutes in seconds
      isRunning: false,
      isResting: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(defaultSession.id, defaultSession);
    this.currentSessionId = defaultSession.id;
  }

  async getTimerSession(id: string): Promise<TimerSession | undefined> {
    return this.sessions.get(id);
  }

  async getCurrentSession(): Promise<TimerSession | undefined> {
    if (!this.currentSessionId) return undefined;
    return this.sessions.get(this.currentSessionId);
  }

  async createTimerSession(insertSession: InsertTimerSession): Promise<TimerSession> {
    const id = randomUUID();
    const session: TimerSession = {
      rounds: 5,
      roundDuration: 6,
      restTime: 60,
      currentRound: 1,
      isRunning: false,
      isResting: false,
      ...insertSession,
      id,
      currentTime: (insertSession.roundDuration || 6) * 60, // Convert minutes to seconds
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    this.currentSessionId = id;
    return session;
  }

  async updateTimerSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    const updatedSession: TimerSession = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getAcademyProfile(userId: string): Promise<AcademyProfile | undefined> {
    return this.profiles.get(userId);
  }

  async getLatestAcademyProfile(): Promise<AcademyProfile | undefined> {
    if (this.profiles.size === 0) {
      return undefined;
    }

    // Get the first profile (for now, since we expect only one)
    const firstProfile = this.profiles.values().next().value;
    return firstProfile;
  }

  async createAcademyProfile(insertProfile: InsertAcademyProfile): Promise<AcademyProfile> {
    const profile: AcademyProfile = {
      ...insertProfile,
      id: randomUUID(),
      logoUrl: insertProfile.logoUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(insertProfile.userId, profile);
    return profile;
  }

  async updateAcademyProfile(userId: string, updates: Partial<AcademyProfile>): Promise<AcademyProfile | undefined> {
    const profile = this.profiles.get(userId);
    if (!profile) return undefined;

    const updatedProfile: AcademyProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    };
    this.profiles.set(userId, updatedProfile);
    return updatedProfile;
  }
}

export const storage = new MemStorage();
