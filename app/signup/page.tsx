import type { Metadata } from 'next';

import { AuthScreen } from '@/components/fillex/auth-screen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create account — FillEx',
  description:
    'Create a secure FillEx account and choose the broker you want to connect.',
};

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
