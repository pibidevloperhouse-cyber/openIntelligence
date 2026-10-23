import React, { Suspense } from 'react';
import CollectBadgeClient from './CollectBadgeClient';

export const metadata = {
  title: 'Collect Your Builder Badge | PiBi Open Intelligence',
  description: 'Enter your 4-digit security PIN to collect and download your official Open Intelligence Builder Badge.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CollectBadgePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070e1e] flex items-center justify-center text-white">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
            <span className="w-5 h-5 border-2 border-[#2ec4b6] border-t-transparent rounded-full animate-spin" />
            <span>Loading badge claim system...</span>
          </div>
        </div>
      }
    >
      <CollectBadgeClient />
    </Suspense>
  );
}
