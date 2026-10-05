import React from 'react';
import { sounds } from '../audio/SoundEngine';

interface WoodenButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'green' | 'blue' | 'purple' | 'red';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const WoodenButton: React.FC<WoodenButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'green':
        return 'wood-btn-green text-white';
      case 'blue':
        return 'wood-btn-blue text-white';
      case 'purple':
        return 'wood-btn-purple text-white';
      case 'red':
        return 'wood-btn-red text-white';
      case 'primary':
      default:
        return 'wood-btn-primary text-amber-950 font-bold';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-xl min-h-[40px]';
      case 'lg':
        return 'px-6 py-3 text-xl rounded-2xl min-h-[56px]';
      case 'xl':
        return 'px-8 py-4 text-2xl rounded-3xl min-h-[64px]';
      case 'md':
      default:
        return 'px-4 py-2 text-base rounded-2xl min-h-[48px]';
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sounds.playButtonClick();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 font-['Nunito',sans-serif] font-black tracking-wide cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${getVariantClass()} ${getSizeClass()} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      {children && <span className="whitespace-nowrap drop-shadow-sm">{children}</span>}
    </button>
  );
};
