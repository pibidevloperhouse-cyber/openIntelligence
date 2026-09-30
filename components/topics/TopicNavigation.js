'use client';

import Link from 'next/link';
import { useState } from 'react';
import { navCategories } from '../NavMenuData';
import { usePathname } from 'next/navigation';

export default function TopicNavigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubgroup, setActiveSubgroup] = useState(null);
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';

  const handleMouseEnter = (idx) => {
    setActiveMenu(idx);
    setActiveSubgroup(0); // Select the first subgroup by default
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
    setActiveSubgroup(null);
  };

  return (
    <>
      <style>{`
        .topic-hover-link {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.2s ease;
          font-weight: 600;
          padding: 1rem 0.5rem;
          display: inline-block;
        }
        .topic-hover-link.active, .topic-hover-link:hover {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
        }
        
        .desktop-nav { display: flex; position: relative; }
        .mobile-nav { display: none; }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: block !important; }
        }

        /* Mega Menu Panel */
        .mega-menu-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border-radius: 0 0 16px 16px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-top: none;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.1);
          overflow: hidden;
          display: flex;
          min-height: 380px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mega-menu-panel.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .mega-menu-left {
          width: 280px;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          padding: 1.5rem 0;
        }
        .mega-menu-right {
          flex: 1;
          padding: 2rem;
          background: #ffffff;
        }
        
        .mega-left-item {
          padding: 0.75rem 1.5rem;
          cursor: pointer;
          font-weight: 600;
          color: #475569;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }
        .mega-left-item:hover, .mega-left-item.active {
          color: #1f6fb2;
          background: #f1f5f9;
        }
        
        .mega-right-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .mega-right-link {
          display: flex;
          flex-direction: column;
          color: #334155;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
          font-weight: 500;
        }
        .mega-right-link:hover {
          background: #f8fafc;
          color: #1f6fb2;
          padding-left: 0.75rem;
        }
      `}</style>

      <div className="glass-nav" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', position: 'sticky', top: 0, zIndex: 100, marginBottom: '0' }}>
        
        {/* Mobile Custom Dropdown */}
        <div className="mobile-nav" style={{ padding: '0.75rem 1rem' }}>
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
              <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', left: 0, right: 0, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 100, maxHeight: '60vh', overflowY: 'auto' }}>
                {navCategories.map((cat, idx) => (
                  <div key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <div 
                      onClick={() => cat.subGroups ? setExpandedMobileCategory(expandedMobileCategory === idx ? null : idx) : setIsMobileMenuOpen(false)}
                      style={{ padding: '1rem', color: '#0f172a', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedMobileCategory === idx ? '#f8fafc' : '#fff' }}
                    >
                      {cat.subGroups ? (
                        <span>{cat.label}</span>
                      ) : (
                        <Link href={cat.href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>{cat.label}</Link>
                      )}
                      
                      {cat.subGroups && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedMobileCategory === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      )}
                    </div>
                    
                    {expandedMobileCategory === idx && cat.subGroups && (
                      <div style={{ background: '#f8fafc', padding: '0.5rem 1rem 1rem', borderTop: '1px solid #f1f5f9' }}>
                        {cat.subGroups.map((group, gIdx) => (
                          <div key={gIdx} style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1f6fb2', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                              {group.title}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem', borderLeft: '2px solid #e2e8f0' }}>
                              {group.items.map((item, iIdx) => (
                                <Link 
                                  key={iIdx} 
                                  href={item.href} 
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  style={{ color: '#475569', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                        <Link href={cat.href} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#1f6fb2', textDecoration: 'none' }}>
                          View All {cat.label} →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Links */}
        <div className="desktop-nav" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', position: 'relative' }} onMouseLeave={handleMouseLeave}>
          
          {navCategories.map((cat, idx) => (
            <div key={idx} onMouseEnter={() => handleMouseEnter(idx)}>
              <Link href={cat.href} className={`topic-hover-link ${pathname === cat.href ? 'active' : ''}`}>
                {cat.label}
              </Link>
            </div>
          ))}

          {/* Mega Menu Dropdown */}
          <div className={`mega-menu-panel ${activeMenu !== null ? 'visible' : ''}`}>
            {activeMenu !== null && navCategories[activeMenu].subGroups && (
              <>
                <div className="mega-menu-left">
                  {navCategories[activeMenu].subGroups.map((group, gIdx) => (
                    <div 
                      key={gIdx} 
                      className={`mega-left-item ${activeSubgroup === gIdx ? 'active' : ''}`}
                      onMouseEnter={() => setActiveSubgroup(gIdx)}
                    >
                      {group.title}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: activeSubgroup === gIdx ? 1 : 0, transform: `translateX(${activeSubgroup === gIdx ? '0' : '-5px'})`, transition: 'all 0.2s' }}>
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </div>
                  ))}
                </div>
                
                <div className="mega-menu-right">
                  {activeSubgroup !== null && navCategories[activeMenu].subGroups[activeSubgroup] && (
                    <>
                      <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                        {navCategories[activeMenu].subGroups[activeSubgroup].title}
                      </h3>
                      <div className="mega-right-grid">
                        {navCategories[activeMenu].subGroups[activeSubgroup].items.map((item, iIdx) => (
                          <Link key={iIdx} href={item.href} className="mega-right-link" onClick={handleMouseLeave}>
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            
            {/* If a category has no subgroups, fallback */}
            {activeMenu !== null && !navCategories[activeMenu].subGroups && (
              <div style={{ padding: '2rem' }}>Explore {navCategories[activeMenu].label}</div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
