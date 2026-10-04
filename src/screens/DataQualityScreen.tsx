import React, { useState } from 'react';
import {
  mockFreshness,
  mockDQSummary,
  mockDQIssues,
  mockEntities,
} from '../mockData/dataset';
import {
  DQIssue,
  DQIssueType,
  Entity,
  SourceSystem,
} from '../types/mdm';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Database,
  Search,
  Filter,
  Code2,
  RefreshCw,
  GitMerge,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const DataQualityScreen: React.FC = () => {
  const [selectedIssueType, setSelectedIssueType] = useState<DQIssueType | 'all'>('all');
  const [inspectedIssue, setInspectedIssue] = useState<DQIssue | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity>(mockEntities[0]);
  const [entitySearch, setEntitySearch] = useState('');
  const [testNormalizeInput, setTestNormalizeInput] = useState('Acme Corporation Ltd.');

  // Normalization logic mimicking app/services/entity_resolution.py
  const normalizeMatchKey = (raw: string) => {
    return raw
      .toLowerCase()
      .replace(/[\s,.\-_/()]/g, '')
      .replace(/(ltd|limited|inc|incorporated|llc|plc|pte|sdn|bhd|gmbh|corp|corporation)$/i, '');
  };

  const filteredIssues = mockDQIssues.filter(
    (issue) => selectedIssueType === 'all' || issue.issue_type === selectedIssueType
  );

  const filteredEntities = mockEntities.filter(
    (e) =>
      e.canonical_name.toLowerCase().includes(entitySearch.toLowerCase()) ||
      e.match_key.toLowerCase().includes(entitySearch.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-900 dark:text-slate-100">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <span>Master Data Quality &amp; Governance</span>
          <span className="text-slate-400">·</span>
          <span>6 Ingestion Pipelines</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          Source Freshness &amp; Entity Resolution Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Live stream freshness audit where stale is an incident, automated contract validation, and canonical entity cross-join mapping.
        </p>
      </div>

      {/* 1. Source Freshness Table (STALE IS AN INCIDENT) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Real-Time Source Feed Freshness</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              SOP Rule 5.2: Any source marked STALE is an active incident. Downstream models exclude it silently.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Audit Frequency: Every 60s
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full text-xs text-left border-collapse"
            aria-label="Real-time source ingestion freshness status table"
          >
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                <th scope="col" className="p-3">Source System</th>
                <th scope="col" className="p-3">Domain</th>
                <th scope="col" className="p-3 text-right">Processed Events</th>
                <th scope="col" className="p-3 text-right">Consumer Lag</th>
                <th scope="col" className="p-3">Last Ingested</th>
                <th scope="col" className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockFreshness.map((source) => (
                <tr
                  key={source.source_system}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    source.stale
                      ? 'bg-rose-50/50 dark:bg-rose-950/20'
                      : ''
                  }`}
                >
                  <th scope="row" className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {source.source_system}
                  </th>
                  <td className="p-3 font-medium uppercase text-slate-600 dark:text-slate-400">
                    {source.domain}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    {source.events_count.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums">
                    {source.consumer_lag_ms > 1000
                      ? `${(source.consumer_lag_ms / 60000).toFixed(1)} min`
                      : `${source.consumer_lag_ms} ms`}
                  </td>
                  <td className="p-3 font-mono text-slate-500">
                    {source.minutes_ago < 1
                      ? 'Just now (< 1m)'
                      : `${source.minutes_ago.toFixed(1)} min ago`}
                  </td>
                  <td className="p-3">
                    {source.stale ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded bg-rose-600 text-white shadow-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>STALE INCIDENT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>HEALTHY</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Issue Breakdown by Type & Interactive Log */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Counts & Filtering */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Validation Issue Counts</span>
            </h2>
            <p className="text-xs text-slate-500">Triage by contract violation type</p>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setSelectedIssueType('all')}
              className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                selectedIssueType === 'all'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>All Logged Issues</span>
              <span className="font-mono font-bold tabular-nums">
                {mockDQSummary.reduce((acc, i) => acc + i.count, 0)}
              </span>
            </button>

            {mockDQSummary.map((item) => (
              <button
                key={item.issue_type}
                type="button"
                onClick={() => setSelectedIssueType(item.issue_type)}
                className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors space-y-1 ${
                  selectedIssueType === item.issue_type
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="capitalize font-semibold">{item.issue_type.replace('_', ' ')}</span>
                  <span className="font-mono font-bold tabular-nums px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                    {item.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{item.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent DQ Issues Log */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recent DQ Issues Log &amp; Payload Inspector
              </h2>
              <p className="text-xs text-slate-500">
                Rejected events retained in <code className="font-mono text-[11px]">dq_issues</code> with original payloads intact.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredIssues.length} issues
            </span>
          </div>

          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {issue.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {issue.issue_type.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      source: {issue.source_system}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{issue.ts}</span>
                </div>

                <p className="text-slate-800 dark:text-slate-200 font-medium">{issue.reason}</p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 text-[11px]">
                    Field: <code className="font-mono">{issue.field_name || 'root'}</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectedIssue(issue)}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Inspect Rejected Payload</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Entity Resolution Explorer (Cross-System Merges) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Cross-Domain Entity Resolution Engine</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unifies fragmented records across CRM, ERP, Partner Portal, and Web Analytics into one canonical identity.
            </p>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search canonical entities..."
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entity List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Canonical Entities ({filteredEntities.length})
            </span>
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {filteredEntities.map((ent) => (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => setSelectedEntity(ent)}
                  className={`w-full p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                    selectedEntity.id === ent.id
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {ent.canonical_name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {ent.kind}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono">key: {ent.match_key}</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {ent.source_ids.length} Sources Joined
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Entity Multi-Source ID Cross-Join Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedEntity.canonical_name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                    <span>ID: {selectedEntity.id}</span>
                    <span>·</span>
                    <span>match_key: {selectedEntity.match_key}</span>
                    <span>·</span>
                    <span>Region: {selectedEntity.region}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Multi-Source Joined ({selectedEntity.source_ids.length} Systems)
                </span>
              </div>

              {/* Source system mapping table */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">
                  Mapped Source System Identities (table: <code className="font-mono">entity_source_ids</code>)
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        <th className="p-2.5">Source System</th>
                        <th className="p-2.5">Raw Entity Name at Source</th>
                        <th className="p-2.5">Foreign Source ID</th>
                        <th className="p-2.5">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-750">
                      {selectedEntity.source_ids.map((src) => (
                        <tr key={src.source_system} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
                            {src.source_system}
                          </td>
                          <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">
                            {src.source_name}
                          </td>
                          <td className="p-2.5 font-mono text-blue-600 dark:text-blue-400">
                            {src.source_id}
                          </td>
                          <td className="p-2.5 font-mono text-slate-500 text-[11px]">
                            {src.last_seen_at}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Match Key Normalization Engine Preview */}
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Live match_key() Normalization Tester
              </span>
              <p className="text-xs text-slate-500">
                Strips legal suffixes (ltd, inc, llc, plc, pte, sdn, bhd, gmbh) and punctuation to enable deterministic zero-hallucination joining.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <input
                  type="text"
                  value={testNormalizeInput}
                  onChange={(e) => setTestNormalizeInput(e.target.value)}
                  placeholder="Type company name with legal suffix..."
                  className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 font-medium"
                />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 rounded font-mono text-xs text-blue-800 dark:text-blue-300 whitespace-nowrap">
                  <span className="text-slate-500">Resolved Key:</span>
                  <span className="font-bold">{normalizeMatchKey(testNormalizeInput)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payload Inspector Modal */}
      {inspectedIssue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold font-mono">
                  {inspectedIssue.id} · Rejected Payload
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedIssue(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs">
                <span className="text-slate-500 font-semibold block">Rejection Reason:</span>
                <p className="text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                  {inspectedIssue.reason}
                </p>
              </div>
              <div className="text-xs">
                <span className="text-slate-500 font-semibold block mb-1">
                  JSONB Raw Event Payload:
                </span>
                <pre className="p-3 rounded bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
                  {JSON.stringify(inspectedIssue.rejected_payload, null, 2)}
                </pre>
              </div>
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectedIssue(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
