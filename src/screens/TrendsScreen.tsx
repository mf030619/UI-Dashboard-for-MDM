import React, { useState } from 'react';
import { Region } from '../types/mdm';
import {
  mockSensitivity,
  mockTimeseriesByMetric,
  mockBriefing,
} from '../mockData/dataset';
import { ChartWithTableTwin } from '../components/common/ChartWithTableTwin';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart3,
  Calendar,
  Table,
  Sliders,
  Layers,
} from 'lucide-react';

export const TrendsScreen: React.FC = () => {
  const [metric, setMetric] = useState<'revenue' | 'signups' | 'visits' | 'latency_ms'>('revenue');
  const [windowRange, setWindowRange] = useState<'7d' | '21d' | '90d'>('21d');
  const [bucket, setBucket] = useState<'hour' | 'day' | 'week'>('day');
  const [sensitivityView, setSensitivityView] = useState<'chart' | 'table'>('chart');

  const timeseriesData = mockTimeseriesByMetric[metric] || mockTimeseriesByMetric.revenue;

  // Metric metadata
  const metricConfigs = {
    revenue: {
      title: 'Net Recurring Revenue',
      unit: '$',
      format: (v: number) => `$${v.toLocaleString()}`,
    },
    signups: {
      title: 'Client Signups Volume',
      unit: '',
      format: (v: number) => v.toLocaleString(),
    },
    visits: {
      title: 'Gross Visitor Traffic',
      unit: '',
      format: (v: number) => v.toLocaleString(),
    },
    latency_ms: {
      title: 'Edge Gateway P99 Latency',
      unit: 'ms',
      format: (v: number) => `${v}ms`,
    },
  };

  const currentConfig = metricConfigs[metric];

  // Latest values for the four regions
  const latestDataPoint = timeseriesData[timeseriesData.length - 1];
  const regions: Region[] = ['NA', 'EU', 'APAC', 'LATAM'];
  const values = regions.map((r) => latestDataPoint[r]);

  // Compute Median
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = (sortedValues[1] + sortedValues[2]) / 2;

  // Rank regions by deviation from the MEDIAN
  const ranked = regions
    .map((region) => {
      const latestValue = latestDataPoint[region];
      const deviationPct = ((latestValue - median) / (median || 1)) * 100;
      // An outlier is flagged if deviation is beyond +/- 10%
      const isOutlier = Math.abs(deviationPct) >= 10.0;
      let outlierReason = '';
      if (deviationPct <= -10) {
        outlierReason = `${region} is ${Math.abs(deviationPct).toFixed(1)}% below median — watch threshold exceeded`;
      } else if (deviationPct >= 10) {
        outlierReason = `${region} is +${deviationPct.toFixed(1)}% above median`;
      }

      return {
        region,
        latestValue,
        medianValue: median,
        deviationPct,
        isOutlier,
        outlierReason,
      };
    })
    .sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct));

  // Highest deviation negative outlier specifically named in words
  const negativeOutlier = ranked.find((r) => r.deviationPct <= -10);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-900 dark:text-slate-100">
      {/* Filter Row: Metric, Window, Bucket */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Metric Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Metric:
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              {(
                [
                  { id: 'revenue', label: 'Revenue ($)' },
                  { id: 'signups', label: 'Signups' },
                  { id: 'visits', label: 'Visits' },
                  { id: 'latency_ms', label: 'Latency (ms)' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMetric(m.id)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    metric === m.id
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Window & Bucket Selectors */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Window:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                {(['7d', '21d', '90d'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWindowRange(w)}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      windowRange === w
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Bucket:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                {(['hour', 'day', 'week'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBucket(b)}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      bucket === b
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Summary Row that RANKS the four regions by deviation from the MEDIAN */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Regional Median Ranking</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                (Cross-region Median: {currentConfig.format(Math.round(median))})
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked in strict order by magnitude of deviation from the median. Regions exceeding ±10% threshold are flagged.
            </p>
          </div>

          {/* Named outlier in words */}
          {negativeOutlier && (
            <div className="px-3 py-1 rounded bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{negativeOutlier.outlierReason}</span>
            </div>
          )}
        </div>

        {/* 4 Ranked KPI Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ranked.map((item, idx) => (
            <div
              key={item.region}
              className={`p-4 rounded-lg border transition-all ${
                item.isOutlier && item.deviationPct < 0
                  ? 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-300 dark:ring-rose-800'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-mono font-bold">Rank #{idx + 1}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Region {item.region}
                </span>
              </div>

              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                {currentConfig.format(item.latestValue)}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Vs Median:</span>
                <span
                  className={`font-mono font-bold tabular-nums flex items-center gap-0.5 ${
                    item.deviationPct < 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {item.deviationPct > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 inline" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 inline" />
                  )}
                  {item.deviationPct > 0 ? `+${item.deviationPct.toFixed(1)}%` : `${item.deviationPct.toFixed(1)}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Small-Multiple Line Charts in that same Ranked Order */}
      <section>
        <ChartWithTableTwin
          title={`${currentConfig.title} Small Multiples`}
          metricKey={metric}
          data={timeseriesData}
          rankedRegions={ranked}
          yAxisUnit={currentConfig.unit}
        />
      </section>

      {/* Diverging Bar Chart of Driver Sensitivity (±10%) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Driver Sensitivity Waterfall (Weekly Profit Impact per ±10% Shock)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated via deterministic P&amp;L model across all four operating regions. Shows weekly profit elasticity per driver.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSensitivityView('chart')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                sensitivityView === 'chart'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Diverging Bar
            </button>
            <button
              type="button"
              onClick={() => setSensitivityView('table')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                sensitivityView === 'table'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Table Twin
            </button>
          </div>
        </div>

        {sensitivityView === 'chart' ? (
          <div className="space-y-3 pt-2">
            {mockSensitivity.map((item) => {
              const maxScale = 35000;
              const barPct = (Math.abs(item.profit_delta_per_10pct) / maxScale) * 100;
              const isPositive = item.profit_delta_per_10pct >= 0;

              return (
                <div key={item.driver} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.driver_label}
                    </span>
                    <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                      {item.unit}
                    </span>
                  </div>

                  {/* Diverging Bar Track */}
                  <div className="grid grid-cols-2 gap-1 h-6 bg-slate-100 dark:bg-slate-800/60 rounded overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
                    {/* Negative Left Half */}
                    <div className="flex justify-end items-center h-full">
                      {!isPositive && (
                        <div
                          className="h-full bg-rose-500 dark:bg-rose-600 rounded-l transition-all"
                          style={{ width: `${barPct}%` }}
                          title={`Negative elasticity: ${item.unit}`}
                        />
                      )}
                    </div>

                    {/* Positive Right Half */}
                    <div className="flex justify-start items-center h-full">
                      {isPositive && (
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-r transition-all"
                          style={{ width: `${barPct}%` }}
                          title={`Positive elasticity: ${item.unit}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="p-2.5">P&L Driver</th>
                  <th className="p-2.5 text-right">Profit Delta per +10%</th>
                  <th className="p-2.5 text-right">Share of Net Profit</th>
                  <th className="p-2.5">Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mockSensitivity.map((s) => (
                  <tr key={s.driver} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-medium">{s.driver_label}</td>
                    <td className="p-2.5 text-right font-mono font-bold tabular-nums">
                      {s.profit_delta_per_10pct > 0
                        ? `+$${s.profit_delta_per_10pct.toLocaleString()}`
                        : `-$${Math.abs(s.profit_delta_per_10pct).toLocaleString()}`}
                    </td>
                    <td className="p-2.5 text-right font-mono tabular-nums">
                      {(s.share_of_profit * 100).toFixed(0)}%
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.profit_delta_per_10pct >= 0
                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {s.profit_delta_per_10pct >= 0 ? 'Accretive' : 'Acquisition Cost'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Forecast Tiles for Biggest Movers */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Statistical Forecasts for Key Movers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockBriefing.forecasts.map((f) => (
            <div
              key={f.id}
              className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                  {f.id} · {f.region}
                </span>
                <span className="text-xs text-slate-500 font-mono">21-Day Horizon</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {f.metric} Trajectory
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                    {f.projected_21d.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">
                    (Current: {f.current_run_rate.toLocaleString()})
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs flex justify-between">
                <span className="text-slate-500">95% Confidence Band:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                  [{f.confidence_interval[0].toLocaleString()} - {f.confidence_interval[1].toLocaleString()}]
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
