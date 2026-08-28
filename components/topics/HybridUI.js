import TopicNavigation from './TopicNavigation';

export default function HybridUI({ data }) {
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';
  const brandColorPrimary = '#1f6fb2';
  const neonCyan = '#2ec4b6';

  const SectionHeader = ({ title, icon }) => (
    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {icon}
      {title}
    </h2>
  );

  return (
    <div id="hybrid-theme" style={{ display: 'flex', flexDirection: 'column', background: '#fafafa', minHeight: '100vh', width: '100%', color: '#0f172a', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      <style>{`
        #hybrid-theme * { box-sizing: border-box; }
        
        #hybrid-theme .topic-stats-container {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 1rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }
        #hybrid-theme .topic-stats-container:hover {
          border-color: #cbd5e1;
        }
        #hybrid-theme .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        #hybrid-theme .stat-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        #hybrid-theme .stat-date {
          margin-left: auto;
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 500;
          white-space: nowrap;
        }

        #hybrid-theme .gradient-text {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        #hybrid-theme .neon-hover-link {
          color: #0f172a;
          text-decoration: none;
          transition: all 0.3s;
        }
        #hybrid-theme .neon-hover-link:hover {
          color: ${brandColorPrimary};
          text-shadow: none;
        }

        /* Node Cards */
        #hybrid-theme .node-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          position: relative;
          transition: all 0.3s;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        #hybrid-theme .node-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: ${brandGradient};
          opacity: 0;
          transition: opacity 0.3s;
        }
        #hybrid-theme .node-card:hover {
          transform: translateY(-4px);
          border-color: rgba(46, 196, 182, 0.3);
          box-shadow: 0 10px 30px -10px rgba(46, 196, 182, 0.2);
        }
        #hybrid-theme .node-card:hover::before { opacity: 1; }

        /* Network grid lines */
        #hybrid-theme .cyber-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
          pointer-events: none;
        }

        #hybrid-theme .neon-badge {
          display: inline-block;
          background: rgba(31, 111, 178, 0.1);
          border: 1px solid rgba(31, 111, 178, 0.3);
          color: ${brandColorPrimary};
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }
      `}</style>

      <div className="cyber-bg"></div>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <TopicNavigation />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem', position: 'relative', zIndex: 10 }}>
        
        {/* HERO */}
        <div style={{ padding: '6rem 1rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: brandColorPrimary }}></div>
            SYSTEM ARCHITECTURE ACTIVE
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {data.titleHTML}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#475569', margin: '0', lineHeight: 1.6 }}>
            {data.desc}
          </p>
        </div>

        {/* 1. NEWS */}
        <SectionHeader 
          title="Global Nodes (Featured News)" 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={neonCyan} strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {data.news.map((item, idx) => (
            <div key={idx} className="node-card">
              <span className="neon-badge">{item.category}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 1rem', lineHeight: 1.4 }}>
                <a href="#" className="neon-hover-link">{item.title}</a>
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#71717a', fontSize: '0.8rem' }}>
                <span>{item.author}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. PRESENTATIONS */}
        <SectionHeader 
          title="Media Hub (Latest Presentations)" 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={neonCyan} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {data.presentations.map((item, idx) => (
            <div key={idx} className="node-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '160px' }}>
                <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #18181b 0%, transparent 100%)' }}></div>
                
                {/* Play Button */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', border: `1px solid ${neonCyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={neonCyan} stroke="none"><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                </div>

                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.8)', border: `1px solid ${brandColorPrimary}`, color: neonCyan, fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {item.duration}
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem', color: '#0f172a' }}>
                  <a href="#" className="neon-hover-link">{item.title}</a>
                </h3>
                <div style={{ color: '#71717a', fontSize: '0.85rem' }}>{item.author}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 3. GUIDES */}
        <SectionHeader 
          title="Core Archives (Essential Guides)" 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={neonCyan} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {data.guides.map((item, idx) => (
            <div key={idx} className="node-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: '80px', height: '100px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${neonCyan}`, borderRadius: '8px', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4, mixBlendMode: 'luminosity' }} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 1rem', color: '#0f172a', lineHeight: 1.4 }}>
                <a href="#" className="neon-hover-link">{item.title}</a>
              </h3>
              <button style={{ background: 'transparent', border: `1px solid ${brandColorPrimary}`, color: neonCyan, padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', marginTop: 'auto' }}>Extract Data</button>
            </div>
          ))}
        </div>

        {/* 4. ARTICLES */}
        <SectionHeader 
          title="Data Streams (In-Depth Articles)" 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={neonCyan} strokeWidth="2"><polygon points="12 2 2 22 12 17 22 22 12 2"/></svg>} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '5rem' }}>
          {data.articles.map((item, idx) => (
            <div key={idx} className="node-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center', padding: '1.5rem' }}>
              {item.image && (
                <img src={item.image} style={{ width: '200px', height: '120px', objectFit: 'cover', borderRadius: '8px', opacity: 0.8, filter: 'grayscale(50%) contrast(1.2)' }} />
              )}
              <div style={{ flex: 1 }}>
                <span style={{ color: brandColorPrimary, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>{item.category}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0.5rem 0 1rem', color: '#0f172a' }}>
                  <a href="#" className="neon-hover-link">{item.title}</a>
                </h3>
                <div style={{ color: '#475569', fontSize: '0.85rem' }}>{item.author} • {item.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. PODCASTS */}
        <SectionHeader 
          title="Audio Transmissions (Podcasts)" 
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={neonCyan} strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {data.podcasts.map((item, idx) => (
            <div key={idx} className="node-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem' }}>
               <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden' }}>
                 <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${neonCyan}`, borderRadius: '12px' }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill={neonCyan} stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                 </div>
               </div>
               <div>
                 <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem', color: '#0f172a', lineHeight: 1.4 }}>
                   <a href="#" className="neon-hover-link">{item.title}</a>
                 </h3>
                  <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>{item.author}</div>
                 <div style={{ fontSize: '0.75rem', color: neonCyan, fontWeight: 700 }}>{item.duration}</div>
               </div>
            </div>
          ))}
        </div>

        {/* 6. TOPICS DIRECTORY FOOTER */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '4rem', paddingBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>Node Map (Directory)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {data.topicColumns.map((col, idx) => (
              <div key={idx}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '0.8rem', fontWeight: 700, color: neonCyan, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{col.title}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ fontSize: '0.85rem' }}>
                      <a href="#" className="neon-hover-link" style={{ color: '#a1a1aa' }}>{item}</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
