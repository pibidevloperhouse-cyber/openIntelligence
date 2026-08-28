import Link from 'next/link';
import TopicNavigation from './TopicNavigation';

export default function DataScienceUI({ data }) {
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';
  const brandColorPrimary = '#1f6fb2';

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const StatsDisplay = ({ views = Math.floor(Math.random() * 500) + 100, likes = Math.floor(Math.random() * 100) + 20, forks = Math.floor(Math.random() * 30), date = "2 days ago" }) => (
    <div className="topic-stats-container">
      <div className="stat-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        <span>{formatNumber(views)}</span>
      </div>
      <div className="stat-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
        <span>{formatNumber(likes)}</span>
      </div>
      <div className="stat-item">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        <span>{formatNumber(forks)}</span>
      </div>
      <div className="stat-date">{date}</div>
    </div>
  );

  const SectionTitle = ({ title, subtitle }) => (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>{subtitle}</p>}
    </div>
  );

  return (
    <div id="ds-theme" style={{ display: 'flex', flexDirection: 'column', background: '#f8fafc', minHeight: '100vh', width: '100%', color: '#0f172a', fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      
      <style>{`
        /* Global & Reset */
        * { box-sizing: border-box; }
        
        /* Typography */
        .gradient-text {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Hover Link Effect (Text Only) */
        .hover-link {
          color: #0f172a;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .hover-link:hover {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
        }

        /* Category Label */
        .cat-label {
          display: inline-block;
          background: rgba(31, 111, 178, 0.1);
          color: ${brandColorPrimary};
          padding: 0.3rem 0.8rem;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        /* Premium Cards */
        #ds-theme .premium-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.04);
          border: 1px solid #e2e8f0;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        #ds-theme .premium-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(31,111,178,0.15);
          border-color: #cbd5e1;
        }

        /* Buttons */
        #ds-theme .topic-stats-container {
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
        #ds-theme .premium-card:hover .topic-stats-container {
          background: #ffffff;
          border-color: #cbd5e1;
        }
        #ds-theme .stat-item {
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
        #ds-theme .stat-item:hover {
          background: linear-gradient(135deg, #1f6fb2, #2ec4b6);
          color: #ffffff;
        }
        #ds-theme .stat-item:hover svg {
          stroke: #ffffff;
        }
        #ds-theme .stat-date {
          margin-left: auto;
          font-size: 0.65rem;
          color: #94a3b8;
          font-weight: 500;
          white-space: nowrap;
        }

        .more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #ffffff;
          color: ${brandColorPrimary};
          border: 2px solid ${brandColorPrimary};
          padding: 0.8rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.3s;
          margin: 3rem auto;
        }
        .more-btn:hover {
          background: ${brandGradient};
          color: white;
          border-color: transparent;
          transform: scale(1.05);
        }

        /* Horizontal Scroll Containers */
        .h-scroll {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          padding: 1rem 0 3rem 1rem;
          margin: 0 -1rem;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .h-scroll::-webkit-scrollbar { display: none; }
        .h-scroll-item {
          scroll-snap-align: start;
          min-width: 320px;
          max-width: 350px;
          flex-shrink: 0;
        }

        /* Bento Grid */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .bento-large {
          grid-column: span 2;
          grid-row: span 2;
        }
        @media (max-width: 900px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-large { grid-column: span 1; grid-row: span 1; }
        }
      `}</style>

      <TopicNavigation />

      {/* 1. HERO SECTION */}
      <div style={{ position: 'relative', background: '#0f172a', padding: '6rem 1rem 8rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '100%', background: brandGradient, filter: 'blur(150px)', opacity: 0.4, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '40%', height: '80%', background: '#2ec4b6', filter: 'blur(150px)', opacity: 0.3, borderRadius: '50%' }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '99px', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle></svg>
            OPENINTELLIGENCE TOPIC
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, color: '#ffffff', margin: '0 0 1.5rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {data.titleHTML}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 0 2.5rem', lineHeight: 1.6 }}>
            {data.desc}
          </p>
          <button style={{ background: brandGradient, color: '#fff', border: 'none', padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: '99px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(31,111,178,0.3)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Follow Topic
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-4rem auto 0', position: 'relative', zIndex: 20, padding: '0 1rem' }}>
        
        {/* 2. BENTO GRID */}
        <div style={{ marginBottom: '5rem' }}>
          <div className="bento-grid">
            <div className="premium-card bento-large">
              <div style={{ position: 'relative', width: '100%', height: '350px' }}>
                <img src={data.articles[0]?.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)' }}></div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '2.5rem', width: '100%' }}>
                  <span className="cat-label" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(5px)' }}>FEATURED NEWS</span>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem', lineHeight: 1.2 }}>
                    <a href="#" className="hover-link" style={{ color: '#fff' }}>{data.news[0]?.title}</a>
                  </h3>
                  <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>{data.news[0]?.author} • {data.news[0]?.date}</div>
                </div>
              </div>
            </div>

            {data.news.slice(1, 3).map((item, idx) => (
              <div key={idx} className="premium-card" style={{ padding: '2rem' }}>
                <span className="cat-label">{item.category}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.4 }}>
                  <a href="#" className="hover-link">{item.title}</a>
                </h3>
                <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginTop: 'auto', marginBottom: '1.5rem' }}>{item.author} • {item.date}</div>
                <StatsDisplay date={item.date || "Updated recently"} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. PRESENTATIONS */}
        <SectionTitle title="Latest Presentations" subtitle="Watch industry leaders discuss AI architectures." />
        <div className="h-scroll">
          {data.presentations.map((item, idx) => (
            <div key={idx} className="premium-card h-scroll-item">
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                <img src={item.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                </div>
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(15,23,42,0.8)', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                  {item.duration}
                </div>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span className="cat-label">{item.category}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.4 }}>
                  <a href="#" className="hover-link">{item.title}</a>
                </h3>
                <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginTop: 'auto', marginBottom: '1.5rem' }}>{item.author}</div>
                <StatsDisplay date={item.date || "Updated recently"} />
              </div>
            </div>
          ))}
        </div>
        
        {/* 4. GUIDES */}
        <div style={{ marginTop: '2rem' }}>
          <SectionTitle title="Essential Guides" subtitle="Deep dive into comprehensive technical reports." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
            {data.guides.map((item, idx) => (
              <div key={idx} className="premium-card" style={{ padding: '1.5rem' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.4 }}>
                  <a href="#" className="hover-link">{item.title}</a>
                </h3>
                <div style={{ marginTop: 'auto' }}><StatsDisplay date={item.date || "Updated recently"} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ARTICLES */}
        <div style={{ marginTop: '5rem' }}>
          <SectionTitle title="In-Depth Articles" subtitle="Technical explorations and tutorials." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {data.articles.map((item, idx) => (
              <div key={idx} className="premium-card" style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span className="cat-label">{item.category}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.3 }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginTop: 'auto', marginBottom: '1.5rem' }}>{item.author} • {item.date}</div>
                  <StatsDisplay date={item.date || "Updated recently"} />
                </div>
                <div style={{ width: '35%', position: 'relative' }}>
                  <img src={item.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 6. PODCASTS */}
        <div style={{ marginTop: '5rem' }}>
          <SectionTitle title="Featured Podcasts" subtitle="Listen to discussions with industry experts." />
          <div className="h-scroll">
            {data.podcasts.map((item, idx) => (
              <div key={idx} className="premium-card h-scroll-item">
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                  <img src={item.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                  </div>
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(15,23,42,0.8)', color: '#fff', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                    {item.duration}
                  </div>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span className="cat-label">{item.category}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.4 }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginTop: 'auto', marginBottom: '1.5rem' }}>{item.author}</div>
                  <StatsDisplay date={item.date || "Updated recently"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="more-btn">Explore All Topics</button>
        </div>
        <div style={{ height: '5rem' }}></div>

        {/* 7. TOPICS DIRECTORY FOOTER */}
        <div style={{ paddingBottom: '5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {data.topicColumns.map((col, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)', transition: 'transform 0.3s' }}
                   onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                
                <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.title}</h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
                
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.4, paddingBottom: '1rem', borderBottom: itemIdx !== col.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <a href="#" className="hover-link">{item}</a>
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
