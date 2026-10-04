import {
  BriefingReport,
  DQIssue,
  DQSummaryItem,
  Entity,
  EventRecord,
  PLDriver,
  Region,
  SensitivityItem,
  SimulateResult,
  SourceFreshness,
  ChatMessage,
} from '../types/mdm';

export const mockFreshness: SourceFreshness[] = [
  {
    source_system: 'observability',
    domain: 'operational',
    events_count: 1294800,
    last_ingested_at: '2026-10-04T08:12:18Z',
    minutes_ago: 0.2,
    stale: false,
    consumer_lag_ms: 18,
    contract_status: 'healthy',
  },
  {
    source_system: 'web_analytics',
    domain: 'client',
    events_count: 482100,
    last_ingested_at: '2026-10-04T08:11:42Z',
    minutes_ago: 0.8,
    stale: false,
    consumer_lag_ms: 45,
    contract_status: 'healthy',
  },
  {
    source_system: 'crm',
    domain: 'client',
    events_count: 14230,
    last_ingested_at: '2026-10-04T08:10:05Z',
    minutes_ago: 2.4,
    stale: false,
    consumer_lag_ms: 120,
    contract_status: 'healthy',
  },
  {
    source_system: 'erp',
    domain: 'financial',
    events_count: 28940,
    last_ingested_at: '2026-10-04T08:08:30Z',
    minutes_ago: 4.0,
    stale: false,
    consumer_lag_ms: 210,
    contract_status: 'healthy',
  },
  {
    source_system: 'partner_portal',
    domain: 'partner',
    events_count: 8940,
    last_ingested_at: '2026-10-04T08:07:15Z',
    minutes_ago: 5.2,
    stale: false,
    consumer_lag_ms: 190,
    contract_status: 'healthy',
  },
  {
    source_system: 'market_intel',
    domain: 'competitive',
    events_count: 1420,
    last_ingested_at: '2026-10-04T06:50:00Z',
    minutes_ago: 82.5,
    stale: true, // STALE IS AN INCIDENT
    consumer_lag_ms: 4950000,
    contract_status: 'stale',
  },
];

export const mockDQSummary: DQSummaryItem[] = [
  {
    issue_type: 'invalid',
    count: 14,
    description: 'Schema/contract violations (missing mandatory fields, invalid data types)',
  },
  {
    issue_type: 'rule_violation',
    count: 28,
    description: 'Business rule failures (negative revenue, clock skew > 5m, ratio > 1.0)',
  },
  {
    issue_type: 'duplicate',
    count: 67,
    description: 'Replayed source_event_id dropped at ingestion barrier (safe idempotency)',
  },
  {
    issue_type: 'anomaly',
    count: 9,
    description: 'Statistical z-score > 4.0 against 30-day baseline distribution',
  },
];

export const mockDQIssues: DQIssue[] = [
  {
    id: 'DQI-8841',
    source_system: 'market_intel',
    issue_type: 'invalid',
    reason: 'Missing required competitor field: competitor_match_key',
    field_name: 'competitor_match_key',
    rejected_payload: {
      source_event_id: 'mi_evt_99182',
      pricing_tier: 'enterprise',
      price_usd: 1200,
      timestamp: '2026-10-04T06:49:50Z',
    },
    ts: '2026-10-04T06:49:50Z',
    severity: 'high',
  },
  {
    id: 'DQI-8840',
    source_system: 'erp',
    issue_type: 'rule_violation',
    reason: 'Negative commission amount violates non-negative financial rule',
    field_name: 'partner_commission',
    rejected_payload: {
      source_event_id: 'erp_trx_44109',
      partner_commission: -1450.0,
      region: 'APAC',
      currency: 'USD',
    },
    ts: '2026-10-04T07:15:20Z',
    severity: 'high',
  },
  {
    id: 'DQI-8839',
    source_system: 'crm',
    issue_type: 'anomaly',
    reason: 'Z-score 4.8 on batch churn event volume in EU (245 churns in 1 hour)',
    field_name: 'churn_count',
    rejected_payload: {
      source_event_id: 'crm_batch_2291',
      churn_count: 245,
      z_score: 4.82,
      region: 'EU',
    },
    ts: '2026-10-04T05:30:10Z',
    z_score: 4.82,
    severity: 'medium',
  },
  {
    id: 'DQI-8838',
    source_system: 'partner_portal',
    issue_type: 'duplicate',
    reason: 'Duplicate source_event_id: part_lead_5510 already committed to event store',
    field_name: 'source_event_id',
    rejected_payload: {
      source_event_id: 'part_lead_5510',
      partner_id: 'part_ref_441',
      referral_score: 0.92,
    },
    ts: '2026-10-04T04:12:00Z',
    severity: 'low',
  },
  {
    id: 'DQI-8837',
    source_system: 'observability',
    issue_type: 'rule_violation',
    reason: 'Clock skew detected: event timestamp is 14 minutes in the future',
    field_name: 'ts',
    rejected_payload: {
      source_event_id: 'obs_lat_99188',
      cluster: 'tokyo-edge-01',
      latency_ms: 120,
      ts: '2026-10-04T08:26:00Z',
    },
    ts: '2026-10-04T08:12:00Z',
    severity: 'medium',
  },
];

export const mockEntities: Entity[] = [
  {
    id: 'ent_acme_tech',
    kind: 'client',
    match_key: 'acmetechnologies',
    canonical_name: 'Acme Technologies Ltd',
    region: 'APAC',
    created_at: '2026-03-12T10:00:00Z',
    is_multi_source: true,
    source_ids: [
      {
        source_system: 'crm',
        source_id: 'crm_org_98412',
        source_name: 'ACME Ltd',
        last_seen_at: '2026-10-04T07:45:00Z',
      },
      {
        source_system: 'erp',
        source_id: 'erp_cust_00298',
        source_name: 'Acme Limited (Asia)',
        last_seen_at: '2026-10-04T08:00:00Z',
      },
      {
        source_system: 'partner_portal',
        source_id: 'part_ref_441',
        source_name: 'acme-tech',
        last_seen_at: '2026-10-03T19:30:00Z',
      },
      {
        source_system: 'web_analytics',
        source_id: 'web_org_1082',
        source_name: 'Acme Technologies Inc.',
        last_seen_at: '2026-10-04T08:11:00Z',
      },
    ],
  },
  {
    id: 'ent_apex_global',
    kind: 'client',
    match_key: 'apexglobal',
    canonical_name: 'Apex Global Logistics Pte',
    region: 'APAC',
    created_at: '2026-04-18T14:20:00Z',
    is_multi_source: true,
    source_ids: [
      {
        source_system: 'crm',
        source_id: 'crm_org_44211',
        source_name: 'Apex Global',
        last_seen_at: '2026-10-04T06:10:00Z',
      },
      {
        source_system: 'erp',
        source_id: 'erp_cust_9941',
        source_name: 'Apex Global Logistics Pte Ltd',
        last_seen_at: '2026-10-04T07:50:00Z',
      },
      {
        source_system: 'web_analytics',
        source_id: 'web_org_4901',
        source_name: 'Apex Logistics SG',
        last_seen_at: '2026-10-04T07:55:00Z',
      },
    ],
  },
  {
    id: 'ent_zephyr_cloud',
    kind: 'partner',
    match_key: 'zephyrcloud',
    canonical_name: 'Zephyr Cloud GmbH',
    region: 'EU',
    created_at: '2026-01-22T09:15:00Z',
    is_multi_source: true,
    source_ids: [
      {
        source_system: 'partner_portal',
        source_id: 'part_9921',
        source_name: 'Zephyr Cloud GmbH',
        last_seen_at: '2026-10-04T08:05:00Z',
      },
      {
        source_system: 'erp',
        source_id: 'erp_vend_881',
        source_name: 'Zephyr Cloud Systems Germany',
        last_seen_at: '2026-10-03T23:00:00Z',
      },
    ],
  },
  {
    id: 'ent_hyperion_dig',
    kind: 'client',
    match_key: 'hyperiondigital',
    canonical_name: 'Hyperion Digital Corp',
    region: 'NA',
    created_at: '2026-05-11T16:40:00Z',
    is_multi_source: true,
    source_ids: [
      {
        source_system: 'crm',
        source_id: 'crm_org_771',
        source_name: 'Hyperion Digital',
        last_seen_at: '2026-10-04T07:30:00Z',
      },
      {
        source_system: 'web_analytics',
        source_id: 'web_org_339',
        source_name: 'Hyperion Digital LLC',
        last_seen_at: '2026-10-04T08:01:00Z',
      },
    ],
  },
  {
    id: 'ent_cloudscale_comp',
    kind: 'competitor',
    match_key: 'cloudscale',
    canonical_name: 'CloudScale Technologies',
    region: 'EU',
    created_at: '2026-06-01T12:00:00Z',
    is_multi_source: false,
    source_ids: [
      {
        source_system: 'market_intel',
        source_id: 'mi_comp_12',
        source_name: 'CloudScale',
        last_seen_at: '2026-10-04T06:50:00Z',
      },
    ],
  },
];

export const mockBriefing: BriefingReport = {
  as_of: '2026-10-04T08:00:00Z',
  window_days: 21,
  executive_summary:
    'Cross-domain causal analysis resolves APAC revenue underperformance (-$42.5k/week) directly to a persistent 325ms latency spike in the Tokyo edge gateway, which cascaded into partner referral degradation and signup collapse 3 days later. In contrast, EU marketing spend expansion (+18%) proved causally inefficacious for signups despite high superficial correlation. One source feed (market_intel) is currently STALE and excluded from competitive weighting.',
  verification_issues: [], // Empty list = passed deterministic verification cycle
  llm_error: null,
  findings: [
    {
      id: 'FINDING-01',
      headline: 'APAC Revenue Collapse Root-Caused to Edge API Gateway Latency Cascade',
      confidence: 'High',
      confidence_rationale:
        'Triangulated across 4 domains (observability, partner, client, financial) with Granger causality p < 0.005 at 2-to-3 day lag windows.',
      domain_chain: ['operational', 'partner', 'client', 'financial'],
      causal_steps: [
        'Tokyo/Singapore edge gateway connection pool reached 98% saturation, inflating P99 API latency from 85ms to 410ms [S1, I1].',
        'Partner referral checkout timeout rate spiked 4.2x, causing partner referral quality metric to plummet from 0.88 to 0.54 [S2, L1].',
        'Converted client signups in APAC dropped 28.4% starting 3 days post-latency onset [S3, L2].',
        'Net weekly APAC recurring revenue declined by $42,500 across 34 mid-market accounts [S4, L3].',
      ],
      business_impact: {
        weekly_profit_delta: -42500,
        signup_delta: -94,
        affected_regions: ['APAC'],
        summary: '-$42,500/week recurring profit drag, 94 lost signups per week in APAC region.',
      },
      causal_test: {
        test_type: 'Granger Causality',
        test_statistic: 'F = 18.42 (t = 8.4)',
        p_value: 0.0018,
        lag_days: 3,
        sample_size: 504,
      },
      evidence_ids: ['S1', 'I1', 'S2', 'L1', 'S3', 'L2', 'S4', 'L3'],
    },
    {
      id: 'FINDING-02',
      headline: 'NA Partner Tier Restructuring Generated +$18.2k Net Weekly Profit',
      confidence: 'High',
      confidence_rationale:
        'Controlled step-level difference-in-differences test vs unadjusted EU partner cohorts confirms causal referral uplift.',
      domain_chain: ['partner', 'client', 'financial'],
      causal_steps: [
        'Revised commission tier (+2% on high-retention signups) incentivized 12 top-tier NA partners to route enterprise prospects.',
        'NA partner referral quality increased +19% within 7 days.',
        'Average enterprise contract value lifted +14% ($4,800 vs $4,210 baseline), yielding +$18,200 weekly profit after partner commission payouts.',
      ],
      business_impact: {
        weekly_profit_delta: 18200,
        signup_delta: 26,
        affected_regions: ['NA'],
        summary: '+$18,200/week incremental net profit; +26 high-LTV enterprise signups weekly.',
      },
      causal_test: {
        test_type: 'Difference-in-Differences',
        test_statistic: 't = 6.21',
        p_value: 0.0004,
        lag_days: 2,
        sample_size: 336,
      },
      evidence_ids: ['S2', 'L2', 'L3'],
    },
    {
      id: 'FINDING-03',
      headline: 'EU Marketing Budget Expansion Failed Causal Signup Lift Test',
      confidence: 'Medium',
      confidence_rationale:
        'Regression discontinuity reveals +18% spend increase yielded zero statistically distinguishable conversion increment (p = 0.41).',
      domain_chain: ['financial', 'client'],
      causal_steps: [
        'Marketing spend in EU increased by $14,000/week across programmatic search and display channels.',
        'Gross visits lifted +12%, but lead qualification rate dropped proportionally from 4.8% to 4.1%.',
        'Net signups remained statistically flat (312/week vs 315/week baseline). Net weekly financial loss is -$13,200.',
      ],
      business_impact: {
        weekly_profit_delta: -13200,
        signup_delta: -3,
        affected_regions: ['EU'],
        summary: '-$13,200/week net loss due to acquisition channel dilution.',
      },
      causal_test: {
        test_type: 'Change-Point Shift',
        test_statistic: 't = 0.82',
        p_value: 0.412,
        lag_days: 1,
        sample_size: 420,
      },
      evidence_ids: ['S5', 'L4'],
    },
  ],
  ruled_out: [
    {
      id: 'RO-01',
      headline: 'Consumer App Store Review Decline vs Corporate Enterprise Signups',
      spurious_correlation_found:
        'Visual dashboard correlation (r = 0.81) between 1-star iOS reviews and lower B2B contracts.',
      why_ruled_out:
        'Entity resolution segregated B2C individual testers from canonical corporate domains. Controlling for company match keys, enterprise pipeline velocity showed zero sensitivity to consumer app store ratings (Granger p = 0.78). Spurious correlation driven by shared calendar seasonality.',
      evidence_refuted: 'App Store review sentiment does NOT cause enterprise deal stalls.',
      domain_pair: ['client', 'financial'],
    },
    {
      id: 'RO-02',
      headline: 'Global Inflation Index Shift vs SaaS Churn Rate',
      spurious_correlation_found:
        'Quarterly macro inflation announcement co-occurred with 0.4% bump in logo churn.',
      why_ruled_out:
        'Synthetic control modeling across 4 regions revealed churn was entirely localized to APAC accounts experiencing edge gateway timeouts, with NA and EU churn remaining within ±0.05% of 3-year baseline.',
      evidence_refuted: 'Macro index is an exogenous confounder, not an active causal driver.',
      domain_pair: ['operational', 'financial'],
    },
  ],
  early_warnings: [
    {
      id: 'EW-01',
      title: 'APAC Partner Concentration Approaching Single-Point Failure',
      domain: 'partner',
      region: 'APAC',
      lead_indicator: 'Top 2 partners generate 68.4% of total APAC enterprise referrals [R1].',
      projected_impact:
        'A single partner churn or platform migration would trigger -$29k/week revenue shock.',
      lead_time_days: 14,
      evidence_ids: ['R1'],
    },
    {
      id: 'EW-02',
      title: 'Competitor CloudScale Pricing Under-Cut in EU Mid-Market',
      domain: 'competitive',
      region: 'EU',
      lead_indicator: 'CloudScale published 25% price reduction on enterprise multi-seat tier [R2].',
      projected_impact: 'Projected 6% win-rate drop in EU mid-market bake-offs over next 21 days.',
      lead_time_days: 21,
      evidence_ids: ['R2', 'F2'],
    },
  ],
  data_caveats: [
    {
      id: 'DC-01',
      source: 'market_intel',
      caveat:
        'Source feed market_intel is STALE (82 minutes since last batch). Contract status is degraded.',
      impact_on_analysis:
        'Competitive driver weights are frozen at 2026-10-04 06:50 UTC state. Freshness incident ticket active.',
      status: 'active',
    },
    {
      id: 'DC-02',
      source: 'erp',
      caveat: 'Manual ERP month-end reconciliation adjustments pending for LATAM currency pairs.',
      impact_on_analysis:
        'LATAM profit margin figures reflect raw unadjusted transactional billing.',
      status: 'active',
    },
  ],
  signals: [
    {
      id: 'S1',
      domain: 'operational',
      metric: 'p99_latency_ms',
      region: 'APAC',
      baseline_value: 85,
      shifted_value: 410,
      shift_pct: 382.3,
      t_statistic: 8.4,
      detected_at: '2026-09-28T14:00:00Z',
      p_value: 0.0001,
      description: 'Persistent P99 latency change-point on Tokyo edge gateway proxy cluster.',
    },
    {
      id: 'S2',
      domain: 'partner',
      metric: 'referral_quality_score',
      region: 'APAC',
      baseline_value: 0.88,
      shifted_value: 0.54,
      shift_pct: -38.6,
      t_statistic: 6.9,
      detected_at: '2026-09-30T09:00:00Z',
      p_value: 0.0004,
      description: 'Drop in partner lead qualification score following partner API timeout burst.',
    },
    {
      id: 'S3',
      domain: 'client',
      metric: 'signup_count',
      region: 'APAC',
      baseline_value: 332,
      shifted_value: 238,
      shift_pct: -28.3,
      t_statistic: 7.2,
      detected_at: '2026-10-01T12:00:00Z',
      p_value: 0.0002,
      description: 'Sharp reduction in weekly signups across APAC enterprise client domain.',
    },
    {
      id: 'S4',
      domain: 'financial',
      metric: 'net_revenue_usd',
      region: 'APAC',
      baseline_value: 129400,
      shifted_value: 86900,
      shift_pct: -32.8,
      t_statistic: 6.1,
      detected_at: '2026-10-02T18:00:00Z',
      p_value: 0.0011,
      description: 'Weekly revenue drop of $42,500/wk reflecting delayed signup loss.',
    },
    {
      id: 'S5',
      domain: 'competitive',
      metric: 'competitor_discount_pct',
      region: 'EU',
      baseline_value: 0,
      shifted_value: 25,
      shift_pct: 100,
      t_statistic: 5.8,
      detected_at: '2026-10-03T08:00:00Z',
      p_value: 0.002,
      description: 'CloudScale enterprise catalog price drop detected via web scrapes.',
    },
  ],
  links: [
    {
      id: 'L1',
      source_domain: 'operational',
      source_metric: 'p99_latency_ms',
      target_domain: 'partner',
      target_metric: 'referral_quality_score',
      region: 'APAC',
      lag_days: 2,
      correlation_coeff: -0.84,
      granger_p_value: 0.0018,
      direction: 'leading',
      description: 'API latency leads partner referral quality score degradation by 48 hours.',
    },
    {
      id: 'L2',
      source_domain: 'partner',
      source_metric: 'referral_quality_score',
      target_domain: 'client',
      target_metric: 'signup_count',
      region: 'APAC',
      lag_days: 3,
      correlation_coeff: 0.79,
      granger_p_value: 0.0024,
      direction: 'leading',
      description: 'Partner referral score drop leads regional client signup volume by 72 hours.',
    },
    {
      id: 'L3',
      source_domain: 'client',
      source_metric: 'signup_count',
      target_domain: 'financial',
      target_metric: 'net_revenue_usd',
      region: 'APAC',
      lag_days: 1,
      correlation_coeff: 0.91,
      granger_p_value: 0.0001,
      direction: 'leading',
      description: 'Weekly signup conversions convert into billing revenue with 24h invoice lag.',
    },
    {
      id: 'L4',
      source_domain: 'competitive',
      source_metric: 'competitor_discount_pct',
      target_domain: 'client',
      target_metric: 'churn_rate',
      region: 'EU',
      lag_days: 5,
      correlation_coeff: 0.68,
      granger_p_value: 0.012,
      direction: 'leading',
      description: 'Aggressive pricing shift correlates with customer evaluation churn inquiries.',
    },
  ],
  incidents: [
    {
      id: 'I1',
      domain: 'operational',
      source_system: 'observability',
      region: 'APAC',
      summary: 'Tokyo edge gateway proxy connection pool exhaustion under TLS renegotiation spike',
      severity: 'P1',
      started_at: '2026-09-28T13:45:00Z',
      resolved_at: '2026-10-02T16:00:00Z',
      duration_hours: 98.2,
      root_cause:
        'HTTP/2 multiplexing bug in edge reverse proxy caused unreleased worker threads.',
    },
    {
      id: 'I2',
      domain: 'partner',
      source_system: 'partner_portal',
      region: 'NA',
      summary: 'Partner webhook retry storm caused 12-minute auth token invalidation',
      severity: 'P2',
      started_at: '2026-10-01T04:20:00Z',
      resolved_at: '2026-10-01T05:32:00Z',
      duration_hours: 1.2,
      root_cause: 'Idempotency key collision on batch referral ingestion endpoint.',
    },
  ],
  risks: [
    {
      id: 'R1',
      domain: 'partner',
      category: 'partner_concentration',
      metric: 'top_2_partner_referral_share',
      threshold: '> 60.0%',
      current_value: '68.4%',
      description: 'Extreme dependency on two APAC partners (Zephyr Asia & BluePeak SG).',
    },
    {
      id: 'R2',
      domain: 'competitive',
      category: 'emerging_competitor',
      metric: 'discount_anomaly_z_score',
      threshold: 'z > 3.0',
      current_value: 'z = 3.42',
      z_score: 3.42,
      description: 'CloudScale discounted tier is 3.42 standard deviations below industry median.',
    },
  ],
  forecasts: [
    {
      id: 'F1',
      metric: 'net_revenue_usd',
      region: 'APAC',
      current_run_rate: 86900,
      projected_7d: 94200,
      projected_21d: 118500,
      confidence_interval: [89000, 126000],
      trend_direction: 'up',
    },
    {
      id: 'F2',
      metric: 'signup_count',
      region: 'EU',
      current_run_rate: 312,
      projected_7d: 318,
      projected_21d: 334,
      confidence_interval: [305, 345],
      trend_direction: 'neutral',
    },
  ],
};

export const mockSensitivity: SensitivityItem[] = [
  {
    driver: 'signup_rate',
    driver_label: 'Signup Rate (% of leads)',
    profit_delta_per_10pct: 32400,
    share_of_profit: 0.38,
    unit: '+$32.4k/wk per +10%',
  },
  {
    driver: 'revenue_per_signup',
    driver_label: 'Revenue per Signup ($ ACV)',
    profit_delta_per_10pct: 28500,
    share_of_profit: 0.33,
    unit: '+$28.5k/wk per +10%',
  },
  {
    driver: 'lead_rate',
    driver_label: 'Lead Qualification Rate (%)',
    profit_delta_per_10pct: 19800,
    share_of_profit: 0.23,
    unit: '+$19.8k/wk per +10%',
  },
  {
    driver: 'visits',
    driver_label: 'Gross Web & Portal Visits',
    profit_delta_per_10pct: 12200,
    share_of_profit: 0.14,
    unit: '+$12.2k/wk per +10%',
  },
  {
    driver: 'marketing_spend',
    driver_label: 'Marketing Acquisition Spend',
    profit_delta_per_10pct: -6500, // Costs money
    share_of_profit: -0.07,
    unit: '-$6.5k/wk per +10%',
  },
  {
    driver: 'partner_commission',
    driver_label: 'Partner Commission Payout',
    profit_delta_per_10pct: -4100,
    share_of_profit: -0.05,
    unit: '-$4.1k/wk per +10%',
  },
];

// Baseline regional metrics for P&L simulator
export const baseRegionalMetrics: Record<
  Region,
  {
    weekly_profit: number;
    weekly_signups: number;
    weekly_revenue: number;
    visits: number;
    lead_rate: number;
    signup_rate: number;
    rev_per_signup: number;
    marketing_spend: number;
    partner_commission: number;
  }
> = {
  NA: {
    weekly_profit: 94500,
    weekly_signups: 420,
    weekly_revenue: 168000,
    visits: 65000,
    lead_rate: 0.052,
    signup_rate: 0.124,
    rev_per_signup: 400,
    marketing_spend: 42000,
    partner_commission: 31500,
  },
  EU: {
    weekly_profit: 68200,
    weekly_signups: 312,
    weekly_revenue: 121000,
    visits: 52000,
    lead_rate: 0.046,
    signup_rate: 0.13,
    rev_per_signup: 388,
    marketing_spend: 31000,
    partner_commission: 21800,
  },
  APAC: {
    weekly_profit: 32400, // Depressed due to latency issue
    weekly_signups: 238,
    weekly_revenue: 86900,
    visits: 48000,
    lead_rate: 0.041,
    signup_rate: 0.121,
    rev_per_signup: 365,
    marketing_spend: 29000,
    partner_commission: 25500,
  },
  LATAM: {
    weekly_profit: 24100,
    weekly_signups: 165,
    weekly_revenue: 49500,
    visits: 28000,
    lead_rate: 0.048,
    signup_rate: 0.123,
    rev_per_signup: 300,
    marketing_spend: 14000,
    partner_commission: 11400,
  },
};

/**
 * Deterministic P&L simulation engine (replicates app/services/scenario.py)
 * Computes exact before/after financials without any LLM hallucination.
 */
export function simulatePLShocks(shocks: Record<PLDriver, number>): SimulateResult {
  const regions: Region[] = ['NA', 'EU', 'APAC', 'LATAM'];
  const breakdown = regions.map((region) => {
    const base = baseRegionalMetrics[region];

    const multVisits = 1 + (shocks.visits || 0) / 100;
    const multLeadRate = 1 + (shocks.lead_rate || 0) / 100;
    const multSignupRate = 1 + (shocks.signup_rate || 0) / 100;
    const multRevPerSignup = 1 + (shocks.revenue_per_signup || 0) / 100;
    const multMktg = 1 + (shocks.marketing_spend || 0) / 100;
    const multComm = 1 + (shocks.partner_commission || 0) / 100;

    const simVisits = base.visits * multVisits;
    const simLeadRate = base.lead_rate * multLeadRate;
    const simLeads = simVisits * simLeadRate;
    const simSignupRate = base.signup_rate * multSignupRate;
    const simSignups = Math.round(simLeads * simSignupRate);

    const simRevPerSignup = base.rev_per_signup * multRevPerSignup;
    const simRevenue = simSignups * simRevPerSignup;

    const simMktgSpend = base.marketing_spend * multMktg;
    const simCommSpend = base.partner_commission * multComm;

    const simProfit = Math.round(simRevenue - simMktgSpend - simCommSpend);
    const profitDelta = simProfit - base.weekly_profit;
    const signupDelta = simSignups - base.weekly_signups;

    return {
      region,
      baseline_weekly_profit: base.weekly_profit,
      simulated_weekly_profit: simProfit,
      profit_delta: profitDelta,
      baseline_signups: base.weekly_signups,
      simulated_signups: simSignups,
      signup_delta: signupDelta,
    };
  });

  const totalBaseProfit = breakdown.reduce((acc, r) => acc + r.baseline_weekly_profit, 0);
  const totalSimProfit = breakdown.reduce((acc, r) => acc + r.simulated_weekly_profit, 0);
  const totalBaseSignups = breakdown.reduce((acc, r) => acc + r.baseline_signups, 0);
  const totalSimSignups = breakdown.reduce((acc, r) => acc + r.simulated_signups, 0);

  const appliedList = (Object.keys(shocks) as PLDriver[])
    .filter((k) => shocks[k] !== 0)
    .map((k) => ({ driver: k, shock_pct: shocks[k] }));

  return {
    total_baseline_weekly_profit: totalBaseProfit,
    total_simulated_weekly_profit: totalSimProfit,
    net_profit_delta: totalSimProfit - totalBaseProfit,
    total_baseline_signups: totalBaseSignups,
    total_simulated_signups: totalSimSignups,
    net_signup_delta: totalSimSignups - totalBaseSignups,
    regional_breakdown: breakdown,
    applied_shocks: appliedList,
    computed_at: new Date().toISOString(),
  };
}

export interface MetricDataPoint {
  date: string;
  dayIndex: number;
  NA: number;
  EU: number;
  APAC: number;
  LATAM: number;
}

// 21 days time series data for 4 metrics
export const mockTimeseriesByMetric: Record<string, MetricDataPoint[]> = {
  revenue: [
    { date: 'Sep 14', dayIndex: 1, NA: 162000, EU: 118000, APAC: 128000, LATAM: 48000 },
    { date: 'Sep 15', dayIndex: 2, NA: 164000, EU: 119000, APAC: 129000, LATAM: 48500 },
    { date: 'Sep 16', dayIndex: 3, NA: 165000, EU: 118500, APAC: 127500, LATAM: 49000 },
    { date: 'Sep 17', dayIndex: 4, NA: 166000, EU: 120000, APAC: 129400, LATAM: 48800 },
    { date: 'Sep 18', dayIndex: 5, NA: 165500, EU: 121000, APAC: 128900, LATAM: 49200 },
    { date: 'Sep 19', dayIndex: 6, NA: 167000, EU: 120500, APAC: 130100, LATAM: 49500 },
    { date: 'Sep 20', dayIndex: 7, NA: 166800, EU: 119800, APAC: 129200, LATAM: 49100 },
    { date: 'Sep 21', dayIndex: 8, NA: 167200, EU: 120200, APAC: 128500, LATAM: 49400 },
    { date: 'Sep 22', dayIndex: 9, NA: 168000, EU: 121500, APAC: 129000, LATAM: 49600 },
    { date: 'Sep 23', dayIndex: 10, NA: 167500, EU: 121000, APAC: 128100, LATAM: 49300 },
    { date: 'Sep 24', dayIndex: 11, NA: 168200, EU: 121800, APAC: 127900, LATAM: 49700 },
    { date: 'Sep 25', dayIndex: 12, NA: 169000, EU: 120900, APAC: 126500, LATAM: 49500 },
    { date: 'Sep 26', dayIndex: 13, NA: 168500, EU: 121400, APAC: 125000, LATAM: 49800 },
    { date: 'Sep 27', dayIndex: 14, NA: 169200, EU: 122000, APAC: 122000, LATAM: 49900 },
    // Latency spike onset -> APAC drops sharply
    { date: 'Sep 28', dayIndex: 15, NA: 169500, EU: 121900, APAC: 115000, LATAM: 49400 },
    { date: 'Sep 29', dayIndex: 16, NA: 170000, EU: 122200, APAC: 108000, LATAM: 49600 },
    { date: 'Sep 30', dayIndex: 17, NA: 168900, EU: 121700, APAC: 99000, LATAM: 49200 },
    { date: 'Oct 01', dayIndex: 18, NA: 169400, EU: 121500, APAC: 92000, LATAM: 49500 },
    { date: 'Oct 02', dayIndex: 19, NA: 170200, EU: 121800, APAC: 88500, LATAM: 49700 },
    { date: 'Oct 03', dayIndex: 20, NA: 170800, EU: 121200, APAC: 87100, LATAM: 49600 },
    { date: 'Oct 04', dayIndex: 21, NA: 171200, EU: 121400, APAC: 86900, LATAM: 49800 },
  ],
  signups: [
    { date: 'Sep 14', dayIndex: 1, NA: 410, EU: 310, APAC: 330, LATAM: 162 },
    { date: 'Sep 17', dayIndex: 4, NA: 415, EU: 312, APAC: 332, LATAM: 164 },
    { date: 'Sep 21', dayIndex: 8, NA: 418, EU: 314, APAC: 331, LATAM: 163 },
    { date: 'Sep 25', dayIndex: 12, NA: 422, EU: 313, APAC: 326, LATAM: 166 },
    { date: 'Sep 28', dayIndex: 15, NA: 420, EU: 315, APAC: 295, LATAM: 165 },
    { date: 'Oct 01', dayIndex: 18, NA: 424, EU: 312, APAC: 252, LATAM: 164 },
    { date: 'Oct 04', dayIndex: 21, NA: 426, EU: 314, APAC: 238, LATAM: 165 },
  ],
  visits: [
    { date: 'Sep 14', dayIndex: 1, NA: 63000, EU: 51000, APAC: 48500, LATAM: 27500 },
    { date: 'Sep 17', dayIndex: 4, NA: 64200, EU: 51400, APAC: 48200, LATAM: 27800 },
    { date: 'Sep 21', dayIndex: 8, NA: 64800, EU: 51800, APAC: 48600, LATAM: 28000 },
    { date: 'Sep 25', dayIndex: 12, NA: 65100, EU: 52100, APAC: 48400, LATAM: 28100 },
    { date: 'Sep 28', dayIndex: 15, NA: 65000, EU: 52000, APAC: 47900, LATAM: 28200 },
    { date: 'Oct 01', dayIndex: 18, NA: 65400, EU: 52200, APAC: 48100, LATAM: 27900 },
    { date: 'Oct 04', dayIndex: 21, NA: 65600, EU: 52400, APAC: 48000, LATAM: 28000 },
  ],
  latency_ms: [
    { date: 'Sep 14', dayIndex: 1, NA: 42, EU: 38, APAC: 84, LATAM: 92 },
    { date: 'Sep 17', dayIndex: 4, NA: 41, EU: 39, APAC: 86, LATAM: 94 },
    { date: 'Sep 21', dayIndex: 8, NA: 43, EU: 38, APAC: 85, LATAM: 91 },
    { date: 'Sep 25', dayIndex: 12, NA: 42, EU: 40, APAC: 88, LATAM: 93 },
    { date: 'Sep 28', dayIndex: 15, NA: 44, EU: 39, APAC: 240, LATAM: 95 },
    { date: 'Oct 01', dayIndex: 18, NA: 43, EU: 38, APAC: 385, LATAM: 92 },
    { date: 'Oct 04', dayIndex: 21, NA: 42, EU: 39, APAC: 410, LATAM: 94 },
  ],
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-01',
    sender: 'user',
    timestamp: '08:05 AM',
    text: 'Why did APAC revenue drop last week, and what is the exact financial impact?',
  },
  {
    id: 'msg-02',
    sender: 'assistant',
    timestamp: '08:05 AM',
    text: 'Causal analysis trace completed across 4 domains. The drop is not demand fatigue or competitor pricing; it is a technical latency cascade originating in the Tokyo edge gateway.',
    confidence: 'High',
    causation_assessment:
      'Verified via Granger Causality (F=18.42, p=0.0018) at 3-day lag. P99 latency shifted from 85ms to 410ms on Sep 28.',
    evidence_ids: ['S1', 'I1', 'S2', 'L1', 'S3', 'L2', 'S4'],
    recommendations: [
      {
        id: 'REC-01',
        title: 'Restart Edge Proxy Pool & Deploy Connection Keep-Alive Patch',
        action_summary:
          'Clear hung worker threads in the Tokyo/Singapore gateway cluster to restore 85ms P99 latency.',
        weekly_profit_delta: 42500,
        signup_delta: 94,
        regional_impact: { APAC: 42500, NA: 0, EU: 0, LATAM: 0 },
        timeframe_weeks: 1,
        pros: [
          'Immediate recovery of $42.5k/week recurring revenue',
          'Restores partner portal referral completion rate to 0.88',
          'Zero capital expenditure',
        ],
        cons: ['Requires 5-minute scheduled off-peak gateway reboot'],
        evidence_ids: ['S1', 'I1', 'S4'],
      },
      {
        id: 'REC-02',
        title: 'Provision Secondary Failover Route via Osaka Point-of-Presence',
        action_summary:
          'Implement automated BGP health-check routing around degraded Tokyo node during traffic surges.',
        weekly_profit_delta: 12000,
        signup_delta: 28,
        regional_impact: { APAC: 12000, NA: 0, EU: 0, LATAM: 0 },
        timeframe_weeks: 2,
        pros: ['Guarantees SLA resilience against future connection pool leaks', 'Mitigates R1 risk'],
        cons: ['Additional cloud transit cost of ~$1,800/month'],
        evidence_ids: ['I1', 'R1'],
      },
    ],
    follow_up_suggestions: [
      'What if partner referral quality drops an additional 15%?',
      'Simulate +10% marketing spend in EU to compensate',
      'Show me raw evidence for Signal S1 and Incident I1',
    ],
  },
];
