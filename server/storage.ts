import { type TimerSession, type InsertTimerSession, type AcademyProfile, type InsertAcademyProfile } from "../shared/schema.js";
import { randomUUID } from "crypto";

// Use Firebase storage in production IF configured, DevStorage otherwise
const isProduction = process.env.NODE_ENV === "production";
const hasFirebaseConfig = process.env.VITE_FIREBASE_PROJECT_ID && 
  process.env.VITE_FIREBASE_API_KEY;

const useFirebaseStorage = isProduction && hasFirebaseConfig;

console.log(`Storage mode: ${useFirebaseStorage ? 'Firebase' : 'Dev'} (prod: ${isProduction}, config: ${hasFirebaseConfig})`);

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
  private devStorage: any = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    if (useFirebaseStorage) {
      // Load Firebase storage
      this.initPromise = this.initFirebaseStorage();
    } else {
      // Load Dev storage
      this.initPromise = this.initDevStorage();
    }
  }

  private async initFirebaseStorage() {
    try {
      const { firebaseStorage } = await import('./firebase-storage.js');
      this.firebaseStorage = firebaseStorage;
      console.log('Firebase storage loaded successfully');
    } catch (error) {
      console.error('Firebase storage is required but not available:', error);
      throw new Error('Firebase storage must be configured');
    }
  }

  private async initDevStorage() {
    try {
      const { DevStorage } = await import('./dev-storage.js');
      this.devStorage = new DevStorage();
      console.log('Dev storage loaded successfully');
    } catch (error) {
      console.error('Dev storage failed to load:', error);
      throw new Error('Dev storage failed to initialize');
    }
  }

  private async ensureInitialized() {
    if (this.initPromise) {
      await this.initPromise;
      this.initPromise = null;
    }
  }

  async getTimerSession(id: string): Promise<TimerSession | undefined> {
    await this.ensureInitialized();
    
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.getTimerSession(id);
  }

  async getCurrentSession(): Promise<TimerSession | undefined> {
    await this.ensureInitialized();
    
    if (useFirebaseStorage) {
      if (!this.firebaseStorage) {
        throw new Error('Firebase storage not available');
      }
      return await this.firebaseStorage.getCurrentSession();
    } else {
      if (!this.devStorage) {
        throw new Error('Dev storage not available');
      }
      return await this.devStorage.getCurrentSession();
    }
  }

  async createTimerSession(insertSession: InsertTimerSession): Promise<TimerSession> {
    await this.ensureInitialized();
    
    if (useFirebaseStorage) {
      if (!this.firebaseStorage) {
        throw new Error('Firebase storage not available');
      }
      return await this.firebaseStorage.createTimerSession(insertSession);
    } else {
      if (!this.devStorage) {
        throw new Error('Dev storage not available');
      }
      return await this.devStorage.createTimerSession(insertSession);
    }
  }

  async updateTimerSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession | undefined> {
    await this.ensureInitialized();
    
    if (useFirebaseStorage) {
      if (!this.firebaseStorage) {
        throw new Error('Firebase storage not available');
      }
      return await this.firebaseStorage.updateTimerSession(id, updates);
    } else {
      if (!this.devStorage) {
        throw new Error('Dev storage not available');
      }
      return await this.devStorage.updateTimerSession(id, updates);
    }
  }

  async getAcademyProfile(userId: string): Promise<AcademyProfile | undefined> {
    await this.ensureInitialized();
    
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.getAcademyProfile(userId);
  }

  async getLatestAcademyProfile(): Promise<AcademyProfile | undefined> {
    await this.ensureInitialized();
    
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.getLatestAcademyProfile();
  }

  async createAcademyProfile(insertProfile: InsertAcademyProfile): Promise<AcademyProfile> {
    await this.ensureInitialized();
    
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.createAcademyProfile(insertProfile);
  }

  async updateAcademyProfile(userId: string, updates: Partial<AcademyProfile>): Promise<AcademyProfile | undefined> {
    await this.ensureInitialized();
    
    if (!this.firebaseStorage) {
      throw new Error('Firebase storage not available');
    }
    
    return await this.firebaseStorage.updateAcademyProfile(userId, updates);
  }
}

export const storage = new MemStorage();
