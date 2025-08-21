// Validation Utilities
export const validationUtils = {
  /**
   * Validate timer configuration
   */
  validateTimerConfig: (config: { rounds: number; fightTime: number; restTime: number }): string[] => {
    const errors: string[] = [];

    if (!config.rounds || config.rounds < 1 || config.rounds > 50) {
      errors.push('Number of rounds must be between 1 and 50');
    }

    if (!config.fightTime || config.fightTime < 30 || config.fightTime > 3600) {
      errors.push('Fight time must be between 30 seconds and 60 minutes');
    }

    if (!config.restTime || config.restTime < 5 || config.restTime > 600) {
      errors.push('Rest time must be between 5 seconds and 10 minutes');
    }

    return errors;
  },

  /**
   * Check if configuration is complete
   */
  isConfigComplete: (config: { rounds: number; fightTime: number; restTime: number }): boolean => {
    return config.rounds > 0 && config.fightTime > 0 && config.restTime > 0;
  },

  /**
   * Validate time value
   */
  isValidTime: (time: number): boolean => {
    return typeof time === 'number' && time >= 0 && isFinite(time);
  },

  /**
   * Validate WebSocket message
   */
  isValidWSMessage: (message: any): boolean => {
    return message && typeof message === 'object' && message.type && message.data;
  },

  /**
   * Get current timer phase
   */
  getTimerPhase: (timerState: {
    isRunning: boolean;
    isResting: boolean;
    isFinished?: boolean;
    currentRound: number;
    totalRounds: number;
  }): 'idle' | 'fight' | 'rest' | 'finished' => {
    if (timerState.isFinished || (timerState.currentRound > timerState.totalRounds)) {
      return 'finished';
    }
    
    if (!timerState.isRunning && timerState.currentRound === 1 && !timerState.isResting) {
      return 'idle';
    }
    
    if (timerState.isResting) {
      return 'rest';
    }
    
    return 'fight';
  }
};
