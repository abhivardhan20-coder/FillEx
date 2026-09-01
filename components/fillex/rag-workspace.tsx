'use client';

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileSearch,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const suggestedQuestions = [
  'Why did DEMOCO trigger a concentration alert?',
  'What evidence would support a filing-driven risk alert?',
  'Which source should win when market stories disagree?',
];

const pipeline = [
  {
    title: 'Query planner',
    detail: 'Breaks the question into portfolio, filing, and news searches.',
    icon: Network,
  },
  {
    title: 'Hybrid retriever',
    detail: 'Combines structured filters with semantic document retrieval.',
    icon: Database,
  },
  {
    title: 'Evidence ranker',
    detail: 'Prioritizes broker and official-source evidence over commentary.',
    icon: FileSearch,
  },
  {
    title: 'Portfolio reasoner',
    detail: 'Explains the retrieved facts against the selected risk policy.',
    icon: BrainCircuit,
  },
  {
    title: 'Citation guard',
    detail:
      'Blocks unsupported claims and attaches a source to each conclusion.',
    icon: ShieldCheck,
  },
];

const evidence = [
  {
    id: 'E1',
    source: 'Portfolio snapshot',
    label: 'Illustrative record',
    excerpt:
      'DEMOCO represents 34.2% of the sample cost basis; the balanced threshold is 30%.',
    score: '0.96',
    tone: 'bg-violet-100 text-violet-800',
  },
  {
    id: 'E2',
    source: 'NSE filing adapter',
    label: 'Mock retrieval',
    excerpt:
      'No connected filing supports a new company-specific risk conclusion in this demo.',
    score: '0.91',
    tone: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'E3',
    source: 'Verified news adapter',
    label: 'Mock retrieval',
    excerpt:
      'A context document was retrieved, but it is ranked below portfolio and official evidence.',
    score: '0.74',
    tone: 'bg-amber-100 text-amber-900',
  },
];

export function RagWorkspace() {
  const [question, setQuestion] = useState(suggestedQuestions[0]);
  const [submittedQuestion, setSubmittedQuestion] = useState(
    suggestedQuestions[0],
  );
  const [runCount, setRunCount] = useState(1);

  function runDemo(event?: SyntheticEvent<HTMLFormElement>) {
    event?.preventDefault();
    const nextQuestion = question.trim();
    if (!nextQuestion) return;
    setSubmittedQuestion(nextQuestion);
    setRunCount((count) => count + 1);
  }

  function chooseQuestion(value: string) {
    setQuestion(value);
    setSubmittedQuestion(value);
    setRunCount((count) => count + 1);
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-violet-200 bg-[linear-gradient(135deg,#17152f_0%,#27205a_54%,#5b21b6_100%)] text-white shadow-xl shadow-violet-950/10">
        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)] lg:p-9">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
              <Sparkles className="size-3.5" /> Interactive prototype
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-.035em] sm:text-4xl">
              Ask the portfolio. Inspect every retrieved fact.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100/80">
              This mock demonstrates FillEx&apos;s planned retrieval-augmented
              reasoning loop without sending data to an LLM or presenting demo
              output as live market intelligence.
            </p>
            <form
              onSubmit={runDemo}
              className="mt-7 flex flex-col gap-2 sm:flex-row"
            >
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                aria-label="RAG demo question"
                placeholder="Ask an evidence-grounded portfolio question"
                className="h-11 border-white/15 bg-white text-slate-950 sm:flex-1"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 bg-violet-300 px-4 text-violet-950 hover:bg-violet-200"
              >
                <Search /> Run demo
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[.07] p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-violet-200">
              Prototype guarantees
            </p>
            <ul className="mt-4 space-y-3 text-sm text-violet-50">
              {[
                'Every conclusion points to retrieved evidence',
                'Official sources outrank secondary context',
                'Missing evidence remains visibly missing',
                'Demo records are clearly separated from live data',
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {suggestedQuestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => chooseQuestion(suggestion)}
            className="rounded-full border bg-card px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-900"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,.75fr)]">
        <Card className="border-violet-200">
          <CardHeader className="border-b bg-violet-50/70">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Grounded answer preview</CardTitle>
                <CardDescription className="mt-1">
                  Demo run {runCount} · no live model call
                </CardDescription>
              </div>
              <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                Prototype
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl border bg-muted/35 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
                Question
              </p>
              <p className="mt-2 font-semibold">{submittedQuestion}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BrainCircuit className="size-4 text-violet-700" /> FillEx RAG
              </div>
              <p className="mt-3 text-sm leading-7 text-foreground">
                The prototype flags a concentration issue because the sample
                DEMOCO position is 34.2% of cost basis, above the 30% balanced
                threshold <strong>[E1]</strong>. It does not infer a new
                company-specific risk because no connected official filing
                supports that conclusion <strong>[E2]</strong>. The retrieved
                news item is retained only as lower-priority context{' '}
                <strong>[E3]</strong>.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                <p>
                  <strong>Citation guard:</strong> 3 claims checked · 3 claims
                  grounded · 0 unsupported claims emitted.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reasoning trace</CardTitle>
            <CardDescription>
              A visible multi-agent path designed for auditability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-1">
              {pipeline.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.title}
                    className="relative flex gap-3 pb-4 last:pb-0"
                  >
                    {index < pipeline.length - 1 && (
                      <span className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-violet-200" />
                    )}
                    <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700">
                      <Icon className="size-3.5" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">{step.title}</p>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                          Simulated
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Retrieved evidence</CardTitle>
            <CardDescription>
              Illustrative records used only to demonstrate ranking and
              citations.
            </CardDescription>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Hybrid retrieval · top 3
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-3">
            {evidence.map((item) => (
              <article key={item.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-md px-2 py-1 text-[10px] font-bold ${item.tone}`}
                  >
                    {item.id}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    score {item.score}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{item.source}</h3>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                  {item.label}
                </p>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {item.excerpt}
                </p>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-xl border border-dashed p-4 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong className="text-foreground">Production path:</strong> connect
          holdings, filings, and licensed news; index normalized evidence; then
          enable model inference behind the citation guard.
        </p>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-violet-700">
          Mock today <ArrowRight className="size-3.5" /> RAG-ready architecture
        </span>
      </div>
    </div>
  );
}
