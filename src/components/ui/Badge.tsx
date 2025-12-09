import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-hero-primary text-white',
    success: 'bg-hero-success text-white',
    warning: 'bg-hero-warning text-white',
    danger: 'bg-hero-danger text-white',
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

