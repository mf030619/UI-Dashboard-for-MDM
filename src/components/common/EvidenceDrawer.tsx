import React, { useEffect } from 'react';
import { EvidenceId } from '../../types/mdm';
import { mockBriefing } from '../../mockData/dataset';
import { X, ExternalLink, Activity, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EvidenceDrawerProps {
  evidenceId: EvidenceId | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ evidenceId, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (evidenceId) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [evidenceId, onClose]);

  if (!evidenceId) return null;

  const prefix = evidenceId[0];
  const signal = mockBriefing.signals.find((s) => s.id === evidenceId);
  const link = mockBriefing.links.find((l) => l.id === evidenceId);
  const incident = mockBriefing.incidents.find((i) => i.id === evidenceId);
  const risk = mockBriefing.risks.find((r) => r.id === evidenceId);
  const forecast = mockBriefing.forecasts.find((f) => f.id === evidenceId);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-300">
              {evidenceId}
            </span>
            <h2 id="evidence-drawer-title" className="text-base font-semibold">
              {prefix === 'S' && 'Deterministic Change-Point Signal'}
              {prefix === 'L' && 'Cross-Domain Causal Link'}
              {prefix === 'I' && 'System Operational Incident'}
              {prefix === 'R' && 'Operational / Concentration Risk'}
              {prefix === 'F' && 'Statistical Forecast Trajectory'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Close evidence drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Signal Detail */}
          {signal && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                <p className="font-medium text-slate-800 dark:text-slate-200">{signal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Domain & Region</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {signal.domain.toUpperCase()} · Region {signal.region}
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Metric Tested</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{signal.metric}</span>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Baseline vs Shift</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {signal.baseline_value} → {signal.shifted_value} (
                    <span className={signal.shift_pct < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {signal.shift_pct > 0 ? `+${signal.shift_pct}%` : `${signal.shift_pct}%`}
                    </span>
                    )
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 block mb-1">Statistical Test</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    t = {signal.t_statistic} (p = {signal.p_value})
                  </span>
                </div>
              </div>

              <div className="p-4 rounded border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Deterministic Engine Gate
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  Surfaced because t-statistic ({signal.t_statistic}) exceeds strict threshold (t &gt; 5.5) AND shift magnitude ({Math.abs(signal.shift_pct)}%) exceeds 10% minimum threshold.
                </p>
                <div className="text-slate-400 dark:text-slate-500 pt-1 font-mono text-[11px]">
                  Detected timestamp: {signal.detected_at}
                </div>
              </div>
            </div>
          )}

          {/* Link Detail */}
          {link && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <p className="font-medium text-slate-800 dark:text-slate-200">{link.description}</p>
              </div>

              <div className="p-4 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Leading Domain</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{link.source_domain.toUpperCase()}</span>
                  <span className="font-mono text-xs block text-slate-600 dark:text-slate-400">{link.source_metric}</span>
                </div>
                <div className="flex flex-col items-center px-4">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{link.lag_days} days lag</span>
                  <ArrowRight className="w-5 h-5 text-slate-400 my-1" />
                  <span className="text-[11px] text-slate-500 font-mono">r = {link.correlation_coeff}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Target Domain</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{link.target_domain.toUpperCase()}</span>
                  <span className="font-mono text-xs block text-slate-600 dark:text-slate-400">{link.target_metric}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">Granger Causality</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    p = {link.granger_p_value} (Verified)
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">Directionality</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 capitalize">
                    {link.direction} indicator
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Incident Detail */}
          {incident && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-rose-600 text-white">
                    {incident.severity}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {incident.source_system} ({incident.region})
                  </span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200">{incident.summary}</p>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div>
                  <span className="text-slate-500 block">Root Cause Investigation</span>
                  <p className="text-slate-800 dark:text-slate-200 mt-1">{incident.root_cause}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 block">Duration</span>
                    <span className="font-mono font-semibold">{incident.duration_hours} hours</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Started</span>
                    <span className="font-mono text-[11px]">{incident.started_at}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Detail */}
          {risk && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-amber-900 dark:text-amber-200 uppercase text-xs tracking-wider">
                    {risk.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-medium text-slate-800 dark:text-slate-200">{risk.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">Safety Threshold</span>
                  <span className="font-mono font-semibold">{risk.threshold}</span>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">Current Measurement</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{risk.current_value}</span>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Detail */}
          {forecast && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50">
                <span className="text-xs text-teal-800 dark:text-teal-300 block mb-1">
                  Region {forecast.region} · {forecast.metric}
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Projected 21-day run rate: {forecast.projected_21d.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">Current Run</span>
                  <span className="font-mono font-semibold">{forecast.current_run_rate.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">7d Horizon</span>
                  <span className="font-mono font-semibold">{forecast.projected_7d.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1">95% Range</span>
                  <span className="font-mono font-semibold text-[11px]">
                    {forecast.confidence_interval[0].toLocaleString()} - {forecast.confidence_interval[1].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Raw Audit Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Canonical Pipeline Lineage
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Record validated through <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">app.services.analytics</code> change-point detector and emitted with stable deterministic identity {evidenceId}. Verified for executive review.
            </p>
          </div>
        </div>

        {/* Action bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
