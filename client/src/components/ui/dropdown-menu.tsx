// Simple Dropdown Menu Component
import React from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  forceMount?: boolean;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  return <div>{children}</div>;
};

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, className = '' }) => {
  return <div className={`absolute right-0 top-full mt-2 bg-[#17171a] border border-[#1e1e21] rounded-md shadow-lg z-50 ${className}`}>{children}</div>;
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, className = '', onClick, disabled }) => {
  return (
    <button 
      className={`block w-full text-left px-3 py-2 text-sm ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({ className = '' }) => {
  return <div className={`h-px bg-[#252529] my-1 ${className}`} />;
};
