import React from 'react';
import Link from 'next/link';

export default function WideMeetingCard({ meeting }) {
  const {
    title, description, date, venue, photos
  } = meeting;

  const meetingDate = new Date(date);
  const day = meetingDate.toLocaleDateString('en-IN', { day: '2-digit' });
  const month = meetingDate.toLocaleDateString('en-IN', { month: 'short' });
  const year = meetingDate.getFullYear();
  const timeStr = meetingDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  let finalDescription = description || '';
  let displayTime = timeStr;
  
  const timingMatch = finalDescription.match(/\n\nTiming:\s*(.*)/);
  if (timingMatch) {
    displayTime = timingMatch[1];
    finalDescription = finalDescription.replace(timingMatch[0], '');
  }

  // Use the first photo if available, otherwise a placeholder
  const imageSrc = (photos && photos.length > 0) 
    ? photos[0] 
    : 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

  return (
    <article className="past-event-card">
      <div className="past-event-img-container">
        <img src={imageSrc} alt={title} className="past-event-img" />
        
        {/* Optional overlay badge for date */}
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          background: 'rgba(15, 22, 35, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '0.5rem',
          textAlign: 'center',
          minWidth: '60px'
        }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1, fontFamily: 'var(--font-display)' }}>
            {day}
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
            {month}
          </div>
        </div>
      </div>
      
      <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '300px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '0.15rem 0.55rem', borderRadius: '20px',
            fontSize: '0.68rem', fontWeight: 600,
            background: 'rgba(16,185,129,0.1)',
            color: '#34d399',
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            ✅ Completed
          </span>
        </div>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
          {title}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {finalDescription}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: 'auto', paddingTop: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {displayTime}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {venue}
          </span>
        </div>
      </div>
    </article>
  );
}
