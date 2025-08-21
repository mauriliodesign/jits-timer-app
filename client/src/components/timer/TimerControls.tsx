// Timer Controls Component
import React from 'react';
import { TimerControlsProps } from '@/types/timer';
import { Button } from '@/components/common/Button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizeConfigs = {
  small: {
    container: 'gap-2',
    controls: 'h-8 w-8',
    icon: 'h-3 w-3',
  },
  large: {
    container: 'gap-3',
    controls: 'h-12 w-12',
    icon: 'h-5 w-5',
  },
  display: {
    container: 'gap-4',
    controls: 'h-14 w-14',
    icon: 'h-6 w-6',
  },
};

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  size = 'large',
  disabled = false,
  className = '',
}) => {
  const sizeConfig = sizeConfigs[size];

  return (
    <div className={cn('flex justify-center items-center', sizeConfig.container, className)}>
      {!isRunning ? (
        <Button
          onClick={onStart}
          disabled={disabled}
          variant="outline"
          size="small"
          icon={<Play className={sizeConfig.icon} />}
          className={cn(
            'rounded-full border bg-white/8 hover:bg-white/16 text-white border-white/20',
            sizeConfig.controls
          )}
        />
      ) : (
        <Button
          onClick={onPause}
          disabled={disabled}
          variant="outline"
          size="small"
          icon={<Pause className={sizeConfig.icon} />}
          className={cn(
            'rounded-full border bg-white/8 hover:bg-white/16 text-white border-white/20',
            sizeConfig.controls
          )}
        />
      )}
      
      <Button
        onClick={onReset}
        disabled={disabled}
        variant="outline"
        size="small"
        icon={<RotateCcw className={sizeConfig.icon} />}
        className={cn(
          'rounded-full border bg-white/8 hover:bg-white/16 text-white border-white/20',
          sizeConfig.controls
        )}
      />
    </div>
  );
};
