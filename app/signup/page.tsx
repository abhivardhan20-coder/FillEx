import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthScreen } from '@/components/fillex/auth-screen';
import { getSiteUser } from '@/lib/server/site-user';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create account — FillEx',
  description:
    'Create a secure FillEx account and choose the broker you want to connect.',
};

export default async function SignupPage() {
  if (await getSiteUser()) redirect('/brokers');
  return <AuthScreen mode="signup" />;
}
