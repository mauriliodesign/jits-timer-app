// Stepper Component (Refactored)
import React from 'react';
import { StepperProps } from '@/types/common';
import { Button } from './Button';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizeConfigs = {
  small: {
    container: 'p-2',
    value: 'text-sm sm:text-base',
    label: 'text-xs sm:text-sm',
    controls: 'h-6 w-6 sm:h-8 sm:w-8',
    icon: 'h-3 w-3 sm:h-4 sm:w-4',
    spacing: 'space-x-1 sm:space-x-2'
  },
  medium: {
    container: 'p-3 sm:p-4',
    value: 'text-base sm:text-lg',
    label: 'text-sm sm:text-base',
    controls: 'h-8 w-8 sm:h-10 sm:w-10',
    icon: 'h-4 w-4 sm:h-5 sm:w-5',
    spacing: 'space-x-2 sm:space-x-3'
  },
  large: {
    container: 'p-4 sm:p-6',
    value: 'text-lg sm:text-xl lg:text-2xl',
    label: 'text-base sm:text-lg',
    controls: 'h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14',
    icon: 'h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7',
    spacing: 'space-x-3 sm:space-x-4 lg:space-x-6'
  }
};

const variantConfigs = {
  default: {
    container: 'bg-[#17171a] border border-[#1e1e21] rounded-xl',
    controls: 'bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white',
    value: 'text-white',
    label: 'text-[#5a5a60]'
  },
  minimal: {
    container: 'bg-transparent',
    controls: 'bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white',
    value: 'text-white',
    label: 'text-[#5a5a60]'
  },
  outlined: {
    container: 'bg-transparent border border-[#252529] rounded-xl',
    controls: 'bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white',
    value: 'text-white',
    label: 'text-[#5a5a60]'
  }
};

export const Stepper: React.FC<StepperProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 999,
  step = 1,
  size = 'medium',
  variant = 'default',
  showValue = true,
  placeholder = "—",
  label,
  className = '',
  disabled = false,
  readOnly = false,
}) => {
  const sizeConfig = sizeConfigs[size];
  const variantConfig = variantConfigs[variant];

  const handleDecrease = () => {
    if (disabled || readOnly) return;
    const newValue = Math.max(min, value - step);
    onValueChange(newValue);
  };

  const handleIncrease = () => {
    if (disabled || readOnly) return;
    const newValue = Math.min(max, value + step);
    onValueChange(newValue);
  };

  const displayValue = showValue && value > 0 ? value : placeholder;
  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <div className={cn(variantConfig.container, sizeConfig.container, className)}>
      {label && (
        <label className={cn('block', sizeConfig.label, variantConfig.label, 'font-medium mb-2 sm:mb-3')}>
          {label}
        </label>
      )}

      <div className={cn('flex items-center justify-center', sizeConfig.spacing)}>
        <Button
          onClick={handleDecrease}
          disabled={disabled || readOnly || isAtMin}
          variant="outline"
          size="small"
          icon={<Minus className={sizeConfig.icon} />}
          className={cn(
            'rounded-full border',
            variantConfig.controls,
            sizeConfig.controls,
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          )}
        />

        {showValue && (
          <div className={cn(
            'w-12 sm:w-16 lg:w-20 text-center font-mono tracking-wider',
            sizeConfig.value,
            variantConfig.value
          )}>
            {displayValue}
          </div>
        )}

        <Button
          onClick={handleIncrease}
          disabled={disabled || readOnly || isAtMax}
          variant="outline"
          size="small"
          icon={<Plus className={sizeConfig.icon} />}
          className={cn(
            'rounded-full border',
            variantConfig.controls,
            sizeConfig.controls,
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          )}
        />
      </div>
    </div>
  );
};
