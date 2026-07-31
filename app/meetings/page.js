import { Suspense } from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import MeetingsClient from './MeetingsClient';

export const metadata = {
  title: 'Community Sessions — Open Intelligence Hub',
  description: 'Upcoming and past Madurai AI Community sessions by PiBi Foundation.',
};

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
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '1.25rem', padding: '0.4rem 1.25rem', borderRadius: '24px',
            background: '#ffffff', border: '1px solid #E7E5E4',
            color: '#1f6fb2', fontSize: '0.85rem', fontWeight: 700,
            boxShadow: '0 4px 12px rgba(31, 111, 178, 0.08)'
          }}>
            📅 Madurai AI Community
          </div>
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

        {/* ── Stats Strip Box ── */}
        <div style={{
          marginBottom: '3.5rem',
          padding: '2rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '2rem',
          textAlign: 'center',
          background: '#ffffff',
          border: '1px solid #E7E5E4',
          borderRadius: '16px',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)'
        }}>
          {[
            { label: 'Upcoming', value: upcoming.length || '0', color: '#1f6fb2' },
            { label: 'Past Sessions', value: past.length || '0', color: '#2ec4b6' },
            { label: 'Weeks of AI', value: '52+', color: '#0284c7' },
            { label: 'Location', value: 'Madurai', color: '#0d9488' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: '1 1 120px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color, fontFamily: 'var(--font-display)', marginBottom: '0.2rem' }}>{value}</div>
              <div style={{ color: '#78716C', fontSize: '0.85rem', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Sessions Tabs ── */}
        <Suspense fallback={<div style={{ textAlign: 'center', color: '#78716C', padding: '2rem' }}>Loading sessions...</div>}>
          <MeetingsClient upcoming={upcoming} past={past} />
        </Suspense>
      </div>
    </div>
  );
}