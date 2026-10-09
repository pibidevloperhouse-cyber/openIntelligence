import { Suspense } from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingsClient from './MeetingsClient';
import FeaturesCarousel from './FeaturesCarousel';

export const metadata = {
  title: 'Community Sessions — Open Intelligence Hub',
  description: 'Upcoming and past Madurai AI Community sessions by PiBi Foundation.',
};

export const revalidate = 60; // Refresh cache every 60 seconds on Vercel

async function getMeetings() {
  try {
    const [upcomingRes, pastRes] = await Promise.all([
      supabaseAdmin
        .from('meetings')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true }),
      supabaseAdmin
        .from('meetings')
        .select('*')
        .lt('date', new Date().toISOString())
        .order('date', { ascending: false }),
    ]);
    return {
      upcoming: (upcomingRes.data || []).map(m => ({ ...m, date: m.date.endsWith('Z') ? m.date : m.date + 'Z' })),
      past: (pastRes.data || []).map(m => ({ ...m, date: m.date.endsWith('Z') ? m.date : m.date + 'Z' }))
    };
  } catch {
    return { upcoming: [], past: [] };
  }
}

export default async function MeetingsPage() {
  const { upcoming, past } = await getMeetings();

  return (
    <div className="animate-fade-up" style={{ minHeight: '100vh', paddingTop: '5rem', paddingBottom: '4rem', backgroundColor: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* ── Page Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 900, fontFamily: 'var(--font-display)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Community Sessions
          </h1>
          <p style={{ color: '#57534E', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
            Join us every week for hands-on AI learning. 52+ weeks of consistent community building by PiBi Foundation.
          </p>
        </div>

        {/* ── Features Grid ── */}
          <FeaturesCarousel />

        {/* ── Sessions Tabs ── */}
        <div id="sessions-tabs">
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#78716C', padding: '2rem' }}>Loading sessions...</div>}>
            <MeetingsClient upcoming={upcoming} past={past} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}