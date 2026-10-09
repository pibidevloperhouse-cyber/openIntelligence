'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function FeaturesCarousel() {
  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval;
    
    const startScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll by one card width (approx 320px + gap)
            scrollContainer.scrollBy({ left: 340, behavior: 'smooth' });
          }
        }
      }, 5000);
    };

    startScroll();

    scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollInterval));
    scrollContainer.addEventListener('mouseleave', startScroll);
    scrollContainer.addEventListener('touchstart', () => clearInterval(scrollInterval), { passive: true });
    scrollContainer.addEventListener('touchend', startScroll);

    return () => {
      clearInterval(scrollInterval);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', () => clearInterval(scrollInterval));
        scrollContainer.removeEventListener('mouseleave', startScroll);
        scrollContainer.removeEventListener('touchstart', () => clearInterval(scrollInterval));
        scrollContainer.removeEventListener('touchend', startScroll);
      }
    };
  }, []);

  const handleMouseDown = (e) => {
    isDown.current = true;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grabbing';
      startX.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft.current = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    isDown.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX.current) * 2; // Scroll multiplier
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  return (
    <>
      <style>{`
        .features-carousel-container::-webkit-scrollbar {
          display: none;
        }
        .carousel-card {
          flex: 0 0 auto;
          width: 85vw;
          max-width: 320px;
          scroll-snap-align: start;
        }
        @media (min-width: 768px) {
          .carousel-card {
            width: calc(33.333% - 0.85rem);
            max-width: none;
          }
        }
      `}</style>
      <div 
        ref={scrollRef} 
        className="flex gap-5 mb-16 overflow-x-auto snap-x snap-mandatory features-carousel-container cursor-grab active:cursor-grabbing"
        style={{
          paddingBottom: '1.5rem',
          marginLeft: '-1rem',
          marginRight: '-1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Card 1 */}
        <div className="carousel-card">
          <Link href="/#learn" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div className="hover:shadow-xl hover:-translate-y-1" style={{ background: '#ffffff', border: '1px solid #E7E5E4', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ color: '#0f172a', marginBottom: '1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Free</h3>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Community Learning</div>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                Learn and exchange knowledge through community sessions.
              </p>
              <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                How it works <span style={{ fontSize: '1.1rem' }}>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Card 2 */}
        <div className="carousel-card">
          <Link href="/meetings?tab=past#sessions-tabs" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div className="hover:shadow-xl hover:-translate-y-1" style={{ background: '#ffffff', border: '1px solid #E7E5E4', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                65+
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' }}>Weeks of Learning</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                A continuous journey through emerging AI technologies.
              </p>
              <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Our journey <span style={{ fontSize: '1.1rem' }}>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Card 3 */}
        <div className="carousel-card">
          <Link href="/contribute" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div className="hover:shadow-xl hover:-translate-y-1" style={{ background: '#ffffff', border: '1px solid #E7E5E4', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ color: '#0f172a', marginBottom: '1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Contribute</h3>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Open Intelligence</div>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                Share ideas, build AI solutions, and contribute to open projects.
              </p>
              <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Start contributing <span style={{ fontSize: '1.1rem' }}>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Card 4 */}
        <div className="carousel-card">
          <Link href="/problems" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div className="hover:shadow-xl hover:-translate-y-1" style={{ background: '#ffffff', border: '1px solid #E7E5E4', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ color: '#0f172a', marginBottom: '1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Hands-on</h3>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Build with AI</div>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                Learn through practical demonstrations, experiments, and implementation.
              </p>
              <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Explore projects <span style={{ fontSize: '1.1rem' }}>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Card 5 */}
        <div className="carousel-card">
          <Link href="/open-intelligence" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div className="hover:shadow-xl hover:-translate-y-1" style={{ background: '#ffffff', border: '1px solid #E7E5E4', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
                10+
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem' }}>AI Domains Explored</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                From LLMs and AI agents to edge AI and infrastructure.
              </p>
              <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Explore topics <span style={{ fontSize: '1.1rem' }}>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Card 6 */}
        <div className="carousel-card">
          <Link href="/" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
            <div className="hover:shadow-xl hover:-translate-y-1" style={{ background: '#ffffff', border: '1px solid #E7E5E4', borderRadius: '16px', padding: '1.75rem', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ color: '#0f172a', marginBottom: '1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Open to All</h3>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Join the Community</div>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                Connect with learners, developers, researchers, and industry professionals.
              </p>
              <span style={{ color: '#0f172a', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Be part of it <span style={{ fontSize: '1.1rem' }}>→</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
