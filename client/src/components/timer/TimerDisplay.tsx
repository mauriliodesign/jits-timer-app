// Timer Display Component
import React from 'react';
import { TimerDisplayProps } from '@/types/timer';
import { timeUtils } from '@/utils/timeUtils';
import { cn } from '@/lib/utils';

const sizeConfigs = {
  small: {
    container: 'p-2',
    time: 'text-lg sm:text-xl lg:text-2xl',
    label: 'text-xs sm:text-sm',
  },
  large: {
    container: 'p-4 sm:p-6',
    time: 'text-4xl sm:text-5xl lg:text-6xl',
    label: 'text-base sm:text-lg',
  },
  display: {
    container: 'p-6 sm:p-8',
    time: 'text-6xl sm:text-7xl lg:text-8xl xl:text-9xl',
    label: 'text-lg sm:text-xl',
  },
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  time,
  mode,
  size = 'large',
  showLabels = true,
  customLabels = {},
  className = '',
}) => {
  const sizeConfig = sizeConfigs[size];

  const getDisplayTime = () => {
    if (mode === 'clock') {
      return timeUtils.getCurrentTime();
    }
    return timeUtils.formatTime(time);
  };

  const getDisplayLabels = () => {
    if (mode === 'clock') {
      return {
        hours: customLabels.hours || 'Horas',
        minutes: customLabels.minutes || 'Minutos',
        seconds: customLabels.seconds || 'Segundos',
      };
    }
    return {
      hours: customLabels.hours || 'H',
      minutes: customLabels.minutes || 'M',
      seconds: customLabels.seconds || 'S',
    };
  };

  const labels = getDisplayLabels();

  return (
    <div className={cn(sizeConfig.container, className)}>
      <div className="text-center">
        {showLabels && mode === 'clock' && (
          <div className={cn(sizeConfig.label, 'text-[#4a4a4f] mb-1')}>
            {labels.hours} : {labels.minutes} : {labels.seconds}
          </div>
        )}
        
        <div className={cn(
          'timer-display font-mono tracking-wider text-white',
          sizeConfig.time
        )}>
          {getDisplayTime()}
        </div>
        
        {showLabels && mode !== 'clock' && (
          <div className={cn(sizeConfig.label, 'text-[#4a4a4f] mt-1')}>
            {mode === 'timer' ? 'Timer' : 'Countdown'}
          </div>
        )}
      </div>
    </div>
  );
};
