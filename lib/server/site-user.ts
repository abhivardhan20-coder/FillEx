import { headers } from 'next/headers';

export type SiteUser = { id: string; email: string | null };

export async function getSiteUser(): Promise<SiteUser | null> {
  const requestHeaders = await headers();
  const id = requestHeaders.get('oai-authenticated-user-id');
  if (!id) return null;
  return { id, email: requestHeaders.get('oai-authenticated-user-email') };
}
