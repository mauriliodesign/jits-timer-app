// Common Button Component
import React from 'react';
import { ButtonProps } from '@/types/common';
import { cn } from '@/lib/utils';

const buttonVariants = {
  primary: 'bg-[#59FF3A] text-[#121214] hover:bg-[#4CE62E]',
  secondary: 'bg-[#1e1e21] text-white hover:bg-[#252529] border border-[#252529]',
  outline: 'bg-transparent text-white border border-[#252529] hover:bg-[#1e1e21]',
};

const buttonSizes = {
  small: 'h-8 px-3 text-sm',
  medium: 'h-10 px-4 text-base',
  large: 'h-12 px-6 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};
