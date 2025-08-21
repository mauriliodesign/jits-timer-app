// Round Indicator Component
import React from 'react';
import { RoundIndicatorProps } from '@/types/timer';
import { cn } from '@/lib/utils';

const sizeConfigs = {
  small: {
    container: 'space-x-1',
    indicator: 'w-4 h-4 text-xs',
  },
  medium: {
    container: 'space-x-2',
    indicator: 'w-6 h-6 text-sm',
  },
  large: {
    container: 'space-x-3',
    indicator: 'w-8 h-8 text-base',
  },
};

export const RoundIndicator: React.FC<RoundIndicatorProps> = ({
  currentRound,
  totalRounds,
  isRunning,
  size = 'medium',
  className = '',
}) => {
  const sizeConfig = sizeConfigs[size];

  return (
    <div className={cn('flex justify-center', sizeConfig.container, className)}>
      {Array.from({ length: totalRounds }).map((_, index) => {
        const roundNumber = index + 1;
        const isCompleted = roundNumber < currentRound;
        const isCurrent = roundNumber === currentRound;
        
        return (
          <div
            key={index}
            className={cn(
              'rounded-full transition-all duration-300 flex items-center justify-center font-bold',
              sizeConfig.indicator,
              {
                'bg-[#59FF3A] text-[#121214]': isCompleted || (isCurrent && isRunning),
                'bg-[#2a2a2e] text-white': !isCompleted && !isCurrent,
                'animate-pulse': isCurrent && isRunning,
              }
            )}
          >
            {roundNumber}
          </div>
        );
      })}
    </div>
  );
};
