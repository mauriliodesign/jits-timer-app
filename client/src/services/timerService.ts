// Timer Service
import { apiService } from './apiService';
import { TimerSession, TimerConfig, TimerAction } from '@/types/timer';
import { API_ENDPOINTS } from '@/utils/constants';

export class TimerService {
  /**
   * Get current timer session
   */
  static async getCurrentSession(): Promise<TimerSession> {
    return apiService.get<TimerSession>(API_ENDPOINTS.TIMER.CURRENT);
  }

  /**
   * Update timer configuration
   */
  static async updateConfig(config: TimerConfig): Promise<TimerSession> {
    return apiService.post<TimerSession>(API_ENDPOINTS.TIMER.CONFIG, config);
  }

  /**
   * Control timer (start, pause, reset)
   */
  static async controlTimer(action: TimerAction): Promise<TimerSession> {
    return apiService.post<TimerSession>(API_ENDPOINTS.TIMER.CONTROL, { action });
  }

  /**
   * Get academy profile
   */
  static async getAcademyProfile(): Promise<any> {
    return apiService.get(API_ENDPOINTS.PROFILE.PUBLIC);
  }

  /**
   * Update academy profile
   */
  static async updateAcademyProfile(userId: string, data: any): Promise<any> {
    return apiService.put(API_ENDPOINTS.PROFILE.USER.replace(':userId', userId), data);
  }
}
