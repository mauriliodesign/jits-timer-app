import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Settings } from 'lucide-react';

// Types
export interface ConfigLimits {
  rounds: { min: number; max: number };
  roundDuration: { min: number; max: number };
  restTime: { min: number; max: number };
}

export interface ConfigState {
  rounds: number;
  roundDuration: number;
  restTime: number;
}

export interface ConfigChangedState {
  rounds: boolean;
  roundDuration: boolean;
  restTime: boolean;
}

export interface ConfigControlsProps {
  config: ConfigState;
  configChanged: ConfigChangedState;
  limits: ConfigLimits;
  onConfigChange: (field: keyof ConfigState, value: number) => void;
  className?: string;
}

export interface ConfigItemProps {
  label: string;
  value: number;
  isChanged: boolean;
  limits: { min: number; max: number };
  onDecrease: () => void;
  onIncrease: () => void;
  step?: number;
}

// Individual configuration item component
const ConfigItem: React.FC<ConfigItemProps> = ({
  label,
  value,
  isChanged,
  limits,
  onDecrease,
  onIncrease,
  step = 1
}) => (
  <div className="section-spacing-compact">
    <label className="block text-heading-small font-medium mb-2 sm:mb-3 text-[#5a5a60]">
      {label}
    </label>
    <div className="flex items-center justify-center space-x-2 sm:space-x-4">
      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white disabled:opacity-50"
        onClick={onDecrease}
        disabled={isChanged && value <= limits.min}
      >
        <Minus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
      </Button>
      <div className="w-10 sm:w-12 lg:w-16 text-center">
        <span className="timer-display-medium">
          {isChanged ? value : "—"}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white disabled:opacity-50"
        onClick={onIncrease}
        disabled={isChanged && value >= limits.max}
      >
        <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
      </Button>
    </div>
  </div>
);

// Main configuration controls component
export const ConfigControls: React.FC<ConfigControlsProps> = ({
  config,
  configChanged,
  limits,
  onConfigChange,
  className = ""
}) => {
  const handleConfigChange = (field: keyof ConfigState, increment: number) => {
    const currentValue = config[field];
    const newValue = currentValue + increment;
    onConfigChange(field, newValue);
  };

  return (
    <div className={`app-card-compact ${className}`}>
      <div className="flex items-center mb-3 sm:mb-4 lg:mb-6">
        <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[#59FF3A] mr-2" />
        <h2 className="text-heading-large">Configurações</h2>
      </div>
      
      <ConfigItem
        label="Número de Rolas"
        value={config.rounds}
        isChanged={configChanged.rounds}
        limits={limits.rounds}
        onDecrease={() => handleConfigChange("rounds", -1)}
        onIncrease={() => handleConfigChange("rounds", 1)}
      />

      <ConfigItem
        label="Duração da Rola (minutos)"
        value={config.roundDuration}
        isChanged={configChanged.roundDuration}
        limits={limits.roundDuration}
        onDecrease={() => handleConfigChange("roundDuration", -1)}
        onIncrease={() => handleConfigChange("roundDuration", 1)}
      />

      <ConfigItem
        label="Tempo de Descanso (segundos)"
        value={config.restTime}
        isChanged={configChanged.restTime}
        limits={limits.restTime}
        onDecrease={() => handleConfigChange("restTime", -5)}
        onIncrease={() => handleConfigChange("restTime", 5)}
        step={5}
      />
    </div>
  );
};

export default ConfigControls;
