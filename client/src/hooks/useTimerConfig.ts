// Timer Config Hook
import { useState, useCallback } from 'react';
import { TimerConfig } from '@/types/timer';
import { TIMER_CONSTANTS } from '@/utils/constants';
import { validationUtils } from '@/utils/validationUtils';

export const useTimerConfig = (initialConfig?: Partial<TimerConfig>) => {
  const [config, setConfig] = useState<TimerConfig>({
    ...TIMER_CONSTANTS.DEFAULT_CONFIG,
    ...initialConfig,
  });

  const updateConfig = useCallback((updates: Partial<TimerConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateField = useCallback((field: keyof TimerConfig, value: number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(TIMER_CONSTANTS.DEFAULT_CONFIG);
  }, []);

  const validateConfig = useCallback(() => {
    return validationUtils.validateTimerConfig(config);
  }, [config]);

  const isConfigValid = useCallback(() => {
    return validationUtils.isConfigComplete(config);
  }, [config]);

  return {
    config,
    updateConfig,
    updateField,
    resetConfig,
    validateConfig,
    isConfigValid,
  };
};
