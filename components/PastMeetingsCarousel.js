'use client';

import React, { useRef } from 'react';
import HeroEventCard from './HeroEventCard';
import Link from 'next/link';

export default function PastMeetingsCarousel({ meetings }) {
  const scrollContainerRef = useRef(null);

  if (!meetings || meetings.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="section" style={{ paddingTop: '4rem', paddingBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Past Sessions
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
              Catch up on what you missed in our previous meetups
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={scrollLeft}
              className="carousel-btn"
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={scrollRight}
              className="carousel-btn"
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <style>{`
          .carousel-container {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 1.5rem;
            align-items: stretch;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 1.5rem;
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
            scroll-behavior: smooth;
          }
          .carousel-container::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
          .carousel-item {
            scroll-snap-align: start;
            flex: 0 0 100%;
            max-width: 100%;
            display: flex;
          }
          .carousel-item > div {
            width: 100%;
            height: 100%;
          }
          
          .carousel-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(15, 22, 35, 0.7);
            border: 1px solid var(--border);
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
          }
          .carousel-btn:hover {
            background: rgba(99, 102, 241, 0.15);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
            transform: translateY(-2px);
          }
          .carousel-btn:active {
            transform: translateY(0);
          }
        `}</style>

        {/* Fading Edges */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: '1.5rem', width: '80px',
            background: 'linear-gradient(to left, var(--bg-primary), transparent)',
            zIndex: 1, pointerEvents: 'none'
          }} />

          <div 
            ref={scrollContainerRef}
            className="carousel-container"
          >
            {meetings.map((m) => (
              <div key={m.id} className="carousel-item">
                <HeroEventCard meeting={m} isPast={true} />
              </div>
            ))}
            
            {/* View All Card */}
            <div className="carousel-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Link href="/meetings" className="glass-card" style={{ 
                 width: '100%', height: '100%', minHeight: '250px', display: 'flex', flexDirection: 'column', 
                 alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: '1rem',
                 border: '1px dashed var(--border)'
               }}>
                 <div style={{ background: 'rgba(99,102,241,0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </div>
                 <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>View All Past Sessions</span>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
