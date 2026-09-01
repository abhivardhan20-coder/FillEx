export type RiskProfile = 'conservative' | 'growth';
export type AgentState = 'complete' | 'degraded';

export type Evidence = {
  label: string;
  source: string;
  detail: string;
  observedAt: string;
};

export type AgentOutput = {
  id: 'market' | 'research' | 'risk';
  name: string;
  state: AgentState;
  latencyMs: number;
  signal: 'positive' | 'neutral' | 'cautious';
  confidence: number;
  summary: string;
  factors: string[];
  evidence: Evidence[];
};

export type AnalysisResult = {
  runId: string;
  profile: RiskProfile;
  degraded: boolean;
  classification: 'POSITIVE' | 'NEUTRAL' | 'CAUTIOUS';
  evidenceStrength: 'Strong' | 'Moderate';
  summary: string;
  latencyMs: number;
  citationCoverage: number;
  sourceCoverage: number;
  agents: AgentOutput[];
  timestamp: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function runMarketAgent(): Promise<AgentOutput> {
  const started = performance.now();
  await wait(460);
  return {
    id: 'market', name: 'Market pulse agent', state: 'complete',
    latencyMs: Math.round(performance.now() - started), signal: 'positive', confidence: 0.82,
    summary: 'Broad momentum is positive, led by INFY; DIXON volume is unusually high.',
    factors: ['INFY price momentum +2.84%', 'DIXON volume at 1.8× its 20-day baseline', 'RELIANCE momentum remains weak'],
    evidence: [
      { label: 'Normalized LTPC feed', source: 'Upstox Market Data V3 · demo adapter', detail: 'Price, OHLC and volume for four holdings', observedAt: '8 seconds ago' },
      { label: 'Secondary quote check', source: 'Angel One SmartAPI · standby adapter', detail: 'Price variance within 0.04%', observedAt: '12 seconds ago' },
    ],
  };
}

async function runResearchAgent(degraded: boolean): Promise<AgentOutput> {
  const started = performance.now();
  await wait(610);
  return {
    id: 'research', name: 'Filings & news agent', state: degraded ? 'degraded' : 'complete',
    latencyMs: Math.round(performance.now() - started), signal: degraded ? 'neutral' : 'positive', confidence: degraded ? 0.51 : 0.88,
    summary: degraded ? 'Latest filing is unavailable; unsupported earnings claims were excluded.' : 'Official results support the margin-improvement thesis; news is consistent with the filing.',
    factors: degraded ? ['Two official sources retrieved', 'Latest quarterly attachment unavailable', 'News-only claims blocked from synthesis'] : ['Operating margin improved 90 bps', 'Management guidance remained stable', 'No contradictory material announcement'],
    evidence: degraded ? [
      { label: 'Corporate announcement index', source: 'NSE · simulated official source', detail: 'Metadata retrieved; attachment timed out', observedAt: '2 minutes ago' },
    ] : [
      { label: 'Q4 FY26 results', source: 'NSE · simulated official filing', detail: 'Operating margin and revenue commentary · page 12', observedAt: 'Filed 28 Aug 2026' },
      { label: 'Structured filing copy', source: 'FinancialFilings · demo adapter', detail: 'Document hash matched the NSE record', observedAt: 'Synced 1 minute ago' },
    ],
  };
}

async function runRiskAgent(profile: RiskProfile): Promise<AgentOutput> {
  const started = performance.now();
  await wait(520);
  const conservative = profile === 'conservative';
  return {
    id: 'risk', name: 'Portfolio risk agent', state: 'complete',
    latencyMs: Math.round(performance.now() - started), signal: conservative ? 'cautious' : 'neutral', confidence: 0.91,
    summary: conservative ? 'IT exposure exceeds this profile’s preferred concentration range.' : 'IT exposure is elevated but remains within the growth profile’s accepted range.',
    factors: ['IT sector exposure 42%', `Profile limit ${conservative ? '30%' : '50%'}`, 'Largest single-name weight 24.4%'],
    evidence: [
      { label: 'Portfolio snapshot', source: 'FillEx portfolio store', detail: '8 holdings · ₹4,82,420 market value', observedAt: 'Updated 8 seconds ago' },
      { label: 'Risk parameters', source: `Stored ${profile} profile`, detail: conservative ? 'Lower drawdown tolerance · 30% sector cap' : 'Higher volatility tolerance · 50% sector cap', observedAt: 'Profile v3' },
    ],
  };
}

export async function runFillExAnalysis(profile: RiskProfile, degraded: boolean): Promise<AnalysisResult> {
  const started = performance.now();
  const agents = await Promise.all([
    runMarketAgent(),
    runResearchAgent(degraded),
    runRiskAgent(profile),
  ]);
  await wait(170);
  const classification = degraded ? 'CAUTIOUS' : profile === 'growth' ? 'POSITIVE' : 'NEUTRAL';
  const summary = degraded
    ? 'Market momentum is positive, but the latest official filing is unavailable. FillEx has withheld the unsupported earnings conclusion and recommends waiting for source recovery.'
    : profile === 'growth'
      ? 'Earnings and volume signals support selective growth exposure. INFY leads today, while RELIANCE remains the main drag to monitor.'
      : 'Earnings momentum is supportive, but your 42% IT concentration increases downside sensitivity. Hold exposure steady and watch the next sector move.';

  return {
    runId: `FX-${Date.now().toString(36).toUpperCase()}`,
    profile,
    degraded,
    classification,
    evidenceStrength: degraded ? 'Moderate' : 'Strong',
    summary,
    latencyMs: Math.round(performance.now() - started),
    citationCoverage: 100,
    sourceCoverage: degraded ? 67 : 94,
    agents,
    timestamp: new Date().toISOString(),
  };
}
