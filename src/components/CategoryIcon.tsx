import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  // If emoji or custom string
  if (name && name.length <= 2 && !/[a-zA-Z]/.test(name)) {
    return <span className={`inline-block ${className}`}>{name}</span>;
  }

  // Look up Lucide icon dynamically
  const IconComponent = (Icons as Record<string, any>)[name] || Icons.Tag;
  return <IconComponent className={className} />;
};
