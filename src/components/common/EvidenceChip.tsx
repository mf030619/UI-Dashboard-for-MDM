import React from 'react';
import { EvidenceId } from '../../types/mdm';

interface EvidenceChipProps {
  id: EvidenceId;
  onClick: (id: EvidenceId) => void;
  isActive?: boolean;
}

export const EvidenceChip: React.FC<EvidenceChipProps> = ({ id, onClick, isActive = false }) => {
  const prefix = id[0];
  const typeMap: Record<string, { label: string; badgeClass: string }> = {
    S: {
      label: 'Signal',
      badgeClass: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60',
    },
    L: {
      label: 'Causal Link',
      badgeClass: 'text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60',
    },
    I: {
      label: 'Incident',
      badgeClass: 'text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60',
    },
    R: {
      label: 'Risk',
      badgeClass: 'text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60',
    },
    F: {
      label: 'Forecast',
      badgeClass: 'text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60',
    },
  };

  const meta = typeMap[prefix] || {
    label: 'Evidence',
    badgeClass: 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900',
  };

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-semibold rounded border cursor-pointer transition-all ${
        meta.badgeClass
      } ${
        isActive
          ? 'ring-2 ring-blue-600 dark:ring-blue-400 font-bold'
          : 'hover:brightness-95 dark:hover:brightness-125'
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
      aria-label={`Inspect ${meta.label} ${id}`}
      title={`Click to inspect raw evidence ${id} (${meta.label})`}
    >
      <span className="opacity-75">{prefix}</span>
      <span>{id.slice(1)}</span>
    </button>
  );
};
