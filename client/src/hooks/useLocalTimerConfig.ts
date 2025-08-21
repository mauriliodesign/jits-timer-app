import { useState, useCallback, useEffect } from 'react';
import { TimerConfig } from '@/types/timer';
import { TIMER_CONSTANTS } from '@/utils/constants';

const DEFAULT_CONFIG: TimerConfig = {
  rounds: 5,
  fightTime: 360, // 6 minutes
  restTime: 60,   // 1 minute
};

const STORAGE_KEY = 'jits-timer-config';

export const useLocalTimerConfig = () => {
  const [config, setConfig] = useState<TimerConfig>(() => {
    // Load config from localStorage on init
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const updateField = useCallback((field: keyof TimerConfig, value: number) => {
    setConfig(prev => {
      const newConfig = {
        ...prev,
        [field]: value,
      };
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONFIG));
  }, []);

  const isConfigValid = useCallback((): boolean => {
    return config.rounds >= TIMER_CONSTANTS.LIMITS.MIN_ROUNDS &&
           config.rounds <= TIMER_CONSTANTS.LIMITS.MAX_ROUNDS &&
           config.fightTime > 0 &&
           config.restTime >= 0;
  }, [config]);

  return {
    config,
    updateField,
    resetConfig,
    isConfigValid,
  };
};
