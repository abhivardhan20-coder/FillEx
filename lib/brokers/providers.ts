export const brokerIds = ['groww', 'upstox', 'angelone', 'zerodha'] as const;
export type BrokerId = (typeof brokerIds)[number];

export type BrokerProvider = {
  id: BrokerId;
  name: string;
  shortName: string;
  logoPath: string;
  description: string;
  authLabel: string;
  connectionMode: 'redirect' | 'access-token';
  requiredEnvironment: string[];
  holdings: true;
  positions: true;
};

export const brokerProviders: BrokerProvider[] = [
  {
    id: 'groww',
    name: 'Groww',
    shortName: 'GW',
    logoPath: '/brokers/groww.png',
    description:
      'Import Groww holdings and positions with an official user-generated access token.',
    authLabel: 'Groww access token',
    connectionMode: 'access-token',
    requiredEnvironment: [
      'BROKER_TOKEN_ENCRYPTION_KEY',
      'INGESTION_WORKER_SECRET',
    ],
    holdings: true,
    positions: true,
  },
  {
    id: 'upstox',
    name: 'Upstox',
    shortName: 'UP',
    logoPath: '/brokers/upstox.png',
    description: 'Use Upstox OAuth to import long-term holdings and positions.',
    authLabel: 'Official OAuth',
    connectionMode: 'redirect',
    requiredEnvironment: [
      'UPSTOX_API_KEY',
      'UPSTOX_API_SECRET',
      'UPSTOX_REDIRECT_URI',
      'BROKER_TOKEN_ENCRYPTION_KEY',
      'INGESTION_WORKER_SECRET',
    ],
    holdings: true,
    positions: true,
  },
  {
    id: 'angelone',
    name: 'Angel One',
    shortName: 'AO',
    logoPath: '/brokers/angelone.png',
    description: 'Connect through SmartAPI to retrieve holdings and positions.',
    authLabel: 'SmartAPI authorization',
    connectionMode: 'redirect',
    requiredEnvironment: [
      'ANGELONE_API_KEY',
      'ANGELONE_REDIRECT_URI',
      'ANGELONE_CLIENT_LOCAL_IP',
      'ANGELONE_CLIENT_PUBLIC_IP',
      'ANGELONE_MAC_ADDRESS',
      'BROKER_TOKEN_ENCRYPTION_KEY',
      'INGESTION_WORKER_SECRET',
    ],
    holdings: true,
    positions: true,
  },
  {
    id: 'zerodha',
    name: 'Zerodha',
    shortName: 'ZE',
    logoPath: '/brokers/zerodha.png',
    description: 'Use the Kite Connect login flow for holdings and positions.',
    authLabel: 'Kite Connect OAuth',
    connectionMode: 'redirect',
    requiredEnvironment: [
      'ZERODHA_API_KEY',
      'ZERODHA_API_SECRET',
      'ZERODHA_REDIRECT_URI',
      'BROKER_TOKEN_ENCRYPTION_KEY',
      'INGESTION_WORKER_SECRET',
    ],
    holdings: true,
    positions: true,
  },
];

export function brokerReadiness() {
  return brokerProviders.map((provider) => ({
    ...provider,
    configured: provider.requiredEnvironment.every((key) =>
      Boolean(process.env[key]?.trim()),
    ),
    accessTokenConfigured:
      provider.id === 'groww' &&
      Boolean(
        process.env.GROWW_ACCESS_TOKEN?.trim() ||
        (process.env.GROWW_API_KEY?.trim() &&
          process.env.GROWW_API_SECRET?.trim()),
      ),
  }));
}
