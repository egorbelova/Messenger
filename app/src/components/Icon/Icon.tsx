// components/Icon/Icon.tsx
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  return (
    <svg className={`${className}`}>
      <use href={`#${name}`} />
    </svg>
  );
};

export default Icon;
