import React from 'react';
import { ConfidenceLevel } from '../../types/mdm';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  rationale?: string;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level,
  rationale,
  className = '',
}) => {
  // Dual-channel: explicit text label + border/color
  const colorMap = {
    High: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Medium: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Low: 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded border ${colorMap[level]} ${className}`}
      title={rationale || `${level} Confidence Assessment`}
      role="status"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      <span>{level} Confidence</span>
    </span>
  );
};
