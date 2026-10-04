import React, { useState } from 'react';
import { Region } from '../../types/mdm';
import { Table, LineChart as ChartIcon, AlertCircle } from 'lucide-react';
import { MetricDataPoint } from '../../mockData/dataset';

interface RankedRegionInfo {
  region: Region;
  medianValue: number;
  latestValue: number;
  deviationPct: number;
  isOutlier: boolean;
  outlierReason: string;
}

interface ChartWithTableTwinProps {
  title: string;
  metricKey: string;
  data: MetricDataPoint[];
  rankedRegions: RankedRegionInfo[];
  yAxisUnit?: string;
}

export const ChartWithTableTwin: React.FC<ChartWithTableTwinProps> = ({
  title,
  metricKey,
  data,
  rankedRegions,
  yAxisUnit = '',
}) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute common global min/max for the shared y-axis
  const allValues = data.flatMap((d) => [d.NA, d.EU, d.APAC, d.LATAM]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const yPadding = (rawMax - rawMin) * 0.1 || 10;
  const yMin = Math.max(0, Math.floor(rawMin - yPadding));
  const yMax = Math.ceil(rawMax + yPadding);
  const yRange = yMax - yMin || 1;

  // SVG dimensions for small multiples
  const width = 280;
  const height = 140;
  const padLeft = 45;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const getPoints = (region: Region) => {
    return data.map((d, i) => {
      const x = padLeft + (i / (data.length - 1)) * plotW;
      const val = d[region];
      const y = padTop + plotH - ((val - yMin) / yRange) * plotH;
      return { x, y, val, date: d.date };
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              (Ranked by deviation from median · Shared y-axis)
            </span>
          </h3>
        </div>

        {/* View Switcher: Chart vs Table Twin */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              viewMode === 'chart'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
            aria-pressed={viewMode === 'chart'}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            <span>Small Multiples</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
            aria-pressed={viewMode === 'table'}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table View Twin</span>
          </button>
        </div>
      </div>

      {/* Primary Chart View: 4 Small Multiples in Ranked Order */}
      {viewMode === 'chart' ? (
        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rankedRegions.map((item, rankIdx) => {
              const pts = getPoints(item.region);
              const pathD = pts.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
              const areaD = `${pathD} L ${pts[pts.length - 1].x} ${padTop + plotH} L ${pts[0].x} ${padTop + plotH} Z`;

              return (
                <div
                  key={item.region}
                  className={`p-3.5 rounded-lg border transition-all ${
                    item.isOutlier
                      ? 'border-rose-300 dark:border-rose-900/80 bg-rose-50/30 dark:bg-rose-950/20 ring-1 ring-rose-400 dark:ring-rose-800'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60'
                  }`}
                >
                  {/* Card Header with Rank and Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">#{rankIdx + 1}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.region}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          item.isOutlier
                            ? 'text-rose-600 dark:text-rose-400 font-bold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.deviationPct > 0 ? `+${item.deviationPct.toFixed(1)}%` : `${item.deviationPct.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Outlier Alert Tag */}
                  {item.isOutlier && (
                    <div className="mb-2 p-1.5 rounded bg-rose-100/70 dark:bg-rose-950/80 text-[11px] text-rose-800 dark:text-rose-200 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.outlierReason}</span>
                    </div>
                  )}

                  {/* SVG Chart with Shared Y-Axis */}
                  <div className="relative w-full overflow-hidden">
                    <svg
                      viewBox={`0 0 ${width} ${height}`}
                      className="w-full h-auto"
                      aria-label={`${item.region} time series chart for ${title}`}
                    >
                      <defs>
                        <linearGradient id={`grad-${item.region}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={item.isOutlier ? '#E11D48' : '#2563EB'} stopOpacity="0.25" />
                          <stop offset="100%" stopColor={item.isOutlier ? '#E11D48' : '#2563EB'} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Shared Y-axis tick lines */}
                      <line
                        x1={padLeft}
                        y1={padTop}
                        x2={width - padRight}
                        y2={padTop}
                        stroke="currentColor"
                        className="text-slate-200 dark:text-slate-800"
                        strokeDasharray="2,2"
                      />
                      <line
                        x1={padLeft}
                        y1={padTop + plotH / 2}
                        x2={width - padRight}
                        y2={padTop + plotH / 2}
                        stroke="currentColor"
                        className="text-slate-200 dark:text-slate-800"
                        strokeDasharray="2,2"
                      />
                      <line
                        x1={padLeft}
                        y1={padTop + plotH}
                        x2={width - padRight}
                        y2={padTop + plotH}
                        stroke="currentColor"
                        className="text-slate-300 dark:text-slate-700"
                      />

                      {/* Y-axis tick values */}
                      <text
                        x={padLeft - 4}
                        y={padTop + 4}
                        textAnchor="end"
                        className="text-[9px] fill-slate-400 font-mono"
                      >
                        {yMax > 1000 ? `${(yMax / 1000).toFixed(0)}k` : yMax}
                      </text>
                      <text
                        x={padLeft - 4}
                        y={padTop + plotH}
                        textAnchor="end"
                        className="text-[9px] fill-slate-400 font-mono"
                      >
                        {yMin > 1000 ? `${(yMin / 1000).toFixed(0)}k` : yMin}
                      </text>

                      {/* Area Fill */}
                      <path d={areaD} fill={`url(#grad-${item.region})`} />

                      {/* Trend Line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={item.isOutlier ? '#E11D48' : '#2563EB'}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Interactive Hover Dots */}
                      {pts.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r={hoveredIndex === idx ? 4 : 2}
                          className={`${
                            item.isOutlier
                              ? 'fill-rose-600 dark:fill-rose-400'
                              : 'fill-blue-600 dark:fill-blue-400'
                          } transition-all cursor-pointer`}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <title>{`${p.date}: ${p.val.toLocaleString()} ${yAxisUnit}`}</title>
                        </circle>
                      ))}

                      {/* X-axis date endpoints */}
                      <text
                        x={padLeft}
                        y={height - 6}
                        textAnchor="start"
                        className="text-[9px] fill-slate-400 font-mono"
                      >
                        {data[0]?.date}
                      </text>
                      <text
                        x={width - padRight}
                        y={height - 6}
                        textAnchor="end"
                        className="text-[9px] fill-slate-400 font-mono"
                      >
                        {data[data.length - 1]?.date}
                      </text>
                    </svg>
                  </div>

                  {/* Latest Value Summary */}
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Current Value:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {item.latestValue.toLocaleString()} {yAxisUnit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Accessible Table Twin View */
        <div className="pt-4 overflow-x-auto">
          <table
            className="w-full text-xs text-left border-collapse"
            aria-label={`${title} tabular data twin for screen readers and keyboard review`}
          >
            <caption className="sr-only">
              {title} time series data across regions NA, EU, APAC, and LATAM
            </caption>
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                <th scope="col" className="px-3 py-2 font-semibold text-slate-700 dark:text-slate-300">
                  Date
                </th>
                {rankedRegions.map((r) => (
                  <th
                    key={r.region}
                    scope="col"
                    className="px-3 py-2 font-semibold text-right text-slate-700 dark:text-slate-300"
                  >
                    {r.region} {r.isOutlier ? '(Flagged Outlier)' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((row) => (
                <tr key={row.date} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <th scope="row" className="px-3 py-2 font-mono font-medium text-slate-600 dark:text-slate-400">
                    {row.date}
                  </th>
                  {rankedRegions.map((r) => {
                    const val = row[r.region];
                    return (
                      <td
                        key={r.region}
                        className={`px-3 py-2 font-mono text-right tabular-nums ${
                          r.isOutlier
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {val.toLocaleString()} {yAxisUnit}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
