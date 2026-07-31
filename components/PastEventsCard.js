'use client';

import React from 'react';
import Link from 'next/link';

export default function PastEventsCard({ pastMeetings, totalCount = 37 }) {
  if (!pastMeetings || pastMeetings.length === 0) return null;

  return (
    <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem', background: '#f8fafc', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#0f172a', marginBottom: '0.5rem' }}>
              Past Sessions
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', margin: 0 }}>
              Catch up on what you missed in our previous meetups
            </p>
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
            gap: '1.5rem',
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto'
          }}>
            {pastMeetings.slice(0, 4).map((meeting, i) => {
              // Format full date and time
              let fullDateStr = 'PAST EVENT';
              let timeStr = '';
              if (meeting.date) {
                const d = new Date(meeting.date);
                fullDateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
              }

              // Get a cover image or fallback
              const coverPhoto = meeting.cover_image || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

              return (
                <div key={i} className="pec-card" style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  minHeight: '220px' // Ensures consistent height
                }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(0, 0, 0, 0.05)';
                  }}>

                  {/* Image Section */}
                  <div className="pec-image" style={{
                    position: 'relative',
                    flex: '0 0 38%',
                    backgroundImage: `url(${coverPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#111827',
                    borderRight: '1px solid #e2e8f0'
                  }}>
                  </div>

                  {/* Content Section */}
                  <div className="pec-content" style={{ display: 'flex', flexDirection: 'column', flex: '1 1 62%', padding: '1.25rem 1.5rem', minWidth: 0 }}>

                    {/* Top Bar (Badges + Arrow) */}
                    <div className="pec-topbar" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      {/* Badges Container */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Week Badge */}
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: '#3b82f6', // solid blue like screenshot
                          color: '#ffffff',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          WEEK {totalCount - i}
                        </span>

                        {/* Completed Badge */}
                        <div style={{
                          background: '#dcfce7', // light green
                          borderRadius: '20px',
                          padding: '0.25rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#16a34a' }}></div>
                          <span style={{ color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Completed
                          </span>
                        </div>
                      </div>

                      {/* Arrow Link */}
                      <Link href={`/meetings/${meeting.id || ''}`} style={{
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease, color 0.2s ease',
                      }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translate(2px, -2px)';
                          e.currentTarget.style.color = '#3b82f6';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translate(0, 0)';
                          e.currentTarget.style.color = '#94a3b8';
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </Link>
                    </div>

                    {/* Title */}
                    <Link href={`/meetings/${meeting.id || ''}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-display), serif',
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '0 0 1rem 0',
                        lineHeight: 1.35,
                        textTransform: 'uppercase',
                        transition: 'color 0.2s ease',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#3b82f6'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#0f172a'}
                      >
                        {meeting.title}
                      </h3>
                    </Link>

                    {/* Date, Time, Location and Speaker */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: 'auto' }}>
                      {/* Date and Time */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569', fontSize: '0.95rem', fontWeight: 600 }}>
                        <svg width="16" height="16" style={{ flexShrink: 0, color: '#d97706' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span style={{ lineHeight: 1.4 }}>{fullDateStr} • {timeStr}</span>
                      </div>

                      {/* Location */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569', fontSize: '0.95rem', fontWeight: 600 }}>
                        <svg width="16" height="16" style={{ flexShrink: 0, color: '#64748b' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span style={{ lineHeight: 1.4 }}>{meeting.venue || 'Madurai'}</span>
                      </div>

                      {/* Speaker */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
                        <svg width="16" height="16" style={{ flexShrink: 0, color: '#64748b' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span>Speaker: {meeting.speaker || 'Nagaraj'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show All Past Events Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <Link href="/meetings?tab=past" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0.75rem 1.75rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              borderRadius: '30px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}>
              View All Past Sessions →
            </Link>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Mobile and Tablet Stacked Responsive */
        @media (max-width: 850px) {
          .pec-card {
            flex-direction: column !important;
          }
          .pec-image {
            flex: none !important;
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16/9 !important; /* Widescreen aspect ratio fits nicely on mobile */
            background-position: top center !important;
            border-right: none !important;
            border-bottom: 1px solid #e2e8f0 !important;
          }
          .pec-content {
            flex: none !important;
            width: 100% !important;
            padding: 1.25rem 1.25rem !important;
          }
        }
      `}} />
    </section>
  );
}
