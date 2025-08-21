// Timer Types
export interface TimerState {
  currentTime: number;
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  isResting: boolean;
}

export interface TimerConfig {
  rounds: number;
  roundDuration: number; // in minutes
  restTime: number; // in seconds
}

export type TimerAction = 'start' | 'pause' | 'reset';

export type TimerMode = 'timer' | 'countdown' | 'clock';

export type TimerSize = 'small' | 'large' | 'display';

export type TimerVariant = 'default' | 'card' | 'minimal';

export interface TimerDisplayProps {
  time: number;
  mode: TimerMode;
  size?: TimerSize;
  showLabels?: boolean;
  customLabels?: {
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
  className?: string;
}

export interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  size?: TimerSize;
  disabled?: boolean;
  className?: string;
}

export interface TimerConfigProps {
  config: TimerConfig;
  onConfigChange: (config: TimerConfig) => void;
  disabled?: boolean;
  className?: string;
}

export interface RoundIndicatorProps {
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}
