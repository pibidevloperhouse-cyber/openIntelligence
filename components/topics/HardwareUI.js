import TopicNavigation from './TopicNavigation';

export default function HardwareUI({ data }) {
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';
  const brandColorPrimary = '#1f6fb2';

  const SectionTitle = ({ title, subtitle }) => (
    <div style={{ marginBottom: '2rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '12px', height: '12px', background: brandGradient }}></div>
        {title}
      </h2>
      {subtitle && <p className="mono-text" style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>// {subtitle}</p>}
    </div>
  );

  return (
    <div id="hw-theme" style={{ display: 'flex', flexDirection: 'column', background: '#f8fafc', minHeight: '100vh', width: '100%', color: '#0f172a', fontFamily: '"Inter", system-ui, sans-serif' }}>
      
      <style>{`
        #hw-theme * { box-sizing: border-box; }
        
        #hw-theme .gradient-text {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        #hw-theme .mono-text {
          font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
          letter-spacing: -0.02em;
        }

        #hw-theme .dash-card {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px; /* Harder edges for tech feel */
          padding: 1.25rem;
          box-shadow: 2px 2px 0 rgba(31,111,178,0.1);
          transition: all 0.2s ease;
          position: relative;
        }
        #hw-theme .dash-card:hover {
          border-color: ${brandColorPrimary};
          box-shadow: 4px 4px 0 rgba(31,111,178,0.2);
          transform: translate(-2px, -2px);
        }

        /* Glowing LED dot */
        #hw-theme .dash-card::before {
          content: '';
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          opacity: 0;
          transition: opacity 0.3s;
        }
        #hw-theme .dash-card:hover::before { opacity: 1; }

        #hw-theme .sys-label {
          display: inline-block;
          background: #1e293b;
          color: #f8fafc;
          padding: 0.2rem 0.5rem;
          border-radius: 2px;
          font-size: 0.65rem;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        #hw-theme .hover-link {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.2s;
        }
        #hw-theme .hover-link:hover { color: ${brandColorPrimary}; }

        /* Scrollbars for dashboard */
        .dash-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1.5rem;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .dash-scroll::-webkit-scrollbar { height: 6px; }
        .dash-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
        .dash-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
      `}</style>

      <TopicNavigation />

      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1rem' }}>
        
        {/* HERO SECTION */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.1 }}>
              {data.titleHTML}
            </h1>
            <p className="mono-text" style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 2rem', lineHeight: 1.6, maxWidth: '600px' }}>
              {data.desc}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '2px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>[EXECUTE QUERY]</button>
            </div>
          </div>
          
          {/* Dashboard Graphic Component */}
          <div style={{ flex: '1 1 400px', background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '4px', padding: '2rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
            <div className="mono-text" style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>SYS.UTILIZATION</span>
              <span style={{ color: '#10b981' }}>[OPTIMAL]</span>
            </div>
            
            {[
              { label: 'NPU Core 0', val: '78%' },
              { label: 'NPU Core 1', val: '42%' },
              { label: 'Memory', val: '91%' },
              { label: 'Power', val: '12W' }
            ].map((stat, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <span>{stat.label}</span>
                  <span className="mono-text">{stat.val}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '0', overflow: 'hidden' }}>
                  <div style={{ width: stat.val, height: '100%', background: brandGradient }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {/* 1. FEATURED NEWS (Logs) */}
          <div>
            <SectionTitle title="System Logs (News)" subtitle="Recent hardware developments" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.news.map((item, idx) => (
                <div key={idx} className="dash-card">
                  <span className="sys-label mono-text">{item.category}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.5rem 0 1rem', lineHeight: 1.4 }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div className="mono-text" style={{ color: '#64748b', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>AUTH: {item.author.split(' ')[0]}</span>
                    <span>TS: {item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. ESSENTIAL GUIDES (Manuals) */}
          <div>
            <SectionTitle title="Tech Manuals (Guides)" subtitle="Documentation and specs" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.guides.map((item, idx) => (
                <div key={idx} className="dash-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '80px', flexShrink: 0, border: '1px solid #cbd5e1' }}>
                    <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                      <a href="#" className="hover-link">{item.title}</a>
                    </h3>
                    <div className="mono-text" style={{ color: brandColorPrimary, fontSize: '0.75rem' }}>DOC_ID: {10000 + idx * 3141}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. LATEST PRESENTATIONS (Video Feeds) */}
        <div style={{ marginTop: '5rem' }}>
          <SectionTitle title="Surveillance Feeds (Presentations)" subtitle="Live and recorded hardware demos" />
          <div className="dash-scroll">
            {data.presentations.map((item, idx) => (
              <div key={idx} className="dash-card" style={{ minWidth: '350px', padding: '1rem' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', border: '2px solid #cbd5e1', marginBottom: '1rem' }}>
                  <img src={item.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* Fake camera UI overlay */}
                  <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', color: '#10b981', fontSize: '0.7rem', fontWeight: 'bold', fontFamily: 'monospace' }}>● REC</div>
                  <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', color: '#fff', fontSize: '0.7rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem', fontFamily: 'monospace' }}>{item.duration}</div>
                  <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}></div>
                </div>
                <span className="sys-label mono-text">{item.category}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.5rem', lineHeight: 1.3 }}>
                  <a href="#" className="hover-link">{item.title}</a>
                </h3>
                <div className="mono-text" style={{ color: '#64748b', fontSize: '0.75rem' }}>SRC: {item.author}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. IN-DEPTH ARTICLES (Data Streams) */}
        <div style={{ marginTop: '5rem' }}>
          <SectionTitle title="Data Streams (Articles)" subtitle="Deep technical architectures" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {data.articles.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', background: '#fff', border: '1px solid #cbd5e1', borderLeft: `4px solid ${brandColorPrimary}`, padding: '1.5rem', alignItems: 'center', gap: '2rem' }}>
                <div className="mono-text" style={{ fontSize: '0.8rem', color: '#94a3b8', width: '90px' }}>
                  0x{(4096 + idx * 255).toString(16).toUpperCase().padStart(4, '0')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div className="mono-text" style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    <span style={{ color: brandColorPrimary }}>{item.category}</span> // {item.author} // {item.date}
                  </div>
                </div>
                <button style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem', cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. FEATURED PODCASTS (Audio Logs) */}
        <div style={{ marginTop: '5rem' }}>
          <SectionTitle title="Audio Logs (Podcasts)" subtitle="Recorded transmissions" />
          <div className="dash-scroll">
            {data.podcasts.map((item, idx) => (
              <div key={idx} className="dash-card" style={{ minWidth: '300px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2ec4b6" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div className="mono-text" style={{ color: '#64748b', fontSize: '0.75rem' }}>DUR: {item.duration} | {item.author.split(' ')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. TOPICS DIRECTORY (System Directory) */}
        <div style={{ marginTop: '5rem', paddingBottom: '5rem' }}>
          <SectionTitle title="System Directory" subtitle="Explore all node clusters" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {data.topicColumns.map((col, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #cbd5e1' }}>
                <div style={{ background: '#f1f5f9', padding: '1rem', borderBottom: '1px solid #cbd5e1' }}>
                  <h4 className="mono-text" style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>[{col.title}]</h4>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      <a href="#" className="hover-link">› {item}</a>
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
