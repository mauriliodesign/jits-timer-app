import React from 'react';
import { formatTime } from '@/lib/timer-utils';

// Types
export interface TimerDisplayProps {
  currentRound: number;
  currentTime: number;
  totalRounds: number;
  isResting: boolean;
  isTrainingStarted: boolean;
  className?: string;
}

export interface TimerDisplayItemProps {
  label: string;
  value: string | number;
  className?: string;
}

// Utility function to safely get values
const getSafeValue = (value: any, defaultValue: number): number => {
  if (value === null || value === undefined || value === '' || isNaN(value)) {
    return defaultValue;
  }
  return Math.max(1, parseInt(value) || defaultValue);
};

// Individual timer display item component
const TimerDisplayItem: React.FC<TimerDisplayItemProps> = ({ 
  label, 
  value, 
  className = "" 
}) => (
  <div className={className}>
    <div className="text-caption mb-1">{label}</div>
    <div className="timer-display-large">
      {value}
    </div>
  </div>
);

// Main timer display component
export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  currentRound,
  currentTime,
  totalRounds,
  isResting,
  isTrainingStarted,
  className = ""
}) => {
  // Format display values
  const displayRound = isTrainingStarted 
    ? getSafeValue(currentRound, 1) 
    : "—";

  const displayTime = isTrainingStarted 
    ? formatTime(getSafeValue(currentTime, 0))
    : "00:00";

  const displayTotal = isTrainingStarted 
    ? getSafeValue(totalRounds, 5)
    : "—";

  const timeLabel = isResting ? "Descanso" : "Tempo";

  return (
    <div className={`app-card-compact section-spacing ${className}`}>
      <div className="grid-status">
        <TimerDisplayItem
          label="Rola Atual"
          value={displayRound}
        />
        <TimerDisplayItem
          label={timeLabel}
          value={displayTime}
        />
        <TimerDisplayItem
          label="Total"
          value={displayTotal}
        />
      </div>
    </div>
  );
};

export default TimerDisplay;
