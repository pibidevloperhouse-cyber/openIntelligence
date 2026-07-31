import Link from 'next/link';
import { Suspense } from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import ResourceCard from '@/components/ResourceCard';
import MeetingCard from '@/components/MeetingCard';
import WaveHero from '@/components/WaveHero';
import HeroEventCard from '@/components/HeroEventCard';
import PastEventsPagination from '@/components/PastEventsPagination';
import BanAlert from '@/components/BanAlert';
import ExploreSection from '@/components/ExploreSection';

export const revalidate = 60; // Ensure upcoming events move to past dynamically

async function getFeaturedResources() {
  try {
    const { data: resources, error } = await supabaseAdmin
      .from('resources')
      .select('*, category:categories(*), contributor:users(username, avatar_url, bio), resource_tags(tag:tags(*))')
      .in('status', ['FEATURED', 'APPROVED'])
      .order('status', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;

    return (resources || [])
      .filter(r => !r.contributor || r.contributor.bio !== '__BANNED__')
      .map(r => ({
        ...r,
        tags: r.resource_tags || []
      }));
  } catch (err) {
    console.error("HOME PAGE DB ERROR:", err.message);
    return [];
  }
}

async function getUpcomingMeetings() {
  try {
    const { data, error } = await supabaseAdmin
      .from('meetings')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true })
      .limit(2);
    if (error) throw error;
    return (data || []).map(m => ({ ...m, date: m.date.endsWith('Z') ? m.date : m.date + 'Z' }));
  } catch { return []; }
}

async function getPastMeetings() {
  try {
    const { data, count, error } = await supabaseAdmin
      .from('meetings')
      .select('*', { count: 'exact' })
      .lt('date', new Date().toISOString())
      .order('date', { ascending: false })
      .limit(5);
    if (error) throw error;
    const formattedData = (data || []).map(m => ({ ...m, date: m.date.endsWith('Z') ? m.date : m.date + 'Z' }));
    return { data: formattedData, totalCount: count || 0 };
  } catch { return { data: [], totalCount: 0 }; }
}

async function getTopContributors() {
  try {
    const { data: resources, error: resError } = await supabaseAdmin
      .from('resources')
      .select('contributor:users(id, username, avatar_url, bio)')
      .in('status', ['APPROVED', 'FEATURED']);

    if (resError) throw resError;

    if (!resources || resources.length === 0) return { contributors: [] };

    const userMap = {};
    const counts = {};

    for (const r of resources) {
      const u = r.contributor;
      if (u && u.bio !== '__BANNED__') {
        counts[u.id] = (counts[u.id] || 0) + 1;
        if (!userMap[u.id]) userMap[u.id] = u;
      }
    }

    const contributors = Object.entries(counts)
      .map(([id, count]) => {
        const u = userMap[id];
        return {
          login: u.username || 'Anonymous',
          avatar_url: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || 'User')}&background=3b82f6&color=fff`,
          profile_url: u.username ? `https://github.com/${u.username}` : '#',
          resource_count: count,
        };
      })
      .sort((a, b) => b.resource_count - a.resource_count)
      .slice(0, 5);

    return { contributors };
  } catch (err) {
    console.error("Top contributors error:", err.message);
    return { contributors: [] };
  }
}

export const metadata = {
  title: 'Open Intelligence Hub — Madurai AI Community',
  description: 'Discover, submit, and showcase open-source AI resources. Built by PiBi Foundation for the Madurai AI Community.',
};

export default async function HomePage() {
  const [featuredResources, upcomingMeetings, { data: pastMeetings, totalCount: totalPastMeetingsCount }, { contributors: topContributors }] = await Promise.all([
    getFeaturedResources(),
    getUpcomingMeetings(),
    getPastMeetings(),
    getTopContributors(),
  ]);

  let carouselCSS = '';
  // Removed past events carousel CSS

  return (
    <>
      <style>{`
        ${carouselCSS}
        
        /* 🤍 CLEAN WHITE CONTAINER STYLING */
        .white-container {
          background: #ffffff;
          color: #0f172a;
          padding-top: 1rem;
          padding-bottom: 2rem;
        }

        /* ✨ TEXT GRADIENT */
        .clean-blue-text {
          background: linear-gradient(135deg, #1f6fb2, #2ec4b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        /* 🤍 CLEAN WHITE CARDS WITH LIGHT BLUE BORDERS */
        .white-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.04);
        }
        .white-card:hover {
          transform: translateY(-4px);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 15px 30px -10px rgba(59, 130, 246, 0.15);
        }

        .rank-card-1 {
          background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
          border: 1px solid rgba(59, 130, 246, 0.35);
          box-shadow: 0 12px 32px -8px rgba(59, 130, 246, 0.18);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .rank-card-1:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px -8px rgba(59, 130, 246, 0.25);
          border-color: rgba(59, 130, 246, 0.6);
        }
      `}</style>

      <Suspense fallback={null}>
        <BanAlert />
      </Suspense>

      {/* ── HERO — Wave Design ──────────────────────────────────── */}
      <WaveHero />

      {/* 🤍 UPCOMING-ல் இருந்து WHY CONTRIBUTIONS MATTERS வரை CLEAN WHITE CONTAINER 🤍 */}
      <div className="white-container">

        {/* ── UPCOMING EVENTS ───────────────────────── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', position: 'relative' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '650px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.3rem 0.9rem', borderRadius: '30px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ⚡ Live Learning Sessions
              </div>
              <h2 className="clean-blue-text" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                Upcoming Community Sessions
              </h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                Join live tech talks, workshops, and AI developer meetups hosted by Madurai AI Community.
              </p>
            </div>

            {upcomingMeetings.length > 0 ? (
              <div style={{ width: '100%', maxWidth: '950px', display: 'grid', gap: '1.75rem', gridTemplateColumns: '1fr' }}>
                {upcomingMeetings.slice(0, 1).map((m) => (
                  <HeroEventCard key={m.id} meeting={m} />
                ))}
              </div>
            ) : (
              <div style={{ width: '100%', maxWidth: '600px', padding: '3.5rem 2rem', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #E7E5E4', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗓️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1c1917', marginBottom: '0.5rem' }}>No upcoming events scheduled</h3>
                <p style={{ color: '#78716c', margin: 0 }}>Check back later for our next live community session.</p>
              </div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <Link href="/meetings" className="btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', borderRadius: '14px', color: '#ffffff' }}>
                Explore All Events &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── PAST EVENTS LIST ───────────────────────────────────────── */}
        {pastMeetings.length > 0 && (
          <section style={{ padding: '3rem 0 5rem', position: 'relative', overflow: 'hidden' }}>
            <div className="container" style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <h3 className="clean-blue-text" style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' }}>
                Past Community Events
              </h3>
              <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '0.4rem' }}>See what we've been up to recently</p>
            </div>

            <PastEventsPagination pastMeetings={pastMeetings} totalCount={totalPastMeetingsCount} />
          </section>
        )}

        {/* ── CATEGORIES ─────────────────────────── */}
        <ExploreSection />

        {/* ── HERO TEXT & FEATURED RESOURCES ─────────────────────── */}
        <section className="section" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
          <div className="container">
            <div className="animate-fade-up" style={{ maxWidth: '800px', marginBottom: '4rem', textAlign: 'left' }}>
              <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                MADURAI AI COMMUNITY &middot; PIBI FOUNDATION
              </div>
              <h2 className="clean-blue-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
                The community-curated<br />home for open-source AI.
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '750px' }}>
                Datasets, GitHub projects, prompt libraries, MCP servers, RAG templates and workflows &mdash; all crowdsourced, reviewed and organised by the Madurai AI community.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/resources" className="btn-primary" style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem', color: '#fff' }}>
                  Browse resources &rarr;
                </Link>
                <Link href="/submit" className="btn-outline" style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem', background: '#ffffff', borderColor: '#cbd5e1', color: '#1e40af' }}>
                  Submit a resource
                </Link>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'var(--font-display)' }}>
                Featured resources
              </h3>
              <Link href="/resources" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>
                View all &rarr;
              </Link>
            </div>

            {featuredResources.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: '1.5rem',
              }}>
                {featuredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} variant="minimal" />
                ))}
              </div>
            ) : (
              <div className="white-card" style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                  Be the First Contributor!
                </h3>
                <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                  The Madurai AI Community is just getting started. Submit the first open-source AI resource.
                </p>
                <Link href="/submit" className="btn-primary" style={{ padding: '0.85rem 2rem', borderRadius: '12px' }}>
                  + Submit a Resource
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── CONTRIBUTORS LEADERBOARD ───────────────────────────── */}
        {topContributors.length > 0 && (
          <section className="section" style={{ padding: '5rem 1rem', position: 'relative' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 className="clean-blue-text" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 900, fontFamily: 'var(--font-display)', margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
                  Community Contributors
                </h2>
                <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>
                  People powering the Open Intelligence Hub with AI resources
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topContributors.map((c, idx) => (
                  <a
                    key={c.login}
                    href={c.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div className={idx === 0 ? "rank-card-1" : "white-card"} style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                    }}>
                      {/* Rank Badge */}
                      <div style={{
                        minWidth: 40, height: 40, borderRadius: '50%',
                        background: idx === 0 ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
                        color: idx === 0 ? '#ffffff' : '#64748b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem', fontWeight: 900,
                        flexShrink: 0,
                        border: idx === 0 ? 'none' : '1px solid #e2e8f0'
                      }}>
                        #{idx + 1}
                      </div>

                      {/* Avatar */}
                      <img
                        src={c.avatar_url}
                        alt={c.login}
                        width={48} height={48}
                        style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                      />

                      {/* Contributor Info */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                        <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-display)' }}>
                          {c.login}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>@{c.login}</div>
                      </div>

                      {/* Count Badge */}
                      <div>
                        <span style={{
                          padding: '0.4rem 0.9rem',
                          background: 'rgba(59, 130, 246, 0.08)',
                          color: '#2563eb',
                          border: '1px solid rgba(59, 130, 246, 0.18)',
                          borderRadius: '30px', fontSize: '0.8rem', fontWeight: 800,
                          display: 'inline-flex', alignItems: 'center', gap: '6px'
                        }}>
                          📦 {c.resource_count} resource{c.resource_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── WHY CONTRIBUTIONS MATTER BANNER ─────────────────────── */}
        <section className="section" style={{ padding: '4rem 1rem 5rem', position: 'relative' }}>
          <div className="container" style={{ maxWidth: '840px' }}>
            <div className="white-card" style={{
              position: 'relative',
              padding: '3.5rem 2.5rem',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,247,255,0.9) 50%, rgba(224,242,254,0.85) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              boxShadow: '0 20px 50px -12px rgba(37, 99, 235, 0.12)',
              textAlign: 'center',
              overflow: 'hidden',
            }}>
              {/* Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  padding: '1.1rem', borderRadius: '20px',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h2 className="clean-blue-text" style={{
                fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                marginBottom: '1.25rem',
                letterSpacing: '-0.03em',
                position: 'relative', zIndex: 1,
              }}>
                Why Contributions Matter
              </h2>

              {/* Text */}
              <p style={{
                color: '#475569',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '650px',
                margin: '0 auto 2.5rem',
                position: 'relative', zIndex: 1,
              }}>
                A single open-source dataset can unlock a breakthrough for a researcher. A well-crafted GitHub repo can save a startup weeks of engineering. Build the foundation others rely on.
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                <Link href="/submit" className="btn-primary" style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.05rem',
                  borderRadius: '16px',
                }}>
                  ✦ Submit a Resource
                </Link>
                <Link href="/resources" className="btn-outline" style={{
                  padding: '0.9rem 2.25rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '14px',
                  color: '#1e40af',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.04)',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}>
                  Explore the Hub &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}