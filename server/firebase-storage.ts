import { type TimerSession, type InsertTimerSession, type AcademyProfile, type InsertAcademyProfile } from "../shared/schema.js";
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  getDocuments, 
  getLatestDocument 
} from "./firebase.js";

export class FirebaseStorage {
  private currentSessionId: string | null = null;

  // Timer Session methods
  async getTimerSession(id: string): Promise<TimerSession | undefined> {
    try {
      const session = await getDocument('timer_sessions', id);
      return session as TimerSession | undefined;
    } catch (error) {
      console.error('Error getting timer session:', error);
      return undefined;
    }
  }

  async getCurrentSession(): Promise<TimerSession | undefined> {
    // First, try to get the current session ID
    if (this.currentSessionId) {
      const session = await this.getTimerSession(this.currentSessionId);
      if (session) {
        return session;
      }
    }

    // If no current session, try to get the latest session from Firestore
    try {
      const latestSession = await getLatestDocument('timer_sessions');
      if (latestSession) {
        this.currentSessionId = latestSession.id;
        console.log("Found existing session:", latestSession.id);
        return latestSession as TimerSession;
      }
    } catch (error) {
      console.error('Error getting latest session:', error);
    }

    // If still no session, create default (both dev and prod)
    console.log("Creating default session");
    const defaultSession = await this.createTimerSession({
      rounds: 5,
      roundDuration: 6,
      restTime: 60,
    });
    return defaultSession;

    return undefined;
  }

  async createTimerSession(sessionData: InsertTimerSession): Promise<TimerSession> {
    try {
      const session = await createDocument('timer_sessions', sessionData);
      this.currentSessionId = session.id;
      return session as TimerSession;
    } catch (error) {
      console.error('Error creating timer session:', error);
      throw error;
    }
  }

  async updateTimerSession(id: string, updates: Partial<TimerSession>): Promise<TimerSession | undefined> {
    try {
      const updatedSession = await updateDocument('timer_sessions', id, updates);
      return updatedSession as TimerSession;
    } catch (error) {
      console.error('Error updating timer session:', error);
      return undefined;
    }
  }

  // Academy Profile methods
  async getAcademyProfile(userId: string): Promise<AcademyProfile | undefined> {
    try {
      const profile = await getDocument('academy_profiles', userId);
      return profile as AcademyProfile | undefined;
    } catch (error) {
      console.error('Error getting academy profile:', error);
      return undefined;
    }
  }

  async getLatestAcademyProfile(): Promise<AcademyProfile | undefined> {
    try {
      const profile = await getLatestDocument('academy_profiles');
      return profile as AcademyProfile | undefined;
    } catch (error) {
      console.error('Error getting latest academy profile:', error);
      return undefined;
    }
  }

  async createAcademyProfile(profileData: InsertAcademyProfile): Promise<AcademyProfile> {
    try {
      const profile = await createDocument('academy_profiles', profileData, profileData.userId);
      return profile as AcademyProfile;
    } catch (error) {
      console.error('Error creating academy profile:', error);
      throw error;
    }
  }

  async updateAcademyProfile(userId: string, updates: Partial<AcademyProfile>): Promise<AcademyProfile | undefined> {
    try {
      const updatedProfile = await updateDocument('academy_profiles', userId, updates);
      return updatedProfile as AcademyProfile;
    } catch (error) {
      console.error('Error updating academy profile:', error);
      return undefined;
    }
  }

  // Utility methods
  async getAllTimerSessions(): Promise<TimerSession[]> {
    try {
      const sessions = await getDocuments('timer_sessions', 'createdAt');
      return sessions as TimerSession[];
    } catch (error) {
      console.error('Error getting all timer sessions:', error);
      return [];
    }
  }

  async getAllAcademyProfiles(): Promise<AcademyProfile[]> {
    try {
      const profiles = await getDocuments('academy_profiles', 'createdAt');
      return profiles as AcademyProfile[];
    } catch (error) {
      console.error('Error getting all academy profiles:', error);
      return [];
    }
  }

  async deleteTimerSession(id: string): Promise<boolean> {
    try {
      await deleteDocument('timer_sessions', id);
      if (this.currentSessionId === id) {
        this.currentSessionId = null;
      }
      return true;
    } catch (error) {
      console.error('Error deleting timer session:', error);
      return false;
    }
  }

  async deleteAcademyProfile(userId: string): Promise<boolean> {
    try {
      await deleteDocument('academy_profiles', userId);
      return true;
    } catch (error) {
      console.error('Error deleting academy profile:', error);
      return false;
    }
  }
}

export const firebaseStorage = new FirebaseStorage();
