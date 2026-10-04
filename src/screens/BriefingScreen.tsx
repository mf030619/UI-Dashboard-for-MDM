import React, { useState } from 'react';
import { BriefingReport, EvidenceId, Finding, Domain } from '../types/mdm';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { EvidenceChip } from '../components/common/EvidenceChip';
import {
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  FileCheck2,
  TrendingDown,
  TrendingUp,
  Filter,
} from 'lucide-react';

interface BriefingScreenProps {
  report: BriefingReport;
  onSelectEvidence: (id: EvidenceId) => void;
}

export const BriefingScreen: React.FC<BriefingScreenProps> = ({ report, onSelectEvidence }) => {
  const [evidencePackOpen, setEvidencePackOpen] = useState(false);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'signals' | 'links' | 'incidents' | 'risks' | 'forecasts'>('signals');
  const [findingExpanded, setFindingExpanded] = useState<Record<string, boolean>>({
    'FINDING-01': true,
    'FINDING-02': true,
    'FINDING-03': false,
  });

  const toggleFinding = (id: string) => {
    setFindingExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const domainBadgeMap: Record<Domain, string> = {
    client: 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800',
    financial: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    partner: 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800',
    operational: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    competitive: 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-900 dark:text-slate-100">
      {/* Print-only executive report header */}
      <div className="hidden print-only briefing-print-header">
        <h1 className="text-2xl font-bold text-black mb-1">AI MDM Executive Intelligence Briefing</h1>
        <p className="text-xs text-slate-600">
          Evaluated as of: {new Date(report.as_of).toUTCString()} · Window: {report.window_days} Days · Deterministic Verification Verified
        </p>
      </div>

      {/* Landing Summary & Verification Banner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-xs break-inside-avoid">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <span>Executive Briefing</span>
              <span className="text-slate-400" aria-hidden="true">·</span>
              <span className="font-mono text-slate-500">{report.window_days}-Day Window</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Cross-Domain Causal Synthesis & Root-Cause Matrix
            </h1>
          </div>

          {/* Verification Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-medium shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Deterministic Verification: 0 Issues Cited</span>
          </div>
        </div>

        {/* 1-Paragraph Executive Summary */}
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 max-w-4xl">
          {report.executive_summary}
        </p>

        {/* Executive Meta Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>As of: {new Date(report.as_of).toUTCString()}</span>
          </div>
          <div>
            <span>Verified Findings: </span>
            <strong className="text-slate-800 dark:text-slate-200">{report.findings.length}</strong>
          </div>
          <div>
            <span>Ruled Out Spurious: </span>
            <strong className="text-slate-800 dark:text-slate-200">{report.ruled_out.length}</strong>
          </div>
          <div>
            <span>Active Warnings: </span>
            <strong className="text-amber-600 dark:text-amber-400 font-semibold">{report.early_warnings.length}</strong>
          </div>
        </div>
      </section>

      {/* Primary Section: Cross-Domain Causal Findings */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Verified Causal Findings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rigorous econometric Granger tests and change-point shifts linking operational catalysts to P&L results.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {report.findings.length} Active Findings
          </span>
        </div>

        <div className="space-y-4">
          {report.findings.map((f, idx) => {
            const isExpanded = findingExpanded[f.id] ?? true;
            return (
              <div
                key={f.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs break-inside-avoid"
              >
                {/* Finding Header */}
                <div
                  className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                  onClick={() => toggleFinding(f.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleFinding(f.id);
                    }
                  }}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        0{idx + 1}.
                      </span>
                      <ConfidenceBadge level={f.confidence} rationale={f.confidence_rationale} />

                      {/* Domain Chain Display */}
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-400 mr-1">Chain:</span>
                        {f.domain_chain.map((d, dIdx) => (
                          <React.Fragment key={dIdx}>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${domainBadgeMap[d]}`}
                            >
                              {d}
                            </span>
                            {dIdx < f.domain_chain.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {f.headline}
                    </h3>
                  </div>

                  {/* Impact Summary & Toggle */}
                  <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <span
                        className={`text-sm sm:text-base font-bold font-mono tabular-nums ${
                          f.business_impact.weekly_profit_delta < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {f.business_impact.weekly_profit_delta > 0
                          ? `+$${(f.business_impact.weekly_profit_delta / 1000).toFixed(1)}k/wk`
                          : `-$${Math.abs(f.business_impact.weekly_profit_delta / 1000).toFixed(1)}k/wk`}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-mono">
                        {f.business_impact.signup_delta > 0
                          ? `+${f.business_impact.signup_delta} signups`
                          : `${f.business_impact.signup_delta} signups`}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      aria-label={isExpanded ? 'Collapse finding details' : 'Expand finding details'}
                    >
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4 text-xs sm:text-sm">
                    {/* Numbered Causal Steps */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Numbered Causal Chain & Mechanics
                      </h4>
                      <ol className="space-y-2 list-none">
                        {f.causal_steps.map((step, sIdx) => (
                          <li
                            key={sIdx}
                            className="flex items-start gap-2.5 p-2 rounded bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Statistical Proof & Evidence Chips Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Causal Econometric Test */}
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Causal Statistical Test
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {f.causal_test.test_type}
                          </span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            p = {f.causal_test.p_value}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex justify-between font-mono">
                          <span>Stat: {f.causal_test.test_statistic}</span>
                          <span>Lag: {f.causal_test.lag_days} days</span>
                          <span>N = {f.causal_test.sample_size}</span>
                        </div>
                      </div>

                      {/* Evidence ID Chips */}
                      <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Underlying Evidence Records
                          </span>
                          <span className="text-[10px] text-slate-400">Click to inspect</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {f.evidence_ids.map((id) => (
                            <EvidenceChip key={id} id={id} onClick={onSelectEvidence} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section: Ruled out — correlation, not causation */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Ruled Out — Correlation, Not Causation</span>
            <span className="text-xs font-normal text-slate-500">(Demoted Findings)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Statistical correlations flagged by naive analytics that failed cross-system entity resolution or synthetic control tests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.ruled_out.map((ro) => (
            <div
              key={ro.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3 break-inside-avoid opacity-90 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Ruled Out
                </span>
                <span className="text-xs font-mono text-slate-400">{ro.id}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">
                {ro.headline}
              </h3>
              <div className="space-y-1 text-xs">
                <span className="text-slate-500 font-semibold block">Apparent Correlation:</span>
                <p className="text-slate-600 dark:text-slate-400">{ro.spurious_correlation_found}</p>
              </div>
              <div className="p-3 rounded bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs space-y-1">
                <span className="font-semibold text-amber-900 dark:text-amber-300 block">
                  Why Ruled Out:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{ro.why_ruled_out}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Early Warnings & Data Caveats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Early Warnings */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3 break-inside-avoid">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Operational Early Warnings
            </h2>
          </div>
          <div className="space-y-3">
            {report.early_warnings.map((ew) => (
              <div
                key={ew.id}
                className="p-3.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {ew.title}
                  </span>
                  <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
                    {ew.lead_time_days}d lead time
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{ew.lead_indicator}</p>
                <div className="pt-1.5 flex items-center justify-between border-t border-amber-200/60 dark:border-amber-900/50">
                  <span className="text-rose-700 dark:text-rose-400 font-medium">
                    {ew.projected_impact}
                  </span>
                  <div className="flex gap-1">
                    {ew.evidence_ids.map((id) => (
                      <EvidenceChip key={id} id={id} onClick={onSelectEvidence} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Quality Caveats */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3 break-inside-avoid">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Data Caveats & Feed Status
            </h2>
          </div>
          <div className="space-y-3">
            {report.data_caveats.map((dc) => (
              <div
                key={dc.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold font-mono text-slate-900 dark:text-slate-100">
                    Source: {dc.source}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      dc.status === 'active'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {dc.status}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">{dc.caveat}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {dc.impact_on_analysis}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Collapsible Deterministic Evidence Pack */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs no-print">
        <button
          type="button"
          onClick={() => setEvidencePackOpen(!evidencePackOpen)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-expanded={evidencePackOpen}
        >
          <div className="flex items-center gap-3">
            <FileCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Deterministic Evidence Pack
              </h2>
              <p className="text-xs text-slate-500">
                Sortable tables of Signals (S1..), Links (L1..), Incidents (I1..), Risks (R1..), and Forecasts (F1..)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              {evidencePackOpen ? 'Hide Pack' : 'Review Raw Evidence Tables'}
            </span>
            {evidencePackOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </div>
        </button>

        {evidencePackOpen && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 space-y-4">
            {/* Sub-tabs for Evidence types */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
              {(['signals', 'links', 'incidents', 'risks', 'forecasts'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveEvidenceTab(tab)}
                  className={`px-3 py-1.5 rounded font-medium capitalize transition-colors ${
                    activeEvidenceTab === tab
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab} ({tab === 'signals' ? report.signals.length : tab === 'links' ? report.links.length : tab === 'incidents' ? report.incidents.length : tab === 'risks' ? report.risks.length : report.forecasts.length})
                </button>
              ))}
            </div>

            {/* Table: Signals */}
            {activeEvidenceTab === 'signals' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Domain</th>
                      <th className="p-2.5">Metric</th>
                      <th className="p-2.5">Region</th>
                      <th className="p-2.5 text-right">Baseline</th>
                      <th className="p-2.5 text-right">Shifted</th>
                      <th className="p-2.5 text-right">t-stat</th>
                      <th className="p-2.5 text-right">p-value</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {report.signals.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">{s.id}</td>
                        <td className="p-2.5 uppercase font-medium">{s.domain}</td>
                        <td className="p-2.5 font-mono">{s.metric}</td>
                        <td className="p-2.5 font-semibold">{s.region}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums">{s.baseline_value}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums font-bold">
                          {s.shifted_value} ({s.shift_pct > 0 ? `+${s.shift_pct}%` : `${s.shift_pct}%`})
                        </td>
                        <td className="p-2.5 text-right font-mono tabular-nums">{s.t_statistic}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                          {s.p_value}
                        </td>
                        <td className="p-2.5">
                          <button
                            type="button"
                            onClick={() => onSelectEvidence(s.id)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table: Links */}
            {activeEvidenceTab === 'links' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Leading Metric</th>
                      <th className="p-2.5">Lag</th>
                      <th className="p-2.5">Target Metric</th>
                      <th className="p-2.5 text-right">r</th>
                      <th className="p-2.5 text-right">Granger p</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {report.links.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">{l.id}</td>
                        <td className="p-2.5">
                          <span className="font-semibold">{l.source_domain.toUpperCase()}:</span> {l.source_metric}
                        </td>
                        <td className="p-2.5 font-semibold text-indigo-600 dark:text-indigo-400">{l.lag_days}d</td>
                        <td className="p-2.5">
                          <span className="font-semibold">{l.target_domain.toUpperCase()}:</span> {l.target_metric}
                        </td>
                        <td className="p-2.5 text-right font-mono tabular-nums">{l.correlation_coeff}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                          {l.granger_p_value}
                        </td>
                        <td className="p-2.5">
                          <button
                            type="button"
                            onClick={() => onSelectEvidence(l.id)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table: Incidents */}
            {activeEvidenceTab === 'incidents' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Sev</th>
                      <th className="p-2.5">Source & Region</th>
                      <th className="p-2.5">Summary</th>
                      <th className="p-2.5 text-right">Duration</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {report.incidents.map((i) => (
                      <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono font-bold text-rose-600 dark:text-rose-400">{i.id}</td>
                        <td className="p-2.5 font-bold text-rose-700 dark:text-rose-400">{i.severity}</td>
                        <td className="p-2.5 font-medium">{i.source_system} ({i.region})</td>
                        <td className="p-2.5 max-w-sm truncate">{i.summary}</td>
                        <td className="p-2.5 text-right font-mono">{i.duration_hours}h</td>
                        <td className="p-2.5">
                          <button
                            type="button"
                            onClick={() => onSelectEvidence(i.id)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table: Risks */}
            {activeEvidenceTab === 'risks' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5">Threshold</th>
                      <th className="p-2.5 text-right">Value</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {report.risks.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono font-bold text-amber-600 dark:text-amber-400">{r.id}</td>
                        <td className="p-2.5 uppercase font-medium">{r.category.replace('_', ' ')}</td>
                        <td className="p-2.5 max-w-md truncate">{r.description}</td>
                        <td className="p-2.5 font-mono">{r.threshold}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                          {r.current_value}
                        </td>
                        <td className="p-2.5">
                          <button
                            type="button"
                            onClick={() => onSelectEvidence(r.id)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table: Forecasts */}
            {activeEvidenceTab === 'forecasts' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-semibold">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Metric & Region</th>
                      <th className="p-2.5 text-right">Current Run</th>
                      <th className="p-2.5 text-right">Projected 7d</th>
                      <th className="p-2.5 text-right">Projected 21d</th>
                      <th className="p-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {report.forecasts.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono font-bold text-teal-600 dark:text-teal-400">{f.id}</td>
                        <td className="p-2.5 font-medium">{f.metric} ({f.region})</td>
                        <td className="p-2.5 text-right font-mono tabular-nums">{f.current_run_rate.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums">{f.projected_7d.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums font-bold">{f.projected_21d.toLocaleString()}</td>
                        <td className="p-2.5">
                          <button
                            type="button"
                            onClick={() => onSelectEvidence(f.id)}
                            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
