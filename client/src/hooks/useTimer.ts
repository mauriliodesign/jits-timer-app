// Timer Hook
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TimerService } from '@/services/timerService';
import { websocketService } from '@/services/websocketService';
import { TimerState, TimerConfig, TimerAction, TimerPhase } from '@/types/timer';
import { TimerUpdateMessage } from '@/types/api';
import { validationUtils } from '@/utils/validationUtils';

export const useTimer = () => {
  const queryClient = useQueryClient();
  const [timerState, setTimerState] = useState<TimerState | null>(null);

  // Query for current session
  const { data: currentSession, isLoading } = useQuery({
    queryKey: ['timer', 'current'],
    queryFn: TimerService.getCurrentSession,
    refetchInterval: false,
    staleTime: Infinity,
  });

  // Mutations
  const configMutation = useMutation({
    mutationFn: TimerService.updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timer', 'current'] });
    },
  });

  const controlMutation = useMutation({
    mutationFn: TimerService.controlTimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timer', 'current'] });
    },
  });

  // WebSocket message handling
  useEffect(() => {
    const unsubscribe = websocketService.onMessage('timer_update', (message: TimerUpdateMessage) => {
      console.log('Received timer update:', message.data);
      setTimerState(message.data);
    });

    return unsubscribe;
  }, []);

  // Initialize timer state from current session
  useEffect(() => {
    if (currentSession) {
      console.log('Initializing timer state from session:', currentSession);
      setTimerState({
        currentTime: currentSession.currentTime || 0,
        currentRound: currentSession.currentRound || 1,
        totalRounds: currentSession.rounds || 5,
        isRunning: currentSession.isRunning || false,
        isResting: currentSession.isResting || false,
        isFinished: currentSession.isFinished || false,
      });
    }
  }, [currentSession]);

  // Get current timer phase
  const getCurrentPhase = useCallback((): TimerPhase => {
    if (!timerState) return 'idle';
    return validationUtils.getTimerPhase(timerState);
  }, [timerState]);

  // Get main button label based on current phase
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

  // Actions
  const updateConfig = useCallback((config: TimerConfig) => {
    const errors = validationUtils.validateTimerConfig(config);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    return configMutation.mutateAsync(config);
  }, [configMutation]);

  const controlTimer = useCallback((action: TimerAction) => {
    return controlMutation.mutateAsync(action);
  }, [controlMutation]);

  const startTimer = useCallback((config?: TimerConfig) => {
    if (config) {
      return configMutation.mutateAsync(config, {
        onSuccess: () => controlMutation.mutate('start'),
      });
    }
    return controlMutation.mutateAsync('start');
  }, [configMutation, controlMutation]);

  const pauseTimer = useCallback(() => {
    return controlMutation.mutateAsync('pause');
  }, [controlMutation]);

  const resetTimer = useCallback(() => {
    return controlMutation.mutateAsync('reset');
  }, [controlMutation]);

  return {
    // State
    timerState,
    currentSession,
    isLoading,
    currentPhase: getCurrentPhase(),
    mainButtonLabel: getMainButtonLabel(),
    
    // Actions
    updateConfig,
    controlTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    
    // Mutations
    configMutation,
    controlMutation,
    
    // Utilities
    isConfigComplete: timerState ? validationUtils.isConfigComplete({
      rounds: timerState.totalRounds,
      fightTime: currentSession?.fightTime || 0,
      restTime: currentSession?.restTime || 0,
    }) : false,
  };
};
