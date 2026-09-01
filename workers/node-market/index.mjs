import { createServer } from 'node:http';
import { NSE, BSE } from 'nse-bse-api';

const port = Number(process.env.PORT || 8788);
const host = process.env.HOST || '127.0.0.1';

function respond(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
  response.end(JSON.stringify(body));
}

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`);
  if (url.pathname === '/health') return respond(response, 200, { ok: true, worker: 'fillex-node-market' });
  if (url.pathname !== '/quote' || request.method !== 'GET') return respond(response, 404, { error: 'Not found' });

  const exchange = (url.searchParams.get('exchange') || '').toUpperCase();
  const symbol = (url.searchParams.get('symbol') || '').trim().toUpperCase();
  if (!['NSE', 'BSE'].includes(exchange) || !symbol) return respond(response, 400, { error: 'Use exchange=NSE|BSE and a symbol or BSE scrip code.' });

  try {
    if (exchange === 'NSE') {
      const nse = new NSE();
      try { return respond(response, 200, { exchange, symbol, data: await nse.equityQuote(symbol), source: 'nse-bse-api' }); }
      finally { await nse.exit(); }
    }
    const bse = new BSE();
    try {
      const scripCode = /^\d+$/.test(symbol) ? symbol : (await bse.lookupSymbol(symbol))?.scripCode;
      if (!scripCode) return respond(response, 404, { error: 'BSE scrip code not found.' });
      return respond(response, 200, { exchange, symbol, scripCode, data: await bse.quote(String(scripCode)), source: 'nse-bse-api' });
    } finally { await bse.close(); }
  } catch (error) { return respond(response, 502, { error: error instanceof Error ? error.message : 'Exchange request failed.' }); }
}).listen(port, host, () => console.log(`FillEx Node market worker listening on http://${host}:${port}`));
