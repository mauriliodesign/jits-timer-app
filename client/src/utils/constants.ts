// Application Constants
export const TIMER_CONSTANTS = {
  DEFAULT_CONFIG: {
    rounds: 5,
    fightTime: 360, // 6 minutes in seconds
    restTime: 60, // 1 minute in seconds
  },
  
  LIMITS: {
    MIN_ROUNDS: 1,
    MAX_ROUNDS: 50,
    MIN_FIGHT_TIME: 30, // 30 seconds
    MAX_FIGHT_TIME: 3600, // 60 minutes
    MIN_REST_TIME: 5, // 5 seconds
    MAX_REST_TIME: 600, // 10 minutes
  },
  
  INTERVALS: {
    TIMER_UPDATE: 100, // ms - for precise timing
    WEBSOCKET_RECONNECT: 3000, // ms
    POLLING_FALLBACK: 100, // ms
  },
  
  SIZES: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    DISPLAY: 'display',
  },
  
  VARIANTS: {
    DEFAULT: 'default',
    CARD: 'card',
    MINIMAL: 'minimal',
    OUTLINED: 'outlined',
  },
  
  COLORS: {
    PRIMARY: '#59FF3A',
    SECONDARY: '#5a5a60',
    BACKGROUND: '#121214',
    SURFACE: '#17171a',
    BORDER: '#252529',
    FIGHT: '#59FF3A', // Green for fight
    REST: '#3B82F6', // Blue for rest
    FINISHED: '#6B7280', // Gray for finished
  },

  PHASES: {
    IDLE: 'idle',
    FIGHT: 'fight',
    REST: 'rest',
    FINISHED: 'finished',
  },

  LABELS: {
    START_TRAINING: 'Start Training',
    PAUSE_TRAINING: 'Pause Training',
    RESUME_TRAINING: 'Resume Training',
    FIGHT: 'Fight',
    REST: 'Rest',
    FINISHED: 'Finished',
    ROUND: 'Round',
    OF: 'of',
  }
} as const;

export const API_ENDPOINTS = {
  TIMER: {
    CURRENT: '/api/timer/current',
    CONFIG: '/api/timer/config',
    CONTROL: '/api/timer/control',
  },
  PROFILE: {
    PUBLIC: '/api/profile/public',
    USER: '/api/profile/:userId',
  },
  WEBSOCKET: '/ws',
} as const;

export const ROUTES = {
  HOME: '/',
  MOBILE: '/mobile',
  CONTROL: '/control',
  TV: '/tv',
  PROFILE: '/profile',
  CONFIG: '/config',
} as const;
