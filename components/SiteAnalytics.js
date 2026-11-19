'use client';

import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function SiteAnalytics({ gaId }) {
  const pathname = usePathname();
  return pathname?.startsWith('/vote/') ? null : <GoogleAnalytics gaId={gaId} />;
}
