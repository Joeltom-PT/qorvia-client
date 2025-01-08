import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  rounded?: boolean;
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  fullWidth = false,
  rounded = false,
  className = '', 
}) => {
  const baseStyles = 'font-semibold transition-colors duration-300 box-border';

  const variantStyles = {
    primary: 'bg-blue-900 text-white border-2 border-blue-900 hover:bg-blue-950',
    secondary: 'bg-white text-blue-900 border-2 border-blue-900 hover:bg-blue-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const roundedStyle = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${roundedStyle} ${className}`} // Update this line
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
