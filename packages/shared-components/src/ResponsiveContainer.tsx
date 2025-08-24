import React from 'react';

export type ContainerVariant = 'page' | 'content' | 'narrow' | 'wide' | 'full';

export interface ResponsiveContainerProps {
  variant: ContainerVariant;
  className?: string;
  children: React.ReactNode;
}

const getContainerClasses = (variant: ContainerVariant): string => {
  switch (variant) {
    case 'page':
      return 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'; // Main page content
    case 'content':
      return 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'; // Article/blog content
    case 'narrow':
      return 'max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'; // Forms, narrow content
    case 'wide':
      return 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'; // Wide content areas
    case 'full':
      return 'w-full px-4 sm:px-6 lg:px-8'; // Full width with padding
    default:
      return 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  }
};

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  variant, 
  className = '', 
  children 
}) => {
  const containerClasses = getContainerClasses(variant);
  
  return (
    <div className={`${containerClasses} ${className}`}>
      {children}
    </div>
  );
};