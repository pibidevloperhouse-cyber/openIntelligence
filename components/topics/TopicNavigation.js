import Link from 'next/link';
import { useState } from 'react';

export default function TopicNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';

  return (
    <>
      <style>{`
        .topic-hover-link {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.3s ease;
          font-weight: 600;
          padding: 0.5rem;
        }
        .topic-hover-link:hover {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
        }
        .desktop-nav { display: flex; }
        .mobile-nav { display: none; }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
      <div className="glass-nav" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', position: 'sticky', top: 0, zIndex: 100, padding: '0.75rem 0', marginBottom: '0' }}>
        
        {/* Mobile Custom Dropdown */}
        <div className="mobile-nav" style={{ padding: '0 1rem', position: 'relative' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ width: '100%', padding: '0.85rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 600, color: '#0f172a', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer' }}
            >
              Explore Topics...
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isMobileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {isMobileMenuOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, right: 0, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100 }}>
                <Link href="/open-intelligence/data-science" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '1rem', color: '#475569', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Data Science</Link>
                <Link href="/open-intelligence/computer-vision" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '1rem', color: '#475569', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Computer Vision</Link>
                <Link href="/open-intelligence/hardware-with-edge-ai" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '1rem', color: '#475569', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Hardware with Edge AI</Link>
                <Link href="/open-intelligence/production-ready-systems" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '1rem', color: '#475569', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>Production-Ready Systems</Link>
                <Link href="/open-intelligence/hybrid-infrastructure-mastery" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', padding: '1rem', color: '#475569', textDecoration: 'none', fontWeight: 600 }}>Hybrid Infrastructure Mastery</Link>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Links */}
        <div className="desktop-nav" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/open-intelligence/data-science" className="topic-hover-link">Data Science</Link>
          <Link href="/open-intelligence/computer-vision" className="topic-hover-link">Computer Vision</Link>
          <Link href="/open-intelligence/hardware-with-edge-ai" className="topic-hover-link">Hardware with Edge AI</Link>
          <Link href="/open-intelligence/production-ready-systems" className="topic-hover-link">Production-Ready Systems</Link>
          <Link href="/open-intelligence/hybrid-infrastructure-mastery" className="topic-hover-link">Hybrid Infrastructure Mastery</Link>
        </div>
      </div>
    </>
  );
}
