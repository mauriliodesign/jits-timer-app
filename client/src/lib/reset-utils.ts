// Reset utilities for stepper components

// Default configuration values
export const DEFAULT_CONFIG = {
  rounds: 5,
  roundDuration: 6,
  restTime: 60,
};

// Default configuration changed state (all false = not configured)
export const DEFAULT_CONFIG_CHANGED = {
  rounds: false,
  roundDuration: false,
  restTime: false,
};

// Default timer state
export const DEFAULT_TIMER_STATE = {
  isRunning: false,
  isResting: false,
  currentRound: 1,
  totalRounds: 5,
  currentTime: 0,
};

// Function to reset steppers to initial state
export const resetSteppersToInitial = (
  setConfig: (config: typeof DEFAULT_CONFIG) => void,
  setConfigChanged: (changed: typeof DEFAULT_CONFIG_CHANGED) => void
) => {
  // Reset configuration to default values
  setConfig(DEFAULT_CONFIG);
  
  // Reset configuration changed state to false (showing "—" in steppers)
  setConfigChanged(DEFAULT_CONFIG_CHANGED);
};

// Function to reset everything (steppers + timer + audio)
export const resetAllToInitial = (
  setConfig: (config: typeof DEFAULT_CONFIG) => void,
  setConfigChanged: (changed: typeof DEFAULT_CONFIG_CHANGED) => void,
  setTimerState: (state: typeof DEFAULT_TIMER_STATE) => void,
  onServerReset?: () => void,
  audioInitializedRef?: React.MutableRefObject<boolean>
) => {
  // Reset steppers
  resetSteppersToInitial(setConfig, setConfigChanged);
  
  // Reset timer state
  setTimerState(DEFAULT_TIMER_STATE);
  
  // Reset audio if provided
  if (audioInitializedRef) {
    audioInitializedRef.current = false;
  }
  
  // Call server reset if provided
  if (onServerReset) {
    onServerReset();
  }
};

// Function to reset only steppers (keep timer running)
export const resetOnlySteppers = (
  setConfig: (config: typeof DEFAULT_CONFIG) => void,
  setConfigChanged: (changed: typeof DEFAULT_CONFIG_CHANGED) => void
) => {
  resetSteppersToInitial(setConfig, setConfigChanged);
};

// Function to reset only timer (keep steppers configured)
export const resetOnlyTimer = (
  setTimerState: (state: typeof DEFAULT_TIMER_STATE) => void,
  onServerReset?: () => void,
  audioInitializedRef?: React.MutableRefObject<boolean>
) => {
  // Reset timer state
  setTimerState(DEFAULT_TIMER_STATE);
  
  // Reset audio if provided
  if (audioInitializedRef) {
    audioInitializedRef.current = false;
  }
  
  // Call server reset if provided
  if (onServerReset) {
    onServerReset();
  }
};
