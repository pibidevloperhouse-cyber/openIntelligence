import Link from 'next/link';
import { Suspense } from 'react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import ResourceCard from '@/components/ResourceCard';
import HomeHero from '@/components/home/HomeHero';
import { AboutSection, LearnSection, ContributeSection, ApplySection, EmpowerSection } from '@/components/home/HomeSections';
import HeroEventCard from '@/components/HeroEventCard';
import PastEventsPagination from '@/components/PastEventsPagination';
import BanAlert from '@/components/BanAlert';

export const revalidate = 60; // Ensure upcoming events move to past dynamically

async function getFeaturedResources() {
  try {
    const { data: resources, error } = await supabaseAdmin
      .from('resources')
      .select('*, resource_categories(category:categories(*)), contributor:users(username, avatar_url, bio), resource_tags(tag:tags(*))')
      .in('status', ['FEATURED', 'APPROVED'])
      .order('status', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;

    return (resources || [])
      .filter(r => !r.contributor || r.contributor.bio !== '__BANNED__')
      .map(r => ({
        ...r,
        categories: (r.resource_categories || []).map(rc => rc.category),
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
      .slice(0, 6);

    return { contributors };
  } catch (err) {
    console.error("Top contributors error:", err.message);
    return { contributors: [] };
  }
}

export const metadata = {
  title: 'PIBI Open Intelligence — Madurai AI Community',
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
    <div className="bg-white min-h-screen">
      <Suspense fallback={null}>
        <BanAlert />
      </Suspense>

      {/* ── HERO CAROUSEL ──────────────────────────────────── */}
      <HomeHero />

      {/* ── NEW CONTENT SECTIONS ───────────────────────────── */}
      <AboutSection />
      <LearnSection />
      <ContributeSection />
      <EmpowerSection />
      <ApplySection />


    </div>
  );
}