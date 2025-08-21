// Common Types
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AcademyProfile {
  id: string;
  userId: string;
  academyName: string;
  instructorName: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface StepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'outlined';
  showValue?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
}
