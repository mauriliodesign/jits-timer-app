import { type TimerSession, type InsertTimerSession, type AcademyProfile, type InsertAcademyProfile } from "../shared/schema.js";
import { randomUUID } from "crypto";

// Always use Firebase storage
const useFirebaseStorage = true;

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
  private firebaseStorage: any = null;

  constructor() {
    // Load Firebase storage
    try {
      const { firebaseStorage } = require('./firebase-storage.js');
      this.firebaseStorage = firebaseStorage;
      console.log('Firebase storage loaded successfully');
    } catch (error) {
      console.error('Firebase storage is required but not available:', error);
      throw new Error('Firebase storage must be configured');
    }
  }

  async getTimerSession(id: string): Promise<TimerSession | undefined> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.getTimerSession(id);
  }

  async getCurrentSession(): Promise<TimerSession | undefined> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.getCurrentSession();
  }

  async createTimerSession(insertSession: InsertTimerSession): Promise<TimerSession> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.createTimerSession(insertSession);
  }

  async updateTimerSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession | undefined> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.updateTimerSession(id, updates);
  }

  async getAcademyProfile(userId: string): Promise<AcademyProfile | undefined> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.getAcademyProfile(userId);
  }

  async getLatestAcademyProfile(): Promise<AcademyProfile | undefined> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.getLatestAcademyProfile();
  }

  async createAcademyProfile(insertProfile: InsertAcademyProfile): Promise<AcademyProfile> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.createAcademyProfile(insertProfile);
  }

  async updateAcademyProfile(userId: string, updates: Partial<AcademyProfile>): Promise<AcademyProfile | undefined> {
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.updateAcademyProfile(userId, updates);
  }
}

export const storage = new MemStorage();
