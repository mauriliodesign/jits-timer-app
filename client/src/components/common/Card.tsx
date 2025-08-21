// Card Component
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const cardVariants = {
    default: 'bg-[#17171a] border border-[#1e1e21] rounded-xl p-4 sm:p-6',
    compact: 'bg-[#17171a] border border-[#1e1e21] rounded-xl p-2 sm:p-4',
  };

  return (
    <div className={cn(cardVariants[variant], className)}>
      {children}
    </div>
  );
};
