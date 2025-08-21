// Loading Component
import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const loadingSizes = {
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  large: 'h-12 w-12',
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text = 'Carregando...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-[#59FF3A] ${loadingSizes[size]} mb-4`} />
      {text && <p className="text-[#5a5a60]">{text}</p>}
    </div>
  );
};
