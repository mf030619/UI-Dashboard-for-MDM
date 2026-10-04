/**
 * Component Specifications for AI MDM Platform
 * Deliverable 2 as specified in the generation brief.
 */

export interface ComponentSpec {
  name: string;
  purpose: string;
  states: string[];
  props: string[];
  accessibility: string;
  tokenBinding: string;
}

export const ComponentSpecs: ComponentSpec[] = [
  {
    name: 'KPITile',
    purpose:
      'Displays a single high-priority operational or financial metric, comparing it to the cross-region median and explicitly declaring if the outlier threshold (±10%) is breached.',
    states: ['Nominal (within ±10% of median)', 'Outlier Flagged (beyond ±10%)', 'Loading Skeleton', 'Empty'],
    props: ['label', 'value', 'formattedValue', 'deviationFromMedianPct', 'isOutlier', 'outlierNarrative', 'rank'],
    accessibility:
      'Uses role="region" with aria-label; status is expressed in text (not color alone); numbers render via font-variant-numeric: tabular-nums.',
    tokenBinding:
      'surface.primary for card container; text.primary for metric value; status.incident or status.active for deviation indicator.',
  },
  {
    name: 'FindingCard',
    purpose:
      'Presents verified cross-domain causal intelligence. Links domains, details numbered causal steps, quantifies weekly P&L impact, and binds evidence chips.',
    states: ['Collapsed summary', 'Expanded evidence detail', 'Verified', 'Verification failed'],
    props: ['finding: Finding', 'onSelectEvidence: (id: EvidenceId) => void'],
    accessibility:
      'Heading hierarchy h3; ordered list <ol> for sequential causal mechanics; aria-expanded for accordion actions; contrast >= 4.5:1.',
    tokenBinding:
      'surface.primary with hairline border; text.primary for headline; semantic.status for confidence level badge.',
  },
  {
    name: 'EvidenceChip',
    purpose:
      'Interactive reference affordance (S1, L2, I3, R4) that opens the Evidence Inspector drawer with raw underlying telemetry and statistical tests.',
    states: ['Default', 'Hover', 'Focused (visible ring)', 'Active/Selected'],
    props: ['id: EvidenceId', 'type: "Signal" | "Link" | "Incident" | "Risk"', 'onClick: () => void'],
    accessibility:
      'Native <button> element with aria-label="Inspect evidence {id}"; keyboard operable with Enter/Space; focus-visible ring 2px.',
    tokenBinding:
      'surface.secondary; text.secondary with monospace tabular font; focus ring token semantic.border.focus.',
  },
  {
    name: 'ChartCardWithTableTwin',
    purpose:
      'Renders small-multiple time-series data with a synchronized y-axis and provides an instantaneous, keyboard-accessible data table toggle twin.',
    states: ['Chart Visual View', 'Table Twin View', 'Loading Skeleton', 'Empty State'],
    props: ['metricTitle', 'data', 'regions', 'highlightedRegion', 'viewMode: "chart" | "table"'],
    accessibility:
      'WCAG 2.1 Non-text contrast >= 3:1 on SVG lines; table twin includes <caption>, <th scope="col">, and <th scope="row">; full screen-reader parity.',
    tokenBinding:
      'chart.primary, chart.secondary, chart.outlier; table row height 38px, font-mono for cell values.',
  },
  {
    name: 'FreshnessTable',
    purpose:
      'Displays real-time ingestion health across all 6 source systems. Emphasizes that "Stale is an Incident, not a warning".',
    states: ['All nominal', 'Degraded consumer lag', 'Active STALE INCIDENT'],
    props: ['sources: SourceFreshness[]', 'onInspectSource: (system: SourceSystem) => void'],
    accessibility:
      'Semantic <table> element; status includes explicit text pills ("STALE INCIDENT" / "HEALTHY"); sortable columns with aria-sort.',
    tokenBinding:
      'status.incident.bg / status.incident.text for stale systems; text.muted for timestamps.',
  },
  {
    name: 'FilterBar',
    purpose:
      'Single-row toolbar for selecting metrics, time windows (7d, 21d, 90d), and aggregation buckets (hour, day, week).',
    states: ['Active selection', 'Disabled (during fetch)'],
    props: ['selectedMetric', 'selectedWindow', 'selectedBucket', 'onChange'],
    accessibility:
      'Segmented button group with aria-pressed or role="radiogroup"; single-line controls with whitespace-nowrap.',
    tokenBinding:
      'surface.secondary container; surface.primary active segment with border.subtle.',
  },
  {
    name: 'ConfidenceBadge',
    purpose:
      'Indicates statistical confidence (High, Medium, Low) evaluated by deterministic verification graphs.',
    states: ['High (triangulated multi-domain)', 'Medium (single-domain proxy)', 'Low (provisional)'],
    props: ['level: "High" | "Medium" | "Low"', 'rationale?: string'],
    accessibility:
      'Explicit text label ("High Confidence"); paired with aria-description for the statistical rationale.',
    tokenBinding:
      'status.active for High; status.warning for Medium; status.incident for Low.',
  },
  {
    name: 'RecommendationCard',
    purpose:
      'Displays quantified executive action recommendations calculated strictly by the deterministic P&L model.',
    states: ['Standard display', 'Simulation applied'],
    props: ['recommendation: QuantifiedRecommendation', 'onApplyScenario?: () => void'],
    accessibility:
      'Clear semantic headings; tabular layout for weekly profit and signup deltas; pros and cons structured as semantic unordered lists.',
    tokenBinding:
      'border.subtle; text.primary; tabular numbers for delta figures.',
  },
  {
    name: 'Composer',
    purpose:
      'Executive prompt dispatcher for causal inquiries with suggested quick prompts and keyboard submission.',
    states: ['Idle', 'Focused', 'Query in-flight', 'Disabled'],
    props: ['onSubmit: (query: string) => void', 'presets: string[]', 'isLoading: boolean'],
    accessibility:
      'Textarea / input with clear placeholder and aria-label; submit on Enter (Shift+Enter for newline); preset questions are accessible buttons.',
    tokenBinding:
      'border.moderate; focus:border.focus; surface.primary background.',
  },
];
