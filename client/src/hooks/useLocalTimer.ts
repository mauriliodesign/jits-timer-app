import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerConfig, TimerPhase } from '@/types/timer';
import { timeUtils } from '@/utils/timeUtils';

interface TimerState {
  currentTime: number;
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  isResting: boolean;
  isFinished: boolean;
}

interface UseLocalTimerReturn {
  // State
  timerState: TimerState | null;
  currentPhase: TimerPhase;
  mainButtonLabel: string;
  isConfigValid: boolean;
  
  // Actions
  startTimer: (config?: TimerConfig) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateConfig: (config: TimerConfig) => void;
  
  // Config
  config: TimerConfig;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: TimerConfig = {
  rounds: 5,
  fightTime: 360, // 6 minutes
  restTime: 60,   // 1 minute
};

const STORAGE_KEY = 'jits-timer-config';

export const useLocalTimer = (): UseLocalTimerReturn => {
  const [timerState, setTimerState] = useState<TimerState | null>(null);
  const [config, setConfig] = useState<TimerConfig>(() => {
    // Load config from localStorage on init
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentConfigRef = useRef<TimerConfig>(config);

  // Listen for config changes from other components
  useEffect(() => {
    const checkConfig = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      }
    };

    // Check immediately
    checkConfig();

    // Set up interval to check for changes
    const interval = setInterval(checkConfig, 100);

    return () => clearInterval(interval);
  }, []);

  // Update config ref when config changes
  useEffect(() => {
    currentConfigRef.current = config;
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Save timer state to localStorage for TV sync
  useEffect(() => {
    if (timerState) {
      localStorage.setItem('jits-timer-state', JSON.stringify(timerState));
    } else {
      localStorage.removeItem('jits-timer-state');
    }
  }, [timerState]);

  // Timer logic
  const tick = useCallback(() => {
    setTimerState(prev => {
      if (!prev || !prev.isRunning) return prev;

      const newTime = prev.currentTime - 1;
      
      if (newTime <= 0) {
        // Time is up, transition to next phase
        if (prev.isResting) {
          // Rest time is up, start next round
          const nextRound = prev.currentRound + 1;
          
          if (nextRound > currentConfigRef.current.rounds) {
            // All rounds completed
            return {
              ...prev,
              currentTime: 0,
              isRunning: false,
              isResting: false,
              isFinished: true,
            };
          } else {
            // Start next fight round
            return {
              ...prev,
              currentTime: currentConfigRef.current.fightTime,
              currentRound: nextRound,
              isResting: false,
            };
          }
        } else {
          // Fight time is up, start rest
          return {
            ...prev,
            currentTime: currentConfigRef.current.restTime,
            isResting: true,
          };
        }
      } else {
        // Continue counting down
        return {
          ...prev,
          currentTime: newTime,
        };
      }
    });
  }, []);

  // Start/stop interval based on timer state
  useEffect(() => {
    if (timerState?.isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState?.isRunning, tick]);

  // Get current phase
  const getCurrentPhase = useCallback((): TimerPhase => {
    if (!timerState) return 'idle';
    if (timerState.isFinished) return 'finished';
    if (timerState.isResting) return 'rest';
    return 'fight';
  }, [timerState]);

  // Get main button label
  const getMainButtonLabel = useCallback((): string => {
    const phase = getCurrentPhase();
    
    switch (phase) {
      case 'idle':
      case 'finished':
        return 'Start Training';
      case 'fight':
      case 'rest':
        return timerState?.isRunning ? 'Pause Training' : 'Resume Training';
      default:
        return 'Start Training';
    }
  }, [timerState, getCurrentPhase]);

  // Validate config
  const isConfigValid = useCallback((): boolean => {
    return config.rounds >= 1 && 
           config.rounds <= 20 && 
           config.fightTime > 0 && 
           config.restTime >= 0;
  }, [config]);

  // Actions
  const startTimer = useCallback((newConfig?: TimerConfig) => {
    if (newConfig) {
      setConfig(newConfig);
      currentConfigRef.current = newConfig;
    }

    setTimerState(prev => {
      if (!prev || prev.isFinished) {
        // Start new session
        return {
          currentTime: currentConfigRef.current.fightTime,
          currentRound: 1,
          totalRounds: currentConfigRef.current.rounds,
          isRunning: true,
          isResting: false,
          isFinished: false,
        };
      } else {
        // Resume existing session
        return {
          ...prev,
          isRunning: true,
        };
      }
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isRunning: false,
      };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState(null);
  }, []);

  const updateConfig = useCallback((newConfig: TimerConfig) => {
    setConfig(newConfig);
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    resetTimer();
  }, [resetTimer]);

  return {
    // State
    timerState,
    currentPhase: getCurrentPhase(),
    mainButtonLabel: getMainButtonLabel(),
    isConfigValid: isConfigValid(),
    
    // Actions
    startTimer,
    pauseTimer,
    resetTimer,
    updateConfig,
    
    // Config
    config,
    resetConfig,
  };
};
