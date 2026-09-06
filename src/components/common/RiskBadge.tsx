import React from 'react';
import { RiskLevel } from '../../types/risk';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showPulse = false,
  className = '',
}) => {
  const getColors = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/80 border-red-500/80 text-red-200',
          dot: 'bg-red-500',
          icon: '🔴',
          label: 'CRITICAL',
          ring: 'ring-red-500/30',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-950/80 border-orange-500/80 text-orange-200',
          dot: 'bg-orange-500',
          icon: '🟠',
          label: 'HIGH',
          ring: 'ring-orange-500/30',
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-950/80 border-amber-500/80 text-amber-200',
          dot: 'bg-amber-400',
          icon: '🟡',
          label: 'MODERATE',
          ring: 'ring-amber-500/30',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200',
          dot: 'bg-emerald-400',
          icon: '🟢',
          label: 'LOW',
          ring: 'ring-emerald-500/30',
        };
    }
  };

  const colors = getColors();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1.5',
    md: 'text-xs md:text-sm px-2.5 py-1 space-x-2 font-semibold',
    lg: 'text-sm md:text-base px-3.5 py-1.5 space-x-2.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${colors.bg} ${colors.ring} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Risk Level: ${colors.label}`}
    >
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {showPulse && (level === 'CRITICAL' || level === 'HIGH') && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colors.dot}`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${colors.dot}`} />
      </span>
      <span>{colors.label}</span>
    </span>
  );
};
