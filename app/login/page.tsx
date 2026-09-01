import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthScreen } from '@/components/fillex/auth-screen';
import { getSiteUser } from '@/lib/server/site-user';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign in — FillEx',
  description:
    'Sign in securely to connect your broker and access your FillEx portfolio workspace.',
};

export default async function LoginPage() {
  if (await getSiteUser()) redirect('/brokers');
  return <AuthScreen mode="login" />;
}
