import React from 'react';
import { calculateTotalTime } from '@/lib/timer-utils';

// Types
export interface TotalTimeDisplayProps {
  config: {
    rounds: number;
    roundDuration: number;
    restTime: number;
  };
  isConfigComplete: boolean;
  onOpenTV: () => void;
  className?: string;
}

// Main total time display component
export const TotalTimeDisplay: React.FC<TotalTimeDisplayProps> = ({
  config,
  isConfigComplete,
  onOpenTV,
  className = ""
}) => {
  const totalTime = isConfigComplete 
    ? calculateTotalTime(config.rounds, config.roundDuration, config.restTime)
    : "—";

  return (
    <div className={`app-card-compact ${className}`}>
      <div className="text-center mb-6">
        <div className="text-heading-small mb-2">Tempo Total</div>
        <div className="timer-display-medium">
          {totalTime}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="space-y-3">
        <button
          onClick={onOpenTV}
          className="w-full h-12 lg:h-14 bg-white/8 hover:bg-white/16 text-sm lg:text-base font-medium rounded-xl border border-white/20"
        >
          <svg className="inline mr-2 h-4 w-4 lg:h-5 lg:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Abrir Tela da TV
        </button>
      </div>
    </div>
  );
};

export default TotalTimeDisplay;
