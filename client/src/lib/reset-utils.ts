import type { TimerSession } from "@shared/schema";

// Types
export interface ResetConfig {
  rounds: number;
  roundDuration: number;
  restTime: number;
}

export interface ResetState {
  config: ResetConfig;
  configChanged: {
    rounds: boolean;
    roundDuration: boolean;
    restTime: boolean;
  };
  timerState: {
    currentTime: number;
    currentRound: number;
    totalRounds: number;
    isRunning: boolean;
    isResting: boolean;
  };
}

// Default values
export const DEFAULT_CONFIG: ResetConfig = {
  rounds: 5,
  roundDuration: 6,
  restTime: 60
};

export const DEFAULT_CONFIG_CHANGED = {
  rounds: false,
  roundDuration: false,
  restTime: false
};

export const DEFAULT_TIMER_STATE = {
  currentTime: 0,
  currentRound: 1,
  totalRounds: 5,
  isRunning: false,
  isResting: false
};

/**
 * Resets all timer and stepper states to their initial values
 * @param currentSession - Current timer session (optional)
 * @returns ResetState object with all initial values
 */
export const resetAllStates = (currentSession?: TimerSession): ResetState => {
  return {
    config: { ...DEFAULT_CONFIG },
    configChanged: { ...DEFAULT_CONFIG_CHANGED },
    timerState: { ...DEFAULT_TIMER_STATE }
  };
};

/**
 * Resets only the configuration (steppers) to initial state
 * @returns ResetConfig and configChanged with initial values
 */
export const resetConfigOnly = () => {
  return {
    config: { ...DEFAULT_CONFIG },
    configChanged: { ...DEFAULT_CONFIG_CHANGED }
  };
};

/**
 * Resets only the timer state to initial values
 * @returns Timer state with initial values
 */
export const resetTimerOnly = () => {
  return { ...DEFAULT_TIMER_STATE };
};

/**
 * Resets configuration to custom values
 * @param customConfig - Custom configuration values
 * @returns ResetConfig with custom values and configChanged set to true
 */
export const resetToCustomConfig = (customConfig: Partial<ResetConfig>) => {
  return {
    config: { ...DEFAULT_CONFIG, ...customConfig },
    configChanged: {
      rounds: customConfig.rounds !== undefined,
      roundDuration: customConfig.roundDuration !== undefined,
      restTime: customConfig.restTime !== undefined
    }
  };
};

/**
 * Validates if a reset state is in initial condition
 * @param state - State to validate
 * @returns boolean indicating if state is in initial condition
 */
export const isInInitialState = (state: ResetState): boolean => {
  const isConfigInitial = 
    state.config.rounds === DEFAULT_CONFIG.rounds &&
    state.config.roundDuration === DEFAULT_CONFIG.roundDuration &&
    state.config.restTime === DEFAULT_CONFIG.restTime;

  const isConfigChangedInitial = 
    !state.configChanged.rounds &&
    !state.configChanged.roundDuration &&
    !state.configChanged.restTime;

  const isTimerInitial = 
    state.timerState.currentTime === DEFAULT_TIMER_STATE.currentTime &&
    state.timerState.currentRound === DEFAULT_TIMER_STATE.currentRound &&
    state.timerState.totalRounds === DEFAULT_TIMER_STATE.totalRounds &&
    state.timerState.isRunning === DEFAULT_TIMER_STATE.isRunning &&
    state.timerState.isResting === DEFAULT_TIMER_STATE.isResting;

  return isConfigInitial && isConfigChangedInitial && isTimerInitial;
};

/**
 * Creates a reset function for React state setters
 * @param setConfig - Function to set config state
 * @param setConfigChanged - Function to set configChanged state
 * @param setTimerState - Function to set timer state
 * @param resetServer - Function to reset server state (optional)
 * @returns Function that resets all states
 */
export const createResetFunction = (
  setConfig: (config: ResetConfig) => void,
  setConfigChanged: (changed: typeof DEFAULT_CONFIG_CHANGED) => void,
  setTimerState: (state: typeof DEFAULT_TIMER_STATE) => void,
  resetServer?: () => void
) => {
  return () => {
    // Reset client states
    setConfig(DEFAULT_CONFIG);
    setConfigChanged(DEFAULT_CONFIG_CHANGED);
    setTimerState(DEFAULT_TIMER_STATE);

    // Reset server state if provided
    if (resetServer) {
      resetServer();
    }
  };
};

/**
 * Creates a soft reset function that only resets timer state
 * @param setTimerState - Function to set timer state
 * @param resetServer - Function to reset server state (optional)
 * @returns Function that resets only timer state
 */
export const createSoftResetFunction = (
  setTimerState: (state: typeof DEFAULT_TIMER_STATE) => void,
  resetServer?: () => void
) => {
  return () => {
    // Reset only timer state
    setTimerState(DEFAULT_TIMER_STATE);

    // Reset server state if provided
    if (resetServer) {
      resetServer();
    }
  };
};

/**
 * Creates a config reset function that only resets configuration
 * @param setConfig - Function to set config state
 * @param setConfigChanged - Function to set configChanged state
 * @returns Function that resets only configuration
 */
export const createConfigResetFunction = (
  setConfig: (config: ResetConfig) => void,
  setConfigChanged: (changed: typeof DEFAULT_CONFIG_CHANGED) => void
) => {
  return () => {
    // Reset only configuration
    setConfig(DEFAULT_CONFIG);
    setConfigChanged(DEFAULT_CONFIG_CHANGED);
  };
};
