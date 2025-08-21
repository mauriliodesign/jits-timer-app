// Phase Status Component
import React from 'react';
import { TimerPhase } from '@/types/timer';
import { TIMER_CONSTANTS } from '@/utils/constants';
import { cn } from '@/lib/utils';

interface PhaseStatusProps {
  phase: TimerPhase;
  isRunning: boolean;
  className?: string;
}

const phaseConfigs = {
  idle: {
    label: 'Ready to Start',
    color: 'text-[#5a5a60]',
    bgColor: 'bg-transparent',
  },
  fight: {
    label: 'Fight',
    color: 'text-white',
    bgColor: isRunning => isRunning ? 'bg-[#59FF3A]' : 'bg-[#59FF3A]/50',
  },
  rest: {
    label: 'Rest',
    color: 'text-white',
    bgColor: isRunning => isRunning ? 'bg-[#3B82F6]' : 'bg-[#3B82F6]/50',
  },
  finished: {
    label: 'Finished',
    color: 'text-white',
    bgColor: 'bg-[#6B7280]',
  },
};

export const PhaseStatus: React.FC<PhaseStatusProps> = ({
  phase,
  isRunning,
  className = '',
}) => {
  const config = phaseConfigs[phase];
  const bgColor = typeof config.bgColor === 'function' ? config.bgColor(isRunning) : config.bgColor;

  return (
    <div className={cn(
      'px-4 py-2 rounded-lg text-center font-medium transition-colors',
      bgColor,
      config.color,
      className
    )}>
      {config.label}
    </div>
  );
};
