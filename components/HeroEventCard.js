'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import EventRegistrationModal from './EventRegistrationModal';

function formatTimeNormal(timeStr) {
  if (!timeStr) return '';
  return timeStr.replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, (match, h, m) => {
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  });
}

export default function HeroEventCard({ meeting, isPast = false, weekNumber }) {
  const {
    title,
    description,
    date,
    venue,
    location,
    registration_link,
    photos,
    cover_image,
    outcome_title,
    outcome_summary,
    attendees_count,
    duration,
    eyebrow,
    entry_fee,
  } = meeting;

  const coverPhoto = cover_image || null;

  const meetingDate = new Date(date);
  const dayStr = meetingDate.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' });
  const rawTimeStr = meetingDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  let finalDescription = description;
  let displayTime = rawTimeStr;

  if (meeting.start_time || meeting.end_time) {
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
      const [h, min] = timeStr.split(':');
      let hours = parseInt(h, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${min} ${ampm}`;
    };
    const start = formatTime(meeting.start_time);
    const end = formatTime(meeting.end_time);
    if (start && end) {
      displayTime = `${start} to ${end}`;
    } else if (start) {
      displayTime = start;
    }
  }

  // Fallback for old events that had timing embedded in description
  if (finalDescription) {
    const timingMatch = finalDescription.match(/\n\nTiming:\s*(.*)/);
    if (timingMatch) {
      if (!meeting.start_time && !meeting.end_time) {
        displayTime = timingMatch[1];
        displayTime = formatTimeNormal(displayTime);
      }
      finalDescription = finalDescription.replace(timingMatch[0], '');
    }
  }

  const mMonth = meetingDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const mDay = meetingDate.getDate();
  const shortDateStr = `${meetingDate.toLocaleDateString('en-US', { month: 'short' })} ${mDay}, ${meetingDate.getFullYear()}`;
  const fullDateStr = meetingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const shortWeekdayDateStr = meetingDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  
  const dDay = String(meetingDate.getDate()).padStart(2, '0');
  const dMonth = String(meetingDate.getMonth() + 1).padStart(2, '0');
  const dYear = meetingDate.getFullYear();
  const numericDateStr = `${dDay}-${dMonth}-${dYear}`;

  const tags = Array.isArray(meeting.tags) ? meeting.tags : [];

  // Countdown Logic
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();
    if (difference > 0) {
      return {
        expired: false,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { expired: true };
  };

  const [timeLeft, setTimeLeft] = useState({ expired: false, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'outcome'

  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [date]);

  const format = (num) => String(num || 0).padStart(2, '0');

  const Box = ({ value, label }) => (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '55px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{format(value)}</span>
      <span style={{ fontSize: '0.5rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginTop: '4px', fontWeight: 600 }}>{label}</span>
    </div>
  );

  if (isPast) {
    const descText = finalDescription || '';
    const outcomeImage = Array.isArray(photos) && photos.length > 0 ? photos[0] : (coverPhoto || null);
    const aboutImage = coverPhoto;

    // Clean up outcomes for display
    const rawOutcomes = outcome_summary || outcome_title || "Practical agent workflows.\nThe Rise of AI-Driven Commerce.\nCareer pathways in applied AI.";
    const outcomesList = rawOutcomes.split('\n').filter(l => l.trim());

    return (
      <div style={{ background: '#ffffff', borderRadius: '24px', overflow: 'hidden', padding: '1.5rem', display: 'flex', gap: '1.5rem', color: '#0f172a', flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', textAlign: 'left', border: '1px solid rgba(226, 232, 240, 0.9)', boxShadow: '0 10px 30px -10px rgba(15,23,42,0.05)', width: '100%' }}>
        <style>{`
          /* Custom styles for past events can go here */
        `}</style>
        {/* Main Content */}
        <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Header & Badges */}
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ padding: '6px 16px', background: '#f1f5f9', color: '#64748b', borderRadius: '24px', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>WEEK {weekNumber || 37}</span>
              <span style={{ padding: '6px 16px', background: 'rgba(16,185,129,0.1)', color: '#047857', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '24px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Completed
              </span>
            </div>
            <Link href={`/meetings/${meeting.id || ''}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-display)', lineHeight: 1.3, transition: 'color 0.2s ease' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#1f6fb2'}
                onMouseOut={(e) => e.currentTarget.style.color = '#0f172a'}
              >
                {title}
              </h3>
            </Link>
          </div>

          {/* Info Details (No Box) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> DATE
              </div>
              <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>{numericDateStr}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> TIME
              </div>
              <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>4:00 PM - 6:00 PM</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> DURATION
              </div>
              <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>2 Hours</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> ATTENDEES
              </div>
              <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>{attendees_count || 42} joined</div>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> VENUE
              </div>
              <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.4 }}>{venue || location || 'Online'}</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('about')}
              style={{
                background: activeTab === 'about' ? '#2563eb' : 'transparent',
                color: activeTab === 'about' ? '#ffffff' : '#64748b',
                border: activeTab === 'about' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('outcome')}
              style={{
                background: activeTab === 'outcome' ? '#2563eb' : 'transparent',
                color: activeTab === 'outcome' ? '#ffffff' : '#64748b',
                border: activeTab === 'outcome' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Outcome
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', border: '1px solid #e2e8f0' }}>
            {activeTab === 'outcome' ? (
              <>
                <div style={{ flex: '1 1 300px', minHeight: '250px', maxHeight: '400px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {outcomeImage ? (
                    <img src={outcomeImage} alt="Outcome" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>No Outcome Image Available</div>
                  )}
                </div>
                <div style={{ flex: '1 1 300px', padding: '2rem' }}>
                  <h4 style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '1px' }}>LEARNING OUTCOMES</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {outcomesList.map((line, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>{line.replace(/^[-*•]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ flex: '1 1 300px', minHeight: '250px', maxHeight: '400px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {aboutImage ? (
                    <img src={aboutImage} alt="Event Poster" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>No Poster Available</div>
                  )}
                </div>
                <div style={{ flex: '1 1 300px', padding: '2rem' }}>
                  <h4 style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem', letterSpacing: '1px' }}>ABOUT THE EVENT</h4>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {descText || "No description provided for this event."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Upcoming Session UI — matches the reference design:
  // eyebrow tag -> title -> date/time/duration row -> feature bullets -> location -> registration
  const displayVenue = venue || location || 'Online';
  const eyebrowText = eyebrow || (tags.length > 0 ? tags[0].toUpperCase() : 'CODE LOCAL, THINK GLOBAL');
  const durationText = duration || '2 Hours';

  return (
    <div className="hero-single-card upcoming-card">
      <style>{`
        .hero-single-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          align-items: stretch;
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          box-shadow: 0 10px 30px -10px rgba(15,23,42,0.06);
        }
        .hero-img-side {
          position: relative;
          min-width: 0;
          min-height: 260px;
          background: #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
        }
        .hero-week-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #ffffff;
          color: #0f172a;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(15,23,42,0.15);
          letter-spacing: 0.3px;
        }
        .hero-content-side {
          min-width: 0;
          padding: clamp(1.25rem, 3vw, 2.25rem) clamp(1.25rem, 4vw, 2.75rem);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          box-sizing: border-box;
        }
        .hero-eyebrow {
          color: #0ea5e9;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0 0 0.5rem 0;
        }
        .hero-divider {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 1.25rem 0;
        }
        .hero-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 2.5rem;
        }
        .hero-meta-label {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .hero-meta-value {
          color: #0f172a;
          font-size: 1rem;
          font-weight: 700;
        }
        .hero-location-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 500;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e2e8f0;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        .hero-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: auto;
        }
        .hero-registration-label {
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 2px;
        }
        .hero-registration-value {
          color: #0ea5e9;
          font-size: 1.15rem;
          font-weight: 800;
        }
        .hero-register-btn {
          display: inline-flex;
          padding: 0.75rem 1.75rem;
          background: linear-gradient(135deg, #0ea5e9, #14b8a6);
          border: none;
          color: #fff;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        @media (max-width: 768px) {
          .hero-single-card {
            grid-template-columns: 1fr;
          }
          .hero-img-side {
            height: 250px;
            min-height: auto;
            width: 100%;
          }
          .hero-img {
            height: 100%;
            max-height: 250px;
            object-fit: contain;
          }
          .hero-content-side {
            padding: 1.5rem;
          }
          .hero-meta-row {
            gap: 1.5rem;
          }
          .hero-footer-row {
            margin-top: 1.5rem;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
          }
          .hero-register-btn {
            width: auto;
            padding: 0.6rem 1.1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      {/* Left Side: Image */}
      <div className="hero-img-side">
        {coverPhoto ? (
          <img src={coverPhoto} alt={title} className="hero-img" />
        ) : (
          <div style={{ color: '#94a3b8', padding: '2rem', display: 'flex', alignItems: 'center' }}>No Poster Available</div>
        )}
      </div>

      {/* Right Side: Content */}
      <div className="hero-content-side upcoming-content">

        {/* Top Badge */}
        <div style={{ marginBottom: '1rem', display: 'flex' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '0.4rem 1rem', 
            background: '#e6f9f2', 
            color: '#047857', 
            borderRadius: '30px', 
            fontSize: '0.85rem', 
            fontWeight: 800, 
            border: '1px solid #a7f3d0' 
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Upcoming
          </span>
        </div>

        {/* Title */}
        <Link href={`/meetings/${meeting.id || ''}`} style={{ textDecoration: 'none' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-display)', lineHeight: 1.15, letterSpacing: '-0.02em', transition: 'color 0.2s ease' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#1f6fb2'}
              onMouseOut={(e) => e.currentTarget.style.color = '#0f172a'}
          >
            {title}
          </h2>
        </Link>

        <hr className="hero-divider" />

        {/* Date / Time / Duration */}
        <div className="hero-meta-row">
          <div>
            <div className="hero-meta-label">Date</div>
            <div className="hero-meta-value">{numericDateStr}</div>
          </div>
          <div>
            <div className="hero-meta-label">Time</div>
            <div className="hero-meta-value">4:00 PM - 6:00 PM</div>
          </div>
          <div>
            <div className="hero-meta-label">Duration</div>
            <div className="hero-meta-value">{durationText}</div>
          </div>
        </div>

        {/* Location & Speaker */}
        <div className="hero-location-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span style={{ lineHeight: 1.4 }}>{displayVenue}</span>
        </div>
        <div className="hero-location-row" style={{ marginTop: '0.75rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span style={{ lineHeight: 1.4 }}>Speaker: <span style={{ fontWeight: 700 }}>{meeting.speaker || 'Nagaraj'}</span></span>
        </div>
        {registration_link && (
          <div className="hero-location-row" style={{ marginTop: '0.75rem', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            <a href={registration_link} target="_blank" rel="noopener noreferrer" style={{ 
              lineHeight: 1, 
              color: '#1d4ed8', 
              textDecoration: 'none', 
              background: '#eff6ff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid #bfdbfe',
              display: 'inline-block',
              maxWidth: '90%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#dbeafe'}
            onMouseOut={(e) => e.currentTarget.style.background = '#eff6ff'}
            >
              {registration_link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          </div>
        )}

        <hr className="hero-divider" />

        {/* Registration + Button */}
        <div className="hero-footer-row">
          <div>
            <div className="hero-registration-label">Registration</div>
            <div className="hero-registration-value">{entry_fee || 'ENTRY FREE'}</div>
          </div>

          {registration_link ? (
            <Link href={registration_link} target="_blank" rel="noopener noreferrer" className="hero-register-btn">
              Register Free &rarr;
            </Link>
          ) : (
            <>
              <button onClick={() => setShowRegistration(true)} className="hero-register-btn">
                Register Free &rarr;
              </button>
              {showRegistration && (
                <EventRegistrationModal meeting={meeting} onClose={() => setShowRegistration(false)} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}