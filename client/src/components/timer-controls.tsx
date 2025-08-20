import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Monitor } from 'lucide-react';

// Types
export interface TimerControlsProps {
  currentSession: any;
  isConfigComplete: boolean;
  isTrainingStarted: boolean;
  isConnected: boolean;
  configMutation: { isPending: boolean };
  controlMutation: { isPending: boolean };
  onStart: () => void;
  onPause: () => void;
  onContinue: () => void;
  onReset: () => void;
  onOpenTV: () => void;
  className?: string;
}

// Utility function to safely get values
const getSafeValue = (value: any, defaultValue: any) => {
  if (value === null || value === undefined || value === '' || isNaN(value)) {
    return defaultValue;
  }
  return value;
};

// Main timer controls component
export const TimerControls: React.FC<TimerControlsProps> = ({
  currentSession,
  isConfigComplete,
  isTrainingStarted,
  isConnected,
  configMutation,
  controlMutation,
  onStart,
  onPause,
  onContinue,
  onReset,
  onOpenTV,
  className = ""
}) => {
  // Determine button state and text
  const getButtonState = () => {
    if (!currentSession) {
      return {
        text: "Carregando...",
        icon: <Play className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />,
        disabled: true
      };
    }

    const isRunning = getSafeValue(currentSession.isRunning, false);
    const currentTime = getSafeValue(currentSession.currentTime, 0);

    if (isRunning) {
      return {
        text: "Pausar Treino",
        icon: <Pause className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />,
        disabled: false
      };
    }

    if (currentTime > 0) {
      return {
        text: "Continuar Treino",
        icon: <Play className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />,
        disabled: false
      };
    }

    return {
      text: "Iniciar Treino",
      icon: <Play className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />,
      disabled: !isConfigComplete()
    };
  };

  const buttonState = getButtonState();

  // Handle main button click
  const handleMainButtonClick = () => {
    if (!currentSession) return;

    const isRunning = getSafeValue(currentSession.isRunning, false);
    const currentTime = getSafeValue(currentSession.currentTime, 0);

    if (!isRunning && currentTime === 0) {
      onStart();
    } else if (isRunning) {
      onPause();
    } else if (!isRunning && currentTime > 0) {
      onContinue();
    }
  };

  return (
    <div className={`grid-controls section-spacing ${className}`}>
      {/* Main Control Button */}
      <Button
        onClick={handleMainButtonClick}
        disabled={
          !currentSession || 
          (!isConfigComplete && !isTrainingStarted) || 
          configMutation.isPending || 
          controlMutation.isPending ||
          buttonState.disabled
        }
        className="w-full h-14 lg:h-16 bg-[#59FF3A] hover:bg-[#4DEB2E] text-[#121214] text-base lg:text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonState.icon}
        {buttonState.text}
      </Button>
      
      {/* Reset Button */}
      <Button
        onClick={onReset}
        disabled={!currentSession || controlMutation.isPending}
        className="h-14 lg:h-16 bg-white/8 hover:bg-white/16 text-white rounded-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Resetar
      </Button>

      {/* TV Button */}
      <Button
        onClick={onOpenTV}
        className="w-full h-12 lg:h-14 bg-white/8 hover:bg-white/16 text-sm lg:text-base font-medium rounded-xl border border-white/20"
      >
        <Monitor className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
        Abrir Tela da TV
      </Button>
    </div>
  );
};

export default TimerControls;
