// Application Constants
export const TIMER_CONSTANTS = {
  DEFAULT_CONFIG: {
    rounds: 5,
    roundDuration: 6, // minutes
    restTime: 60, // seconds
  },
  
  LIMITS: {
    MIN_ROUNDS: 1,
    MAX_ROUNDS: 50,
    MIN_ROUND_DURATION: 1, // minutes
    MAX_ROUND_DURATION: 120, // minutes
    MIN_REST_TIME: 5, // seconds
    MAX_REST_TIME: 600, // seconds
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
