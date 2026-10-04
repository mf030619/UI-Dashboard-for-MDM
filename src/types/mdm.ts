/**
 * Type definitions for AI MDM Platform
 * Derived strictly from the FastAPI & PostgreSQL running codebase schemas.
 */

export type Domain = 'client' | 'financial' | 'partner' | 'operational' | 'competitive';

export type SourceSystem =
  | 'crm'
  | 'web_analytics'
  | 'erp'
  | 'partner_portal'
  | 'observability'
  | 'market_intel';

export type Region = 'NA' | 'EU' | 'APAC' | 'LATAM';

export type EntityKind = 'client' | 'partner' | 'competitor';

export interface EntitySourceId {
  source_system: SourceSystem;
  source_id: string;
  source_name: string;
  last_seen_at: string;
}

export interface Entity {
  id: string;
  kind: EntityKind;
  match_key: string;
  canonical_name: string;
  region: Region;
  created_at: string;
  source_ids: EntitySourceId[];
  is_multi_source: boolean;
}

export interface EventRecord {
  id: string;
  source_system: SourceSystem;
  source_event_id: string;
  domain: Domain;
  event_type: string;
  region: Region;
  entity_id?: string;
  entity_name?: string;
  value: number;
  ts: string;
  payload: Record<string, unknown>;
}

export type DQIssueType = 'invalid' | 'rule_violation' | 'duplicate' | 'anomaly';

export interface DQIssue {
  id: string;
  source_system: SourceSystem;
  issue_type: DQIssueType;
  reason: string;
  field_name?: string;
  rejected_payload: Record<string, unknown>;
  ts: string;
  z_score?: number;
  severity: 'high' | 'medium' | 'low';
}

export interface DQSummaryItem {
  issue_type: DQIssueType;
  count: number;
  description: string;
}

export interface SourceFreshness {
  source_system: SourceSystem;
  domain: Domain;
  events_count: number;
  last_ingested_at: string;
  minutes_ago: number;
  stale: boolean;
  consumer_lag_ms: number;
  contract_status: 'healthy' | 'degraded' | 'stale';
}

export type EvidenceId = `S${number}` | `L${number}` | `I${number}` | `R${number}` | `F${number}`;

export interface Signal {
  id: `S${number}`;
  domain: Domain;
  metric: string;
  region: Region;
  baseline_value: number;
  shifted_value: number;
  shift_pct: number;
  t_statistic: number;
  detected_at: string;
  p_value: number;
  description: string;
}

export interface Link {
  id: `L${number}`;
  source_domain: Domain;
  source_metric: string;
  target_domain: Domain;
  target_metric: string;
  region: Region;
  lag_days: number;
  correlation_coeff: number;
  granger_p_value: number;
  direction: 'leading' | 'lagging';
  description: string;
}

export interface Incident {
  id: `I${number}`;
  domain: Domain;
  source_system: SourceSystem;
  region: Region;
  summary: string;
  severity: 'P1' | 'P2' | 'P3';
  started_at: string;
  resolved_at?: string;
  duration_hours: number;
  root_cause: string;
}

export interface Risk {
  id: `R${number}`;
  domain: Domain;
  category: 'partner_concentration' | 'emerging_competitor' | 'sla_breach' | 'churn_cascade';
  metric: string;
  threshold: string;
  current_value: string;
  z_score?: number;
  description: string;
}

export interface Forecast {
  id: `F${number}`;
  metric: string;
  region: Region;
  current_run_rate: number;
  projected_7d: number;
  projected_21d: number;
  confidence_interval: [number, number];
  trend_direction: 'up' | 'down' | 'neutral';
}

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface Finding {
  id: string;
  headline: string;
  confidence: ConfidenceLevel;
  confidence_rationale: string;
  domain_chain: Domain[];
  causal_steps: string[];
  business_impact: {
    weekly_profit_delta: number;
    signup_delta: number;
    affected_regions: Region[];
    summary: string;
  };
  causal_test: {
    test_type: 'Granger Causality' | 'Change-Point Shift' | 'Difference-in-Differences';
    test_statistic: string;
    p_value: number;
    lag_days: number;
    sample_size: number;
  };
  evidence_ids: EvidenceId[];
}

export interface RuledOutFinding {
  id: string;
  headline: string;
  spurious_correlation_found: string;
  why_ruled_out: string;
  evidence_refuted: string;
  domain_pair: [Domain, Domain];
}

export interface EarlyWarning {
  id: string;
  title: string;
  domain: Domain;
  region: Region;
  lead_indicator: string;
  projected_impact: string;
  lead_time_days: number;
  evidence_ids: EvidenceId[];
}

export interface DataCaveat {
  id: string;
  source: SourceSystem;
  caveat: string;
  impact_on_analysis: string;
  status: 'active' | 'mitigated';
}

export interface BriefingReport {
  as_of: string;
  window_days: number;
  executive_summary: string;
  verification_issues: string[];
  llm_error: string | null;
  findings: Finding[];
  ruled_out: RuledOutFinding[];
  early_warnings: EarlyWarning[];
  data_caveats: DataCaveat[];
  signals: Signal[];
  links: Link[];
  incidents: Incident[];
  risks: Risk[];
  forecasts: Forecast[];
}

export type PLDriver =
  | 'visits'
  | 'lead_rate'
  | 'signup_rate'
  | 'revenue_per_signup'
  | 'marketing_spend'
  | 'partner_commission';

export interface SensitivityItem {
  driver: PLDriver;
  driver_label: string;
  profit_delta_per_10pct: number;
  share_of_profit: number; // e.g. 0.38 = 38%
  unit: string;
}

export interface DriverShock {
  driver: PLDriver;
  shock_pct: number; // e.g. +10, -15
}

export interface RegionalPLImpact {
  region: Region;
  baseline_weekly_profit: number;
  simulated_weekly_profit: number;
  profit_delta: number;
  baseline_signups: number;
  simulated_signups: number;
  signup_delta: number;
}

export interface SimulateResult {
  total_baseline_weekly_profit: number;
  total_simulated_weekly_profit: number;
  net_profit_delta: number;
  total_baseline_signups: number;
  total_simulated_signups: number;
  net_signup_delta: number;
  regional_breakdown: RegionalPLImpact[];
  applied_shocks: DriverShock[];
  computed_at: string;
}

export interface QuantifiedRecommendation {
  id: string;
  title: string;
  action_summary: string;
  weekly_profit_delta: number;
  signup_delta: number;
  regional_impact: Record<Region, number>;
  timeframe_weeks: number;
  pros: string[];
  cons: string[];
  evidence_ids: EvidenceId[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  confidence?: ConfidenceLevel;
  evidence_ids?: EvidenceId[];
  causation_assessment?: string;
  recommendations?: QuantifiedRecommendation[];
  follow_up_suggestions?: string[];
  scenario_simulation?: SimulateResult;
}
