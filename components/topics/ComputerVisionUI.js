import TopicNavigation from './TopicNavigation';

export default function ComputerVisionUI({ data }) {
  const brandGradient = 'linear-gradient(135deg, #1f6fb2 0%, #2ec4b6 100%)';
  const brandColorPrimary = '#1f6fb2';

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const StatsDisplay = ({ views = 428, likes = 85, forks = 12, date = "2 days ago" }) => (
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
    <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
      <h2 className="cv-section-title" style={{ fontSize: '2rem', fontWeight: 800, color: '#18181b', margin: '0 0 0.5rem', letterSpacing: '-0.02em', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '1.1rem', color: '#71717a', margin: 0 }}>{subtitle}</p>}
    </div>
  );

  return (
    <div id="cv-theme" style={{ display: 'block', background: '#f4f4f5', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', color: '#18181b', fontFamily: 'var(--font-zoho), "Plus Jakarta Sans", "Inter", system-ui, sans-serif' }}>
      
      <style>{`

        .guide-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        #cv-theme .hover-link { white-space: normal !important; word-break: break-word !important; overflow-wrap: break-word !important; }
        #cv-theme .premium-card, #cv-theme .masonry-item, #cv-theme .h-scroll-item, #cv-theme .gallery-scroll-item { max-width: 100%; box-sizing: border-box; overflow: hidden; }
        #cv-theme { width: 100%; max-width: 100vw; overflow-x: hidden; }
  
        #cv-theme * { box-sizing: border-box; }
        
        #cv-theme .gradient-text {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        #cv-theme .hover-link {
          color: #18181b;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        #cv-theme .hover-link:hover {
          background: ${brandGradient};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
        }

        #cv-theme .cat-label {
          display: inline-block;
          background: rgba(31, 111, 178, 0.1);
          color: ${brandColorPrimary};
          padding: 0.3rem 0.8rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        /* Masonry Container */
        #cv-theme .masonry-grid {
          column-count: 3;
          column-gap: 1.5rem;
          padding: 1rem 0;
        }
        @media (max-width: 1024px) {
          #cv-theme .masonry-grid { column-count: 2; }
        }
        @media (max-width: 640px) {
          #cv-theme .masonry-grid { column-count: 1; }
        }

        /* Masonry Item */
        #cv-theme .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          position: relative;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
        }
        .masonry-item:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(31,111,178,0.15);
        }

        .masonry-img {
          width: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .masonry-item:hover .masonry-img {
          transform: scale(1.05);
        }

        #cv-theme .topic-stats-container {
          display: flex;
          align-items: center;
          flex-wrap: wrap; max-width: 100%; box-sizing: border-box;
          gap: 0.4rem;
          margin-top: 1rem;
          padding: 0.5rem;
          background: #f4f4f5;
          border-radius: 8px;
          border: 1px solid #e4e4e7;
          transition: all 0.3s;
        }
        #cv-theme .cv-card:hover .topic-stats-container {
          background: #ffffff;
          border-color: #d4d4d8;
        }
        #cv-theme .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #71717a;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        #cv-theme .stat-item:hover {
          background: linear-gradient(135deg, #1f6fb2, #2ec4b6);
          color: #ffffff;
        }
        #cv-theme .stat-item:hover svg {
          stroke: #ffffff;
        }
        #cv-theme .stat-date {
          margin-left: auto;
          font-size: 0.65rem;
          color: #a1a1aa;
          font-weight: 500;
          white-space: nowrap;
        }

        /* Horizontal Scroll specific for Gallery style */
        .gallery-h-scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding: 1rem 0;
          margin: 0 -1rem;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .gallery-h-scroll::-webkit-scrollbar { display: none; }
        .gallery-scroll-item {
          scroll-snap-align: start;
          min-width: 320px;
          flex: 0 0 320px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
        }

        /* Hero Image Gallery Style */
        .gallery-hero {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 400px;
          display: flex;
          align-items: flex-end;
          padding: 4rem 1rem;
          overflow: hidden;
        }
        .gallery-hero-bg {
          position: absolute;
          inset: 0;
          background-image: url(${data.presentations[0]?.image});
          background-size: cover;
          background-position: center;
          filter: blur(10px) brightness(0.6);
          transform: scale(1.1);
        }
        @media (max-width: 768px) {

          .guide-img { aspect-ratio: 16/9 !important; }
          .bento-large-title { white-space: normal !important; }
          #cv-theme .cv-section-title, #cv-theme .ds-section-title, #cv-theme .hw-section-title { white-space: normal !important; word-break: break-word !important; }
  

          
          
          
      
          .gallery-scroll-item { min-width: 80vw !important; flex: 0 0 80vw !important; }
          .cv-grid-articles { grid-template-columns: minmax(0, 1fr) !important; }
          .gallery-hero { min-height: 300px !important; padding: 2rem 1rem !important; }
          .cv-podcast-card { flex-direction: column !important; align-items: flex-start !important; }
          .cv-podcast-card > div:first-child { width: 100% !important; height: 160px !important; }
          .cv-section { margin-top: 2rem !important; margin-bottom: 2rem !important; }
          .cv-card-padding { padding: 1rem !important; }
          .cv-section-title { font-size: 1.5rem !important; }
        }
      `}</style>

      <TopicNavigation />

      {/* HERO GALLERY SECTION */}
      <div className="gallery-hero">
        <div className="gallery-hero-bg"></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #18181b 0%, transparent 100%)' }}></div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.4rem 0.8rem', borderRadius: '99px', color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ec4b6' }}></div>
                VISUAL GALLERY
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem', letterSpacing: '-0.02em', lineHeight: 1.1, wordWrap: 'break-word', overflowWrap: 'break-word', width: '100%' }}>
                {data.titleHTML}
              </h1>
              <p style={{ fontSize: '1.1rem', color: '#a1a1aa', margin: '0', lineHeight: 1.6 }}>
                {data.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1rem' }}>
        
        {/* 1. VISUAL NEWS (Masonry) */}
        <div className="cv-section" style={{ marginTop: '5rem', marginBottom: '5rem' }}>
          <SectionTitle title="Visual Intelligence News" subtitle="Breakthroughs in models and edge computing" />
          <div className="masonry-grid">
            {data.news.map((item, idx) => (
              <div key={idx} className="masonry-item cv-card-padding" style={{ padding: '2rem' }}>
                <span className="cat-label">{item.category}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0 1.5rem', lineHeight: 1.4, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <a href="#" className="hover-link">{item.title}</a>
                </h3>
                <div style={{ display: 'block', gap: '0.5rem', marginTop: 'auto' }}>
                  <span style={{ color: '#71717a', fontSize: '0.85rem', fontWeight: 600 }}>{item.author} • {item.date}</span>
                  <StatsDisplay date={item.date || "Updated recently"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. GALLERY PRESENTATIONS */}
        <div className="cv-section" style={{ marginBottom: '5rem' }}>
          <SectionTitle title="Gallery Presentations" subtitle="Watch visual breakdowns of architectures." />
          <div className="gallery-h-scroll">
            {data.presentations.map((item, idx) => (
              <div key={idx} className="gallery-scroll-item cv-card-padding" style={{ background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '1.5rem' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '60%' }}>
                  <img src={item.image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }}></div>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  </div>
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(24,24,27,0.8)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                    {item.duration}
                  </div>
                </div>
                <div style={{ padding: '1.5rem 0 0' }}>
                  <span className="cat-label">{item.category}</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.4 }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div style={{ color: '#71717a', fontSize: '0.9rem', fontWeight: 600 }}>{item.author}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. IN-DEPTH ARTICLES (Visual Focus) */}
        <div className="cv-section" style={{ marginBottom: '5rem' }}>
          <SectionTitle title="Architecture Guides" subtitle="Detailed technical explorations." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }} className="cv-grid-articles">
            {data.articles.map((item, idx) => (
              <div key={idx} className="masonry-item" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '250px', overflow: 'hidden' }}>
                  <img src={item.image} className="masonry-img" style={{ height: '100%' }} />
                </div>
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span className="cat-label">{item.category}</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.5rem 0 1rem', lineHeight: 1.3 }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div style={{ color: '#71717a', fontSize: '0.9rem', fontWeight: 600, marginTop: 'auto', marginBottom: '1.5rem' }}>{item.author} • {item.date}</div>
                  <StatsDisplay date={item.date || "Updated recently"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. PODCASTS */}
        <div className="cv-section" style={{ marginBottom: '5rem' }}>
          <SectionTitle title="Vision Audio Sessions" subtitle="Listen to visual experts." />
          <div style={{ display: 'block', gap: '1.5rem' }}>
            {data.podcasts.map((item, idx) => (
              <div key={idx} className="masonry-item cv-podcast-card cv-card-padding" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden' }}>
                  <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(31,111,178,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1"><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  </div>
                </div>
                <div>
                  <span className="cat-label" style={{ marginBottom: '0.25rem' }}>{item.category}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                    <a href="#" className="hover-link">{item.title}</a>
                  </h3>
                  <div style={{ color: '#71717a', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.author}</div>
                  <div style={{ display: 'inline-block', background: '#f4f4f5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>{item.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. TOPICS DIRECTORY FOOTER */}
        <div style={{ paddingBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {data.topicColumns.map((col, idx) => (
              <div key={idx} className="masonry-item" style={{ padding: '0', background: 'transparent', boxShadow: 'none' }}>
                <div style={{ padding: '1rem', borderBottom: '2px solid #e4e4e7' }}>
                  <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: '#18181b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.title}</h4>
                </div>
                <div style={{ padding: '1rem', display: 'block', gap: '0.8rem' }}>
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
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
