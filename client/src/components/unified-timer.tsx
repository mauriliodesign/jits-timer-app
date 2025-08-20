import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { formatTime } from '@/lib/timer-utils';

// Types
export type TimerMode = 'clock' | 'timer' | 'countdown';
export type TimerSize = 'small' | 'large' | 'display';

export interface UnifiedTimerProps {
  // Core props
  mode: TimerMode;
  size?: TimerSize;
  className?: string;
  
  // Timer specific props
  initialTime?: number; // in seconds
  isRunning?: boolean;
  onTimeUpdate?: (time: number) => void;
  onStateChange?: (isRunning: boolean) => void;
  onComplete?: () => void;
  
  // Display props
  showControls?: boolean;
  showLabels?: boolean;
  customLabels?: {
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
  
  // Styling props
  variant?: 'default' | 'card' | 'minimal';
  color?: 'white';
}

// Size configurations
const SIZE_CONFIGS = {
  small: {
    container: 'p-2',
    time: 'text-lg sm:text-xl lg:text-2xl',
    label: 'text-xs sm:text-sm',
    controls: 'h-8 w-8 sm:h-10 sm:w-10',
    icon: 'h-3 w-3 sm:h-4 sm:w-4'
  },
  large: {
    container: 'p-4 sm:p-6',
    time: 'text-4xl sm:text-5xl lg:text-6xl',
    label: 'text-base sm:text-lg',
    controls: 'h-12 w-12 sm:h-14 sm:w-14',
    icon: 'h-5 w-5 sm:h-6 sm:w-6'
  },
  display: {
    container: 'p-6 sm:p-8',
    time: 'text-6xl sm:text-7xl lg:text-8xl xl:text-9xl',
    label: 'text-lg sm:text-xl',
    controls: 'h-14 w-14 sm:h-16 sm:w-16',
    icon: 'h-6 w-6 sm:h-7 sm:w-7'
  }
};

// Color configurations
const COLOR_CONFIGS = {
  white: {
    time: 'text-white',
    label: 'text-[#4a4a4f]',
    controls: 'bg-white/8 hover:bg-white/16 text-white border-white/20'
  }
};

// Variant configurations
const VARIANT_CONFIGS = {
  default: 'bg-transparent',
  card: 'app-card-compact',
  minimal: 'bg-transparent border-none'
};

// Main unified timer component
export const UnifiedTimer: React.FC<UnifiedTimerProps> = ({
  mode = 'timer',
  size = 'large',
  className = '',
  initialTime = 0,
  isRunning = false,
  onTimeUpdate,
  onStateChange,
  onComplete,
  showControls = true,
  showLabels = true,
  customLabels = {},
  variant = 'default',
  color = 'white'
}) => {
  // State
  const [time, setTime] = useState(initialTime);
  const [running, setRunning] = useState(isRunning);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get configurations
  const sizeConfig = SIZE_CONFIGS[size];
  const colorConfig = COLOR_CONFIGS[color];
  const variantConfig = VARIANT_CONFIGS[variant];

  // Clock mode effect
  useEffect(() => {
    if (mode === 'clock') {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Timer mode effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (mode === 'timer' && running) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    } else if (mode === 'countdown' && running && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime - 1;
          onTimeUpdate?.(newTime);
          
          if (newTime <= 0) {
            setRunning(false);
            onComplete?.();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [mode, running, time, onTimeUpdate, onComplete]);

  // Sync with external state
  useEffect(() => {
    setRunning(isRunning);
  }, [isRunning]);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  // Control handlers
  const handleStart = () => {
    setRunning(true);
    onStateChange?.(true);
  };

  const handlePause = () => {
    setRunning(false);
    onStateChange?.(false);
  };

  const handleReset = () => {
    setRunning(false);
    setTime(initialTime);
    onStateChange?.(false);
    onTimeUpdate?.(initialTime);
  };

  // Get display time
  const getDisplayTime = () => {
    if (mode === 'clock') {
      return currentTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    return formatTime(time);
  };

  // Get display labels
  const getDisplayLabels = () => {
    if (mode === 'clock') {
      return {
        hours: customLabels.hours || 'Horas',
        minutes: customLabels.minutes || 'Minutos',
        seconds: customLabels.seconds || 'Segundos'
      };
    }
    return {
      hours: customLabels.hours || 'H',
      minutes: customLabels.minutes || 'M',
      seconds: customLabels.seconds || 'S'
    };
  };

  const labels = getDisplayLabels();

  return (
    <div className={`${variantConfig} ${sizeConfig.container} ${className}`}>
      {/* Time Display */}
      <div className="text-center">
        {showLabels && mode === 'clock' && (
          <div className={`${sizeConfig.label} ${colorConfig.label} mb-1`}>
            {labels.hours} : {labels.minutes} : {labels.seconds}
          </div>
        )}
        
        <div className={`timer-display ${sizeConfig.time} ${colorConfig.time} font-mono tracking-wider`}>
          {getDisplayTime()}
        </div>
        
        {showLabels && mode !== 'clock' && (
          <div className={`${sizeConfig.label} ${colorConfig.label} mt-1`}>
            {mode === 'timer' ? 'Timer' : 'Countdown'}
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && mode !== 'clock' && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {!running ? (
            <Button
              onClick={handleStart}
              className={`${sizeConfig.controls} rounded-full border ${colorConfig.controls}`}
            >
              <Play className={sizeConfig.icon} />
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              className={`${sizeConfig.controls} rounded-full border ${colorConfig.controls}`}
            >
              <Pause className={sizeConfig.icon} />
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            className={`${sizeConfig.controls} rounded-full border ${colorConfig.controls}`}
          >
            <RotateCcw className={sizeConfig.icon} />
          </Button>
        </div>
      )}

      {/* Clock Icon for Clock Mode */}
      {mode === 'clock' && (
        <div className="flex justify-center mt-2">
          <Clock className={`${sizeConfig.icon} ${colorConfig.label}`} />
        </div>
      )}
    </div>
  );
};

export default UnifiedTimer;
