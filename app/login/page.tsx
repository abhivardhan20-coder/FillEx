import type { Metadata } from 'next';

import { AuthScreen } from '@/components/fillex/auth-screen';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign in — FillEx',
  description:
    'Sign in securely to connect your broker and access your FillEx portfolio workspace.',
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
