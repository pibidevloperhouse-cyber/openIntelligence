'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroEventCard from '@/components/HeroEventCard';
import Link from 'next/link';

export default function MeetingsClient({ upcoming, past }) {
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabQuery === 'past' ? 'past' : 'upcoming');
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  useEffect(() => {
    if (tabQuery === 'past' || tabQuery === 'upcoming') {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-tabs {
            justify-content: center;
          }
        }
        .desktop-tabs {
          display: flex;
        }
      `}</style>

      {/* ── Tabs Container ── */}
      <div className="desktop-tabs" style={{
        gap: '1rem',
        marginBottom: '2.5rem',
        position: 'sticky',
        top: '68px',
        zIndex: 90,
        background: '#ffffff',
        padding: '0.75rem 0',
        borderBottom: '1px solid #E7E5E4'
      }}>
        {/* Upcoming Sessions Tab */}
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '0.65rem 1.25rem',
            background: activeTab === 'upcoming'
              ? 'linear-gradient(135deg, #1f6fb2, #2ec4b6)'
              : '#F5F5F4',
            border: 'none',
            borderRadius: '10px',
            color: activeTab === 'upcoming' ? '#ffffff' : '#57534E',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'upcoming' ? '0 4px 14px rgba(31, 111, 178, 0.25)' : 'none'
          }}>
          Upcoming Sessions
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            background: activeTab === 'upcoming' ? 'rgba(255, 255, 255, 0.25)' : '#E7E5E4',
            fontSize: '0.75rem',
            color: activeTab === 'upcoming' ? '#ffffff' : '#57534E',
            fontWeight: 700
          }}>
            {upcoming.length}
          </span>
        </button>

        {/* Past Sessions Tab */}
        <button
          onClick={() => setActiveTab('past')}
          style={{
            padding: '0.65rem 1.25rem',
            background: activeTab === 'past'
              ? 'linear-gradient(135deg, #1f6fb2, #2ec4b6)'
              : '#F5F5F4',
            border: 'none',
            borderRadius: '10px',
            color: activeTab === 'past' ? '#ffffff' : '#57534E',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'past' ? '0 4px 14px rgba(31, 111, 178, 0.25)' : 'none'
          }}>
          Past Sessions
          <span style={{
            padding: '2px 8px',
            borderRadius: '12px',
            background: activeTab === 'past' ? 'rgba(255, 255, 255, 0.25)' : '#E7E5E4',
            fontSize: '0.75rem',
            color: activeTab === 'past' ? '#ffffff' : '#57534E',
            fontWeight: 700
          }}>
            {past.length}
          </span>
        </button>
      </div>

      <div style={{ minHeight: '400px' }}>
        {activeTab === 'upcoming' && (
          <section>
            {upcoming.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', maxWidth: '950px', margin: '0 auto', display: 'grid', gap: '1.75rem', gridTemplateColumns: '1fr' }}>
                  {(showAllUpcoming ? upcoming : upcoming.slice(0, 2)).map((m, idx) => <HeroEventCard key={m.id} meeting={m} isPast={false} weekNumber={past.length + 1 + idx} />)}
                </div>
                {upcoming.length > 2 && !showAllUpcoming && (
                  <div style={{ width: '100%', maxWidth: '950px', marginTop: '1.75rem' }}>
                    <div
                      onClick={() => setShowAllUpcoming(true)}
                      className="hero-single-card upcoming-card"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', cursor: 'pointer', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '2px dashed #cbd5e1', width: '100%', minHeight: '180px', transition: 'all 0.2s ease', borderRadius: '20px' }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc, #f1f5f9)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    >
                      <div style={{ background: '#e2e8f0', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <svg width="20" height="20" fill="none" stroke="#334155" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-display)', textAlign: 'center' }}>Show {upcoming.length - 2} More Upcoming Events</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: 500 }}>Click to expand the schedule</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                padding: '3.5rem 2rem',
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E7E5E4',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗓️</div>
                <p style={{ color: '#57534E', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  No upcoming sessions scheduled yet. Check back soon!
                </p>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(31, 111, 178, 0.2)'
                  }}>
                    ← Back to Home
                  </button>
                </Link>
              </div>
            )}
          </section>
        )}

        {activeTab === 'past' && (
          <section>
            {past.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {past.map((m, idx) => <HeroEventCard key={m.id} meeting={m} isPast={true} weekNumber={past.length - idx} />)}
              </div>
            ) : (
              <div style={{
                padding: '3rem',
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E7E5E4'
              }}>
                <p style={{ color: '#57534E', fontSize: '0.95rem' }}>No past sessions found.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}