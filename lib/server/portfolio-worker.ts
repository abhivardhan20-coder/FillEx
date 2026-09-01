import { waitUntil } from 'cloudflare:workers';

export function kickPortfolioWorker(origin: string, limit = 1) {
  const secret = process.env.INGESTION_WORKER_SECRET;
  if (!secret) return;
  const endpoint = new URL(`/api/jobs/portfolio-sync?limit=${Math.max(1, Math.min(limit, 5))}`, origin);
  waitUntil(fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}` },
  }).then(() => undefined).catch(() => undefined));
}
