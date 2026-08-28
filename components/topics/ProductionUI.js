import TopicNavigation from './TopicNavigation';

export default function ProductionUI({ data }) {
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';
  const brandColorPrimary = '#1f6fb2';

  const SectionTitle = ({ title, subtitle }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>{title}</h3>
      {subtitle && <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{subtitle}</p>}
    </div>
  );

  return (
    <div id="prod-theme" style={{ display: 'block', background: '#ffffff', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', color: '#334155', fontFamily: 'var(--font-zoho), "Plus Jakarta Sans", "Inter", system-ui, sans-serif' }}>
      
      <style>{`

        .guide-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        #prod-theme .hover-link { white-space: normal !important; word-break: break-word !important; overflow-wrap: break-word !important; }
        #prod-theme .premium-card, #prod-theme .masonry-item, #prod-theme .h-scroll-item, #prod-theme .gallery-scroll-item { max-width: 100%; box-sizing: border-box; overflow: hidden; }
        #prod-theme { width: 100%; max-width: 100vw; overflow-x: hidden; }
  
        #prod-theme * { box-sizing: border-box; }
        
        #prod-theme .gradient-text {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        #prod-theme .hover-link {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.2s;
        }
        #prod-theme .hover-link:hover { color: ${brandColorPrimary}; }

        /* Pipeline Layout Styles */
        #prod-theme .pipeline-container {
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
        }
        /* Vertical connecting line */
        #prod-theme .pipeline-container::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 2rem;
          width: 2px;
          background: #e2e8f0;
          z-index: 0;
        }
        @media (max-width: 768px) {

          .guide-img { aspect-ratio: 16/9 !important; }
          .bento-large-title { white-space: normal !important; }
          #prod-theme .cv-section-title, #prod-theme .ds-section-title, #prod-theme .hw-section-title { white-space: normal !important; word-break: break-word !important; }
  

          
          
          
      
          #prod-theme .pipeline-container::before { left: 1rem; }
        }

        #prod-theme .pipeline-node {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 2rem;
          padding: 2rem 0;
        }
        @media (max-width: 768px) {
          .pipeline-node { gap: 1rem; }
        }

        .node-icon {
          width: 4rem;
          height: 4rem;
          background: #ffffff;
          border: 2px solid ${brandColorPrimary};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(31,111,178,0.15);
          position: relative;
          z-index: 10;
        }
        @media (max-width: 768px) {
          .node-icon { width: 2rem; height: 2rem; }
        }

        .node-content {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 2rem;
          flex: 1;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .node-content:hover {
          transform: translateX(8px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
          border-color: #cbd5e1;
        }

        .ent-badge {
          display: inline-block;
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .ent-button {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ent-button:hover {
          background: #f1f5f9;
          color: ${brandColorPrimary};
          border-color: ${brandColorPrimary};
        }
        @media (max-width: 768px) {
          .prod-article-item { flex-direction: column-reverse !important; align-items: flex-start !important; }
          .prod-article-item > img { width: 100% !important; height: auto !important; aspect-ratio: 16/9; }
          .prod-podcast-item { flex-direction: column !important; align-items: flex-start !important; }
          .node-content { padding: 1.25rem !important; }
          .prod-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 1rem !important; }
        }
      `}</style>

      <TopicNavigation />

      {/* HERO SECTION */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '5rem 1rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ color: brandColorPrimary, fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.8rem', marginBottom: '1rem' }}>ENTERPRISE ARCHITECTURE</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem', letterSpacing: '-0.02em', lineHeight: 1.1, wordWrap: 'break-word', overflowWrap: 'break-word', width: '100%' }}>
            {data.titleHTML}
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', margin: '0 auto 3rem', lineHeight: 1.6, maxWidth: '700px' }}>
            {data.desc}
          </p>
          <button style={{ background: brandGradient, color: '#fff', border: 'none', padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(31,111,178,0.3)' }}>
            Initialize Pipeline
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 1rem' }}>
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>Deployment Pipeline</h2>
        
        {/* PIPELINE LAYOUT */}
        <div className="pipeline-container">
          
          {/* Node 1: Latest News */}
          <div className="pipeline-node">
            <div className="node-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandColorPrimary} strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M9 18l3-3-3-3"/></svg>
            </div>
            <div className="node-content">
              <span className="ent-badge">Phase 1: Discovery (News)</span>
              <div style={{ flex: '1 1 400px' }}>
              <SectionTitle title="Enterprise Deployments" subtitle="Case studies and architecture reviews" />
              <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {data.news.slice(0, 4).map((item, idx) => (
                  <div key={idx} style={{ borderLeft: `3px solid ${brandColorPrimary}`, paddingLeft: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem', lineHeight: 1.3, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <a href="#" className="hover-link">{item.title}</a>
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.author} • {item.date}</div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* Node 2: Articles */}
          <div className="pipeline-node">
            <div className="node-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandColorPrimary} strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <div className="node-content" style={{ background: '#ffffff' }}>
              <span className="ent-badge">Phase 2: Implementation (Articles)</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem' }}>Technical Deep Dives</h3>
              
              <div style={{ display: 'block', gap: '1.5rem' }}>
                {data.articles.map((item, idx) => (
                  <div key={idx} className="prod-article-item" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {item.image && <img src={item.image} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{item.category}</div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem', color: '#0f172a' }}>
                        <a href="#" className="hover-link">{item.title}</a>
                      </h4>
                    </div>
                    <button className="ent-button">Review Doc</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node 3: Presentations */}
          <div className="pipeline-node">
            <div className="node-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandColorPrimary} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            </div>
            <div className="node-content">
              <span className="ent-badge">Phase 3: Review (Presentations)</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem' }}>Case Studies & Video Briefings</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {data.presentations.map((item, idx) => (
                  <div key={idx} style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                       <img src={item.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem', color: '#0f172a' }}>
                      <a href="#" className="hover-link">{item.title}</a>
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.author}</span>
                      <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{item.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node 4: Guides */}
          <div className="pipeline-node">
            <div className="node-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandColorPrimary} strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div className="node-content" style={{ background: '#ffffff' }}>
              <span className="ent-badge">Phase 4: Standardization (Guides)</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem' }}>Essential Documentation</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {data.guides.map((item, idx) => (
                  <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: '0 0 0.5rem', color: '#0f172a', lineHeight: 1.3 }}>
                      <a href="#" className="hover-link">{item.title}</a>
                    </h4>
                    <button className="ent-button" style={{ width: '100%', marginTop: '1rem' }}>Download PDF</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node 5: Podcasts */}
          <div className="pipeline-node">
            <div className="node-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={brandColorPrimary} strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            </div>
            <div className="node-content">
              <span className="ent-badge">Phase 5: Sync (Podcasts)</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.5rem' }}>Architecture Audio Briefs</h3>
              
              <div style={{ display: 'block', gap: '1rem' }}>
                {data.podcasts.map((item, idx) => (
                  <div key={idx} className="prod-podcast-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#ffffff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                     <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <svg width="20" height="20" viewBox="0 0 24 24" fill={brandColorPrimary} stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                     </div>
                     <div style={{ flex: 1 }}>
                       <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0', color: '#0f172a' }}>
                         <a href="#" className="hover-link">{item.title}</a>
                       </h4>
                       <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.author}</div>
                     </div>
                     <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>{item.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. TOPICS DIRECTORY FOOTER */}
        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>Global Directory</h2>
          <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {data.topicColumns.map((col, idx) => (
              <div key={idx}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.title}</h4>
                <div style={{ display: 'block', gap: '0.8rem' }}>
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                      <a href="#" className="hover-link" style={{ color: '#475569' }}>{item}</a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: '5rem' }}></div>
      </div>
    </div>
  );
}
