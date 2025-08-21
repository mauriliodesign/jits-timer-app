// Validation Utilities
export const validationUtils = {
  /**
   * Validate timer configuration
   */
  validateTimerConfig: (config: { rounds: number; roundDuration: number; restTime: number }): string[] => {
    const errors: string[] = [];

    if (!config.rounds || config.rounds < 1 || config.rounds > 50) {
      errors.push('Número de rolas deve estar entre 1 e 50');
    }

    if (!config.roundDuration || config.roundDuration < 1 || config.roundDuration > 120) {
      errors.push('Duração da rola deve estar entre 1 e 120 minutos');
    }

    if (!config.restTime || config.restTime < 5 || config.restTime > 600) {
      errors.push('Tempo de descanso deve estar entre 5 e 600 segundos');
    }

    return errors;
  },

  /**
   * Check if configuration is complete
   */
  isConfigComplete: (config: { rounds: number; roundDuration: number; restTime: number }): boolean => {
    return config.rounds > 0 && config.roundDuration > 0 && config.restTime > 0;
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
  }
};
