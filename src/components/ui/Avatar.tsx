import React from 'react';

interface AvatarProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ emoji, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
    xl: 'w-32 h-32 text-7xl',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-hero-primary to-hero-secondary ${sizeClasses[size]} ${className}`}
    >
      <span>{emoji}</span>
    </div>
  );
};

