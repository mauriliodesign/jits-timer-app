// Time Input Component
import React from 'react';
import { Stepper } from './Stepper';
import { cn } from '@/lib/utils';
import { timeUtils } from '@/utils/timeUtils';

interface TimeInputProps {
  value: number; // in seconds
  onValueChange: (value: number) => void;
  label: string;
  minMinutes?: number;
  maxMinutes?: number;
  minSeconds?: number;
  maxSeconds?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'outlined';
  className?: string;
  disabled?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onValueChange,
  label,
  minMinutes = 0,
  maxMinutes = 60,
  minSeconds = 0,
  maxSeconds = 59,
  size = 'medium',
  variant = 'default',
  className = '',
  disabled = false,
}) => {
  const { minutes, seconds } = timeUtils.secondsToMinutesSeconds(value);

  const handleMinutesChange = (newMinutes: number) => {
    const clampedMinutes = Math.max(minMinutes, Math.min(maxMinutes, newMinutes));
    const newValue = timeUtils.minutesSecondsToSeconds(clampedMinutes, seconds);
    onValueChange(newValue);
  };

  const handleSecondsChange = (newSeconds: number) => {
    const clampedSeconds = Math.max(minSeconds, Math.min(maxSeconds, newSeconds));
    const newValue = timeUtils.minutesSecondsToSeconds(minutes, clampedSeconds);
    onValueChange(newValue);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-[#5a5a60] mb-2">
        {label}
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        <Stepper
          value={minutes}
          onValueChange={handleMinutesChange}
          min={minMinutes}
          max={maxMinutes}
          step={1}
          size={size}
          variant={variant}
          showValue={true}
          placeholder="0"
          label="Minutes"
          disabled={disabled}
          className="text-center"
        />
        
        <Stepper
          value={seconds}
          onValueChange={handleSecondsChange}
          min={minSeconds}
          max={maxSeconds}
          step={5}
          size={size}
          variant={variant}
          showValue={true}
          placeholder="0"
          label="Seconds"
          disabled={disabled}
          className="text-center"
        />
      </div>
      
      <div className="text-center text-sm text-[#5a5a60]">
        Total: {timeUtils.formatTime(value)}
      </div>
    </div>
  );
};
