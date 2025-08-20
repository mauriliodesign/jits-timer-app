import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Types
export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'large';

export interface ButtonSystemProps {
  // Core props
  children: React.ReactNode;
  onClick?: () => void;
  
  // Variant and size
  variant?: ButtonVariant;
  size?: ButtonSize;
  
  // States
  disabled?: boolean;
  loading?: boolean;
  
  // Styling
  className?: string;
  fullWidth?: boolean;
  
  // Additional props
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

// Size configurations
const SIZE_CONFIGS = {
  small: {
    container: 'h-10 px-4 text-sm',
    icon: 'h-4 w-4',
    spacing: 'gap-2'
  },
  large: {
    container: 'h-14 lg:h-16 px-6 text-base lg:text-lg',
    icon: 'h-5 w-5 lg:h-6 lg:w-6',
    spacing: 'gap-3'
  }
};

// Variant configurations
const VARIANT_CONFIGS = {
  primary: {
    base: 'bg-[#59FF3A] hover:bg-[#4DEB2E] text-[#121214] font-bold',
    disabled: 'bg-[#59FF3A]/50 text-[#121214]/50 cursor-not-allowed',
    loading: 'bg-[#59FF3A]/80 text-[#121214]/80 cursor-wait'
  },
  secondary: {
    base: 'bg-white/8 hover:bg-white/16 text-white border border-white/20',
    disabled: 'bg-white/4 text-white/50 border-white/10 cursor-not-allowed',
    loading: 'bg-white/6 text-white/70 border-white/15 cursor-wait'
  }
};

// Main button system component
export const ButtonSystem: React.FC<ButtonSystemProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  // Get configurations
  const sizeConfig = SIZE_CONFIGS[size];
  const variantConfig = VARIANT_CONFIGS[variant];

  // Determine state classes
  const getStateClasses = () => {
    if (loading) return variantConfig.loading;
    if (disabled) return variantConfig.disabled;
    return variantConfig.base;
  };

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        // Base classes
        'rounded-xl transition-all duration-200 font-medium',
        // Size classes
        sizeConfig.container,
        // Variant and state classes
        getStateClasses(),
        // Width
        fullWidth ? 'w-full' : '',
        // Custom classes
        className
      )}
    >
      {/* Icon Left */}
      {icon && iconPosition === 'left' && (
        <span className={cn('flex items-center', sizeConfig.icon)}>
          {icon}
        </span>
      )}

      {/* Content */}
      <span className="flex items-center justify-center">
        {children}
      </span>

      {/* Icon Right */}
      {icon && iconPosition === 'right' && (
        <span className={cn('flex items-center', sizeConfig.icon)}>
          {icon}
        </span>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="ml-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        </div>
      )}
    </Button>
  );
};

// Convenience components for common use cases
export const PrimaryButton: React.FC<Omit<ButtonSystemProps, 'variant'>> = (props) => (
  <ButtonSystem variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonSystemProps, 'variant'>> = (props) => (
  <ButtonSystem variant="secondary" {...props} />
);

export const SmallButton: React.FC<Omit<ButtonSystemProps, 'size'>> = (props) => (
  <ButtonSystem size="small" {...props} />
);

export const LargeButton: React.FC<Omit<ButtonSystemProps, 'size'>> = (props) => (
  <ButtonSystem size="large" {...props} />
);

// Specific button combinations
export const PrimaryLargeButton: React.FC<Omit<ButtonSystemProps, 'variant' | 'size'>> = (props) => (
  <ButtonSystem variant="primary" size="large" {...props} />
);

export const SecondaryLargeButton: React.FC<Omit<ButtonSystemProps, 'variant' | 'size'>> = (props) => (
  <ButtonSystem variant="secondary" size="large" {...props} />
);

export const PrimarySmallButton: React.FC<Omit<ButtonSystemProps, 'variant' | 'size'>> = (props) => (
  <ButtonSystem variant="primary" size="small" {...props} />
);

export const SecondarySmallButton: React.FC<Omit<ButtonSystemProps, 'variant' | 'size'>> = (props) => (
  <ButtonSystem variant="secondary" size="small" {...props} />
);

export default ButtonSystem;
