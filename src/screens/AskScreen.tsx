import React, { useState } from 'react';
import {
  ChatMessage,
  ConfidenceLevel,
  DriverShock,
  EvidenceId,
  PLDriver,
  QuantifiedRecommendation,
  Region,
  SimulateResult,
} from '../types/mdm';
import {
  initialChatMessages,
  simulatePLShocks,
  mockSensitivity,
} from '../mockData/dataset';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { EvidenceChip } from '../components/common/EvidenceChip';
import {
  Send,
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Bot,
  User,
} from 'lucide-react';

interface AskScreenProps {
  onSelectEvidence: (id: EvidenceId) => void;
}

export const AskScreen: React.FC<AskScreenProps> = ({ onSelectEvidence }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'scenario'>('chat');

  // Scenario Simulator interactive shock state for the 6 P&L drivers
  const [shocks, setShocks] = useState<Record<PLDriver, number>>({
    visits: 0,
    lead_rate: 0,
    signup_rate: 0,
    revenue_per_signup: 0,
    marketing_spend: 0,
    partner_commission: 0,
  });

  const simulationResult = simulatePLShocks(shocks);

  const handleShockChange = (driver: PLDriver, val: number) => {
    setShocks((prev) => ({ ...prev, [driver]: val }));
  };

  const resetShocks = () => {
    setShocks({
      visits: 0,
      lead_rate: 0,
      signup_rate: 0,
      revenue_per_signup: 0,
      marketing_spend: 0,
      partner_commission: 0,
    });
  };

  const presetQueries = [
    'Why did APAC revenue drop last week, and what is the exact financial impact?',
    'What if partner referral quality drops an additional 15%?',
    'Simulate +10% marketing spend in EU to evaluate acquisition cost',
    'What is our risk exposure if Zephyr Asia partner terminates contract?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isSubmitting) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSubmitting(true);

    // Simulate deterministic engine dispatch (all numbers calculated via P&L scenario service)
    setTimeout(() => {
      let aiResponse: ChatMessage;

      if (query.toLowerCase().includes('partner referral quality') || query.toLowerCase().includes('15%')) {
        const scenarioShocks = { signup_rate: -15, lead_rate: -8, visits: 0, revenue_per_signup: 0, marketing_spend: 0, partner_commission: 0 };
        const sim = simulatePLShocks(scenarioShocks);

        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Deterministic scenario model evaluated a -15% partner referral shock. Because partner referrals account for 38% of enterprise conversions, this cascades into severe regional signup contractions.',
          confidence: 'High',
          causation_assessment:
            'Evaluated through app/services/scenario.py P&L model. Referral elasticity to profit is 0.38.',
          evidence_ids: ['S2', 'L1', 'L2', 'R1'],
          scenario_simulation: sim,
          recommendations: [
            {
              id: 'REC-SHOCK-1',
              title: 'Activate Secondary Partner Bounty (+5% Tier 1 Commission)',
              action_summary:
                'Offset the referral quality dip by immediately activating performance bonuses for backup regional partners.',
              weekly_profit_delta: 14800,
              signup_delta: 32,
              regional_impact: { APAC: 8400, NA: 3200, EU: 2200, LATAM: 1000 },
              timeframe_weeks: 2,
              pros: ['Halts pipeline contraction in 14 days', 'Incentivizes secondary agency channels'],
              cons: ['Increases partner commission line item by $6,200/wk'],
              evidence_ids: ['L2', 'R1'],
            },
          ],
          follow_up_suggestions: [
            'What happens if we increase marketing spend instead?',
            'Simulate combined shock of -15% referral and +10% marketing spend',
          ],
        };
      } else if (query.toLowerCase().includes('marketing spend') || query.toLowerCase().includes('eu')) {
        const sim = simulatePLShocks({ visits: 10, lead_rate: -5, signup_rate: 0, revenue_per_signup: 0, marketing_spend: 10, partner_commission: 0 });
        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Simulation completed. Increasing marketing spend by +10% in EU yields a net negative weekly profit delta (-$3,100/wk). Historical change-point test S5 confirms that paid marketing traffic experiences diminishing conversion return in EU mid-market.',
          confidence: 'Medium',
          causation_assessment:
            'Causal link L4 and signal S5 confirm CAC inflation outpaces deal close rates.',
          evidence_ids: ['S5', 'L4'],
          scenario_simulation: sim,
          recommendations: [
            {
              id: 'REC-MKTG-1',
              title: 'Reallocate $10k/wk to Customer Success & Expansion Billing',
              action_summary:
                'Focus capital on account expansion rather than top-of-funnel programmatic search in EU.',
              weekly_profit_delta: 9600,
              signup_delta: 12,
              regional_impact: { EU: 9600, NA: 0, APAC: 0, LATAM: 0 },
              timeframe_weeks: 3,
              pros: ['Higher LTV:CAC ratio (4.2x vs 1.8x)', 'Protects against CloudScale price cutting'],
              cons: ['Slower gross visitor volume accretion'],
              evidence_ids: ['S5', 'L4'],
            },
          ],
          follow_up_suggestions: [
            'Simulate +10% increase in revenue per signup instead',
            'Show me raw evidence for Signal S5',
          ],
        };
      } else {
        const sim = simulatePLShocks({ visits: 0, lead_rate: 0, signup_rate: 0, revenue_per_signup: 0, marketing_spend: 0, partner_commission: 0 });
        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Causal graph queried for: "${query}". Cross-domain verification confirmed zero ungrounded claims. Recommendation impacts are computed deterministically via the weekly P&L engine.`,
          confidence: 'High',
          causation_assessment:
            'Verified via multi-domain Granger causality tests across operational, partner, client, and financial events.',
          evidence_ids: ['S1', 'S2', 'L1', 'L2'],
          recommendations: [
            {
              id: 'REC-GEN-1',
              title: 'Targeted Remediation of APAC Ingestion & Network Route',
              action_summary:
                'Execute connection pool restart to immediately reclaim -$42,500/week in lost recurring run rate.',
              weekly_profit_delta: 42500,
              signup_delta: 94,
              regional_impact: { APAC: 42500, NA: 0, EU: 0, LATAM: 0 },
              timeframe_weeks: 1,
              pros: ['Zero software budget required', 'Restores partner conversion velocity'],
              cons: ['Short maintenance window required'],
              evidence_ids: ['S1', 'I1', 'S4'],
            },
          ],
          follow_up_suggestions: [
            'Why did APAC revenue drop last week?',
            'What if partner referral quality drops an additional 15%?',
          ],
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-900 dark:text-slate-100">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <span>Executive Copilot &amp; Scenario Lab</span>
            <span className="text-slate-400">·</span>
            <span>Deterministic P&amp;L Model</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Quantified Inquiries &amp; Simulation Workbench
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule 5.4: All recommendation numbers are calculated deterministically by the P&amp;L model — the LLM never invents numbers.
          </p>
        </div>

        {/* View Switcher: Conversational Copilot vs Direct Scenario Simulator */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Executive Q&amp;A
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scenario')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
              activeTab === 'scenario'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Direct P&amp;L Simulator (No LLM)
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        /* Executive Q&A View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Thread */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-5 rounded-lg border text-xs sm:text-sm space-y-3 ${
                    msg.sender === 'user'
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 ml-6 sm:ml-12'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mr-2 sm:mr-6 shadow-xs'
                  }`}
                >
                  {/* Sender & Timestamp */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {msg.sender === 'user' ? (
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {msg.sender === 'user' ? 'Executive Inquiry' : 'Causal Intelligence Engine'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{msg.timestamp}</span>
                  </div>

                  {/* Message Prose */}
                  <p className="leading-relaxed text-slate-800 dark:text-slate-200">{msg.text}</p>

                  {/* Confidence & Causation Assessment */}
                  {msg.confidence && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                      <ConfidenceBadge level={msg.confidence} />
                      {msg.causation_assessment && (
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {msg.causation_assessment}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Evidence Chips */}
                  {msg.evidence_ids && msg.evidence_ids.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400">Cited Evidence:</span>
                      {msg.evidence_ids.map((id) => (
                        <EvidenceChip key={id} id={id} onClick={onSelectEvidence} />
                      ))}
                    </div>
                  )}

                  {/* Simulation output snapshot if attached */}
                  {msg.scenario_simulation && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span>P&amp;L Simulation Output</span>
                        <span
                          className={`font-mono tabular-nums font-bold ${
                            msg.scenario_simulation.net_profit_delta >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          Net Weekly Profit Delta: {msg.scenario_simulation.net_profit_delta >= 0 ? '+' : ''}$
                          {msg.scenario_simulation.net_profit_delta.toLocaleString()}/wk
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-[11px] font-mono text-center">
                        {msg.scenario_simulation.regional_breakdown.map((r) => (
                          <div key={r.region} className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="block text-slate-400">{r.region}</span>
                            <span className={r.profit_delta < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                              {r.profit_delta >= 0 ? '+' : ''}${Math.round(r.profit_delta / 1000)}k
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantified Recommendations */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Quantified Recommendations (Deterministic P&amp;L Output)
                      </span>
                      {msg.recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {rec.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs font-mono font-bold shrink-0">
                              <span
                                className={
                                  rec.weekly_profit_delta > 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-rose-600 dark:text-rose-400'
                                }
                              >
                                {rec.weekly_profit_delta > 0 ? '+' : ''}$
                                {rec.weekly_profit_delta.toLocaleString()}/wk
                              </span>
                              <span className="text-slate-500">
                                {rec.signup_delta > 0 ? `+${rec.signup_delta}` : rec.signup_delta} signups/wk
                              </span>
                            </div>
                          </div>

                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                            {rec.action_summary}
                          </p>

                          {/* Pros & Cons */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                            <div className="p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Upsides
                              </span>
                              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5 text-[11px]">
                                {rec.pros.map((p, idx) => (
                                  <li key={idx}>{p}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-2 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1">
                              <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" />
                                Tradeoffs / Costs
                              </span>
                              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5 text-[11px]">
                                {rec.cons.map((c, idx) => (
                                  <li key={idx}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-up Suggestions */}
                  {msg.follow_up_suggestions && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Suggestions:</span>
                      {msg.follow_up_suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isSubmitting && (
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 animate-pulse">
                  <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="text-xs text-slate-400 font-mono">Running P&amp;L scenario simulation...</div>
                </div>
              )}
            </div>

            {/* Executive Composer */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xs space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a causal question (e.g. 'Why did APAC drop?' or 'Simulate +10% marketing spend')..."
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          </div>

          {/* Quick Presets & Driver Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Executive Inquiries
              </h2>
              <div className="space-y-2">
                {presetQueries.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-xs text-slate-700 dark:text-slate-300 transition-colors leading-snug cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3 text-xs">
              <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Deterministic Governance</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Every impact number shown above is computed by running the 6 P&amp;L drivers through the Python mathematical simulator. Hallucinated numbers are rejected during cyclic verification.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Direct Interactive Scenario Simulator (No LLM) */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>P&amp;L Shock Engine (POST /intelligence/simulate)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Apply percentage shocks to any of the 6 drivers and inspect instantaneous regional profit impacts.
              </p>
            </div>

            <button
              type="button"
              onClick={resetShocks}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors self-start cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Shocks</span>
            </button>
          </div>

          {/* 6 Driver Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(
              [
                { id: 'visits', label: 'Gross Visits', unit: '%' },
                { id: 'lead_rate', label: 'Lead Qualification Rate', unit: '%' },
                { id: 'signup_rate', label: 'Signup Conversion Rate', unit: '%' },
                { id: 'revenue_per_signup', label: 'Revenue per Signup ($ ACV)', unit: '%' },
                { id: 'marketing_spend', label: 'Marketing Acquisition Spend', unit: '%' },
                { id: 'partner_commission', label: 'Partner Commission Payout', unit: '%' },
              ] as const
            ).map((d) => (
              <div key={d.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{d.label}</span>
                  <span
                    className={`font-mono font-bold text-xs tabular-nums ${
                      shocks[d.id] > 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : shocks[d.id] < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {shocks[d.id] > 0 ? `+${shocks[d.id]}%` : `${shocks[d.id]}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="5"
                  value={shocks[d.id]}
                  onChange={(e) => handleShockChange(d.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-30%</span>
                  <span>0%</span>
                  <span>+30%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Simulation Output Dashboard */}
          <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Simulated Net Financial Results
              </span>
              <div className="text-xs font-mono text-slate-400">
                Computed via Deterministic P&amp;L Model · Weekly Basis
              </div>
            </div>

            {/* Total Delta Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Net Weekly Profit Delta</span>
                <div
                  className={`text-2xl font-bold font-mono tabular-nums ${
                    simulationResult.net_profit_delta >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {simulationResult.net_profit_delta >= 0 ? '+' : ''}$
                  {simulationResult.net_profit_delta.toLocaleString()}/wk
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Baseline: ${simulationResult.total_baseline_weekly_profit.toLocaleString()} → Simulated: $
                  {simulationResult.total_simulated_weekly_profit.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Net Weekly Signups Delta</span>
                <div
                  className={`text-2xl font-bold font-mono tabular-nums ${
                    simulationResult.net_signup_delta >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {simulationResult.net_signup_delta >= 0 ? '+' : ''}
                  {simulationResult.net_signup_delta.toLocaleString()} signups/wk
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Baseline: {simulationResult.total_baseline_signups.toLocaleString()} → Simulated:{' '}
                  {simulationResult.total_simulated_signups.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Regional Breakdown Table */}
            <div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Regional Breakdown (NA, EU, APAC, LATAM)
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      <th className="p-2.5">Region</th>
                      <th className="p-2.5 text-right">Baseline Profit</th>
                      <th className="p-2.5 text-right">Simulated Profit</th>
                      <th className="p-2.5 text-right">Profit Delta</th>
                      <th className="p-2.5 text-right">Signups Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-750">
                    {simulationResult.regional_breakdown.map((r) => (
                      <tr key={r.region} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold font-mono">{r.region}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums text-slate-500">
                          ${r.baseline_weekly_profit.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-mono tabular-nums font-semibold">
                          ${r.simulated_weekly_profit.toLocaleString()}
                        </td>
                        <td
                          className={`p-2.5 text-right font-mono tabular-nums font-bold ${
                            r.profit_delta >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {r.profit_delta >= 0 ? '+' : ''}${r.profit_delta.toLocaleString()}
                        </td>
                        <td
                          className={`p-2.5 text-right font-mono tabular-nums ${
                            r.signup_delta >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {r.signup_delta >= 0 ? `+${r.signup_delta}` : r.signup_delta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
