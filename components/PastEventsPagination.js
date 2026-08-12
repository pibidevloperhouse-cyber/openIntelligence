'use client';

import React from 'react';
import Link from 'next/link';

export default function PastEventsPagination({ pastMeetings, totalCount = 37 }) {
  if (!pastMeetings || pastMeetings.length === 0) return null;

  return (
    <div style={{ width: '100%', padding: '0 1rem' }}>
      <style>{`
        .past-events-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
        }
        .past-event-item {
          border-radius: 16px;
          overflow: hidden;
          background: #1e2532;
          color: white;
          display: flex;
          flex-direction: row;
          width: 100%;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .past-event-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px -4px rgba(0, 0, 0, 0.15);
        }
        .past-event-img-wrap {
          position: relative;
          flex: 0 0 35%;
          aspect-ratio: 4/5;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #ffffff;
        }
        @media (max-width: 768px) {
          .past-events-grid {
            grid-template-columns: 1fr;
          }
          .past-event-item {
            flex-direction: column;
          }
          .past-event-img-wrap {
            flex: none;
            width: 100%;
            /* Removed aspect-ratio: 16/9 to keep the tall 4/5 ratio on mobile */
          }
        }
      `}</style>
      <div className="past-events-grid">
        {pastMeetings.slice(0, 4).map((meeting, i) => {
          // Format full date and time
          let fullDateStr = 'PAST EVENT';
          let timeStr = '4:00 PM - 6:00 PM';
          if (meeting.date) {
            const d = new Date(meeting.date);
            const dDay = String(d.getDate()).padStart(2, '0');
            const dMonth = String(d.getMonth() + 1).padStart(2, '0');
            const dYear = d.getFullYear();
            fullDateStr = `${dDay}-${dMonth}-${dYear}`;
          }

          // Get a cover image or fallback
          const coverPhoto = meeting.cover_image || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

          // Get a short description
          let desc = meeting.description || 'Join us for this insightful community session and learn from industry experts.';
          // Strip "Timing: ..." if present
          desc = desc.replace(/\n\nTiming:\s*(.*)/, '');

          // Get tags
          const tags = (meeting.tags && meeting.tags.length > 0)
            ? meeting.tags.slice(0, 4)
            : ['AI', 'COMMUNITY', 'LEARNING', 'NETWORKING'];

          return (
            <div key={i} className="past-event-item">

              {/* Image Section */}
              <div className="past-event-img-wrap" style={{ backgroundImage: `url(${coverPhoto})` }}>
              </div>

              {/* Content Section */}
              {/* Content Section */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 65%', background: '#ffffff', minWidth: 0 }}>

                {/* Highlighted Top Bar (Badges + Arrow) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 24px',
                  background: '#f1f5f9', // more visible light gray/slate highlight
                  borderBottom: '1px solid #e2e8f0' // stronger border for clear separation
                }}>
                  {/* Badges Container */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Week Badge */}
                    <span style={{
                      padding: '6px 14px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
                      color: '#ffffff',
                      borderRadius: '30px',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}>
                      WEEK {totalCount - i}
                    </span>

                    {/* Completed Badge */}
                    <div style={{
                      background: 'rgba(167, 243, 208, 0.9)', // emerald-200
                      borderRadius: '30px',
                      padding: '4px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }}></div>
                      <span style={{ color: '#059669', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                      e.currentTarget.style.color = '#f59e0b';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translate(0, 0)';
                      e.currentTarget.style.color = '#94a3b8';
                    }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </Link>
                </div>

                {/* Main Content Area */}
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  {/* Title */}
                  <Link href={`/meetings/${meeting.id || ''}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display), serif',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#000000',
                      margin: '0 0 12px 0',
                      lineHeight: 1.3,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'color 0.2s ease'
                    }}
                      onMouseOver={(e) => e.currentTarget.style.color = '#1f6fb2'}
                      onMouseOut={(e) => e.currentTarget.style.color = '#000000'}
                    >
                      {meeting.title}
                    </h3>
                  </Link>

                  {/* Date, Time, Location and Speaker */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                    {/* Date and Time */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#d97706', fontSize: '0.8rem', fontWeight: 600 }}>
                      <svg width="14" height="14" style={{ marginTop: '2px', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span style={{ lineHeight: 1.4 }}>{fullDateStr} • {timeStr} • 2 Hours</span>
                    </div>

                    {/* Location (Full Address) */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#000000', fontSize: '0.8rem', fontWeight: 600 }}>
                      <svg width="14" height="14" style={{ marginTop: '2px', flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <span style={{ lineHeight: 1.4 }}>{meeting.venue || 'Online Event'}</span>
                    </div>

                    {/* Speaker */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000', fontSize: '0.8rem', fontWeight: 600 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      <span>Speaker: {meeting.speaker || 'Nagaraj'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show All Past Events Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px', paddingBottom: '20px' }}>
        <Link href="/meetings?tab=past" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 32px',
          background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
          color: '#ffffff',
          borderRadius: '30px',
          fontSize: '0.95rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textDecoration: 'none',
          boxShadow: '0 8px 25px -8px rgba(31, 111, 178, 0.5)',
          transition: 'all 0.3s ease'
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(31, 111, 178, 0.7)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px -8px rgba(31, 111, 178, 0.5)';
          }}>
          Show All Past Events
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
}
