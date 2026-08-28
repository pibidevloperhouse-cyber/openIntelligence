'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateHomepageData } from '@/lib/open-intelligence-data';

export default function OpenIntelligenceHomePage() {
  const data = generateHomepageData();
  const [trendingTab, setTrendingTab] = useState('7 days');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // The user's brand gradient
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';
  const brandColorPrimary = '#1f6fb2';
  const brandColorSecondary = '#2ec4b6';

  const SectionTitle = ({ title, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', marginTop: '1rem' }}>
      {icon && <span style={{ display: 'flex', alignItems: 'center', color: brandColorPrimary, filter: 'drop-shadow(0 2px 4px rgba(31,111,178,0.15))' }}>{icon}</span>}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'capitalize', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
        {title}
      </h2>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', color: '#0f172a', fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      
      <style>{`
        .desktop-nav { display: flex; }
        .mobile-nav { display: none; }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block; }
        }

        .premium-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 20px -2px rgba(0,0,0,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .premium-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px -4px rgba(0,0,0,0.08);
          border-color: #cbd5e1;
        }
        
        .news-link {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.2s;
        }
        .news-link:hover {
          color: ${brandColorPrimary} !important;
        }

        .gradient-text {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .gradient-border {
          position: relative;
        }
        .gradient-border::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: ${brandGradient};
          border-radius: 4px;
        }

        .glass-nav {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          position: sticky;
          top: 0;
          z-index: 50;
        }
          
        .custom-topic-link {
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .custom-topic-link:hover {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
        }
        
        .primary-btn {
          background: ${brandGradient};
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 99px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          box-shadow: 0 4px 14px 0 rgba(31, 111, 178, 0.39);
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(31, 111, 178, 0.23);
        }
        
        .media-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.2) 50%, rgba(15, 23, 42, 0) 100%);
        }
        
        .badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.3rem 0.6rem;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .mobile-dropdown-item {
          display: block;
          padding: 1rem 1.25rem;
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
        }
        .mobile-dropdown-item:last-child {
          border-bottom: none;
        }
        .mobile-dropdown-item:hover, .mobile-dropdown-item:active {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
          padding-left: 1.5rem;
        }
      `}</style>

      {/* TOP NAVIGATION BAR (Glassmorphism) */}
      <div className="glass-nav" style={{ padding: '0.75rem 0', marginBottom: '3rem' }}>
        
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
                <Link href="/open-intelligence/data-science" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Data Science</Link>
                <Link href="/open-intelligence/computer-vision" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Computer Vision</Link>
                <Link href="/open-intelligence/hardware-with-edge-ai" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Hardware with Edge AI</Link>
                <Link href="/open-intelligence/production-ready-systems" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Production-Ready Systems</Link>
                <Link href="/open-intelligence/hybrid-infrastructure-mastery" className="mobile-dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>Hybrid Infrastructure Mastery</Link>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Links */}
        <div className="desktop-nav" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/open-intelligence/data-science" className="custom-topic-link">Data Science</Link>
          <Link href="/open-intelligence/computer-vision" className="custom-topic-link">Computer Vision</Link>
          <Link href="/open-intelligence/hardware-with-edge-ai" className="custom-topic-link">Hardware with Edge AI</Link>
          <Link href="/open-intelligence/production-ready-systems" className="custom-topic-link">Production-Ready Systems</Link>
          <Link href="/open-intelligence/hybrid-infrastructure-mastery" className="custom-topic-link">Hybrid Infrastructure Mastery</Link>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* 1. NEWS & TRENDING */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
          
          {/* News Left Column */}
          <div style={{ flex: '2 1 600px' }}>
            <SectionTitle title="Latest News" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {data.news.map((item, idx) => (
                <div key={idx} className="premium-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: brandColorPrimary, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    {item.date}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', lineHeight: 1.4 }}>
                    <a href="#" className="news-link">{item.title}</a>
                  </h3>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: brandColorPrimary }}>
                      {item.author.charAt(0)}
                    </div>
                    <span style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 500 }}>{item.author}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <button className="primary-btn">
                Browse All News
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Trending Right Sidebar */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="premium-card" style={{ padding: '1.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
              <SectionTitle title="Trending" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>} />
              
              <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                {['7 days', '1 month', '3 months'].map(tab => (
                  <div 
                    key={tab}
                    onClick={() => setTrendingTab(tab)}
                    style={{ 
                      flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: '8px',
                      background: trendingTab === tab ? '#fff' : 'transparent',
                      color: trendingTab === tab ? '#0f172a' : '#64748b',
                      boxShadow: trendingTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}>
                    {tab}
                  </div>
                ))}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.trending[trendingTab].map((title, i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: i !== 5 ? '1px solid #e2e8f0' : 'none', alignItems: 'flex-start', group: 'true' }}>
                    <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>0{i + 1}</span>
                    <a href="#" className="news-link" style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.4 }}>{title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* 2. ARTICLES & SPONSORS */}
        <div style={{ display: 'flex', gap: '3rem', marginBottom: '5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '2 1 600px' }}>
            <SectionTitle title="Deep Dives & Articles" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>} />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {data.articles.map((item, idx) => (
                <div key={idx} className="premium-card" style={{ display: 'flex', gap: '1rem', padding: '1.25rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: brandColorSecondary, fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      {item.date}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                      <a href="#" className="news-link">{item.title}</a>
                    </h3>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>By {item.author}</div>
                  </div>
                  <img src={item.image} alt={item.title} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <SectionTitle title="Sponsored Guides" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>} />
            <div className="premium-card" style={{ padding: '1.5rem' }}>
              {data.guides.map((guide, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: idx === 0 ? '1px solid #e2e8f0' : 'none' }}>
                  <img src={guide.image} alt="Sponsor" style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '6px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: brandColorPrimary, fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>FEATURED</div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#0f172a', lineHeight: 1.3 }}>
                      <a href="#" className="news-link">Understanding Postgres Performance Limits</a>
                    </h4>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>Tiger Data</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. IN CASE YOU MISSED IT (Full Width Highlight Section) */}
      <div style={{ background: '#0f172a', padding: '5rem 0', margin: '0 0 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Abstract background decorative elements - Now using brand colors */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(31,111,178,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(46,196,182,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%' }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>In Case You Missed It</h2>
            <a href="#" style={{ color: brandColorSecondary, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View All <span style={{ fontSize: '1.2rem' }}>&rsaquo;</span>
            </a>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {data.missedIt.map((item, idx) => (
              <div key={idx} className="premium-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '60%' }}>
                  <img src={item.image} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="media-overlay"></div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem', color: '#f8fafc', lineHeight: 1.4 }}>{item.title}</h3>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>{item.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', paddingBottom: '4rem' }}>
        
        {/* 4. PRESENTATIONS, PODCASTS, GUIDES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
          
          {/* Presentations */}
          <div>
            <SectionTitle title="Presentations" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.presentations.map((item, idx) => (
                <div key={idx} className="premium-card">
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                    <img src={item.image} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="media-overlay"></div>
                    <div className="badge" style={{ position: 'absolute', top: '10px', right: '10px' }}>Transcript</div>
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '4px' }}><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px' }}>
                      {item.duration}
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#0f172a', lineHeight: 1.3 }}><a href="#" className="news-link">{item.title}</a></h3>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{item.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Podcasts */}
          <div>
            <SectionTitle title="Podcasts" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.podcasts.map((item, idx) => (
                <div key={idx} className="premium-card">
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                    <img src={item.image} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="media-overlay"></div>
                    <div style={{ position: 'absolute', left: '12px', bottom: '12px', width: '36px', height: '36px', background: brandGradient, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(31,111,178,0.4)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '4px 8px', borderRadius: '6px' }}>
                      {item.duration}
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#0f172a', lineHeight: 1.3 }}><a href="#" className="news-link">{item.title}</a></h3>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{item.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guides */}
          <div>
            <SectionTitle title="Knowledge Guides" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {data.guides.map((item, idx) => (
                <div key={idx} className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img src={item.image} alt={item.title} style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' }} />
                  <div>
                    <div style={{ color: brandColorSecondary, fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>E-BOOK</div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#0f172a', lineHeight: 1.3 }}><a href="#" className="news-link">{item.title}</a></h3>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>Published by {item.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 5. TOPICS DIRECTORY FOOTER */}
        {/* Ensure marginBottom is 0 here to prevent margin collapse at the bottom of the page */}
        <div style={{ background: '#ffffff', borderRadius: '24px', padding: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.03)', marginBottom: '0' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem' }}>Explore Core Topics</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>Dive deep into our curated collections across 5 foundational domains.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
            {data.topicColumns.map((col, idx) => (
              <div key={idx}>
                <Link href={`/open-intelligence/${col.link}`} style={{ textDecoration: 'none' }}>
                  <div className="gradient-border" style={{ paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {col.title} <span style={{ color: brandColorPrimary }}>&rarr;</span>
                    </h3>
                  </div>
                </Link>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {col.items.map((item, i) => (
                    <li key={i}>
                      <a href="#" className="news-link" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
