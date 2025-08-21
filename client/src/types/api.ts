// API Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface WSMessage {
  type: 'timer_update' | 'config_update' | 'timer_control';
  data: any;
  timestamp?: number;
}

export interface TimerUpdateMessage {
  type: 'timer_update';
  data: {
    currentTime: number;
    currentRound: number;
    isRunning: boolean;
    isResting: boolean;
    totalRounds: number;
    timestamp?: number;
  };
}

export interface ConfigUpdateMessage {
  type: 'config_update';
  data: {
    rounds: number;
    roundDuration: number;
    restTime: number;
  };
}

export interface TimerControlMessage {
  type: 'timer_control';
  data: {
    action: 'start' | 'pause' | 'reset';
  };
}
