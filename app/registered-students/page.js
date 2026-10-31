'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SubmitProjectModal } from '@/components/student-showcase/components/SubmitProjectModal';
import DigitalBadge, { generateBadgePng } from '@/components/student-showcase/components/DigitalBadge';
import confetti from 'canvas-confetti';
import {
  KeyRound,
  ShieldCheck,
  Download,
  Users,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Check,
  Copy,
  AlertCircle,
  MessageCircle,
  X,
  ExternalLink,
} from 'lucide-react';

const LinkedInIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

// Helper to format names with capital letters
function formatName(name) {
  if (!name) return 'Student Innovator';
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Helper to format institution names
function formatInstitution(name) {
  if (!name) return 'Engineering College';
  const lower = name.toLowerCase().trim();
  if (lower === 'kln' || lower === 'klnce') return 'KLN College of Engineering';
  if (lower === 'tce') return 'Thiagarajar College of Engineering';
  if (lower === 'psg') return 'PSG College of Technology';
  if (lower === 'cit') return 'Coimbatore Institute of Technology';
  if (lower === 'anna') return 'Anna University';
  if (lower === 'iitm' || lower === 'iit madras') return 'IIT Madras';
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Helper to extract clean YouTube embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('sample-demo') || url.includes('example.com') || url.includes('sample')) return null;
  try {
    const watchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1] && watchMatch[1] !== 'sample-demo') {
      return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=0&rel=0`;
    }
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0`;
    }
  } catch {}
  return null;
}

// Helper to detect direct video file uploaded to Supabase or other storage
function isDirectVideoFile(url) {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    url.includes('/storage/v1/object/public/')
  );
}

export default function RegisteredStudentsPage() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalInnovators: 0,
    uniqueColleges: 0,
    uniqueDomains: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [sortBy, setSortBy] = useState('latest'); // 'latest' | 'alpha' | 'college'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [inspectProject, setInspectProject] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Badge Access Modal State
  const [badgeModalProject, setBadgeModalProject] = useState(null);
  const [badgePin, setBadgePin] = useState('');
  const [badgeLoading, setBadgeLoading] = useState(false);
  const [badgeError, setBadgeError] = useState('');
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [badgeSelectedMember, setBadgeSelectedMember] = useState('');
  const [badgeDownloading, setBadgeDownloading] = useState(false);
  const [badgeDownloadSuccess, setBadgeDownloadSuccess] = useState(false);
  const [badgeLinkedInOpened, setBadgeLinkedInOpened] = useState(false);
  const [badgeCustomId, setBadgeCustomId] = useState('');
  const [badgeCopiedLink, setBadgeCopiedLink] = useState(false);

  // Top 10 button toggle state controlled via Admin panel
  const [isTop10Active, setIsTop10Active] = useState(false);

  // Check URL query param or hash for ?submit=true or ?regId=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('submit') === 'true' || window.location.hash === '#submit') {
        setIsSubmitModalOpen(true);
      }
      const regIdParam = params.get('regId') || params.get('badge');
      if (regIdParam) {
        setSearchTerm(regIdParam);
        setBadgeModalProject({
          registration_id: regIdParam,
          title: 'Registered Innovation Project',
          lead_student: 'Student Innovator',
        });
        setBadgeCustomId(regIdParam);
      }
    }
  }, []);

  useEffect(() => {
    fetch('/api/student-projects/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isTop10Active === 'boolean') {
          setIsTop10Active(data.isTop10Active);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch registered student projects
  const fetchRegistered = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student-projects/registered');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load registered student projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistered();

    // Live sync: As new student teams register and join, automatically update the count
    const interval = setInterval(() => {
      fetch('/api/student-projects/registered')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.projects)) {
            setProjects(data.projects);
            if (data.stats) setStats(data.stats);
          }
        })
        .catch(() => {});
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Sync full project data into badgeModalProject once projects load
  useEffect(() => {
    if (projects.length > 0 && badgeModalProject?.registration_id && !badgeModalProject.id) {
      const found = projects.find(
        (p) => (p.registration_id || '').toLowerCase() === badgeModalProject.registration_id.toLowerCase()
      );
      if (found) {
        setBadgeModalProject(found);
      }
    }
  }, [projects, badgeModalProject]);

  const handleOpenBadgeModal = (project) => {
    const proj = project || { registration_id: '', title: 'Student Project' };
    setBadgeModalProject(proj);
    setBadgePin('');
    setBadgeError('');
    setUnlockedBadge(null);
    setBadgeSelectedMember(proj?.lead_student || '');
    setBadgeLinkedInOpened(false);
    setBadgeCustomId(proj?.registration_id || '');
  };

  const handleVerifyBadgePin = async (e) => {
    if (e) e.preventDefault();
    const targetRegId = (badgeModalProject?.registration_id || badgeCustomId || '').trim();
    if (!targetRegId) {
      setBadgeError('Please enter your Registration ID or Registered Email.');
      return;
    }
    if (!badgePin || badgePin.trim().length < 4) {
      setBadgeError('Please enter your 4-digit Security PIN sent to your email.');
      return;
    }

    setBadgeLoading(true);
    setBadgeError('');

    try {
      const res = await fetch('/api/student-projects/badge/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: targetRegId,
          pin: badgePin.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBadgeError(data.error || 'Incorrect 4-digit Security PIN. Please check your confirmation email.');
        return;
      }

      setUnlockedBadge(data.badge);
      setBadgeSelectedMember(data.badge.studentName || badgeModalProject?.lead_student || '');

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#1f6fb2', '#2ec4b6', '#38bdf8', '#10b981', '#f59e0b'],
      });
    } catch (err) {
      setBadgeError('Unable to connect to verification server. Please try again.');
    } finally {
      setBadgeLoading(false);
    }
  };

  const currentBadgeInnovator = badgeSelectedMember || unlockedBadge?.studentName || badgeModalProject?.lead_student || 'Student Innovator';
  const badgeTeamMembers = Array.from(new Set([
    unlockedBadge?.studentName || badgeModalProject?.lead_student,
    ...(Array.isArray(unlockedBadge?.teamMembers) ? unlockedBadge.teamMembers : Array.isArray(badgeModalProject?.team_members) ? badgeModalProject.team_members : [])
  ].map(m => String(m || '').trim()).filter(Boolean)));

  const badgeRegistrationId = unlockedBadge?.registrationId || badgeModalProject?.registration_id;
  const isMemberSelected = badgeSelectedMember && badgeSelectedMember !== (unlockedBadge?.studentName || badgeModalProject?.lead_student);
  const badgePublicUrl = badgeRegistrationId
    ? `https://www.pibiopenintelligence.com/students/badge/${encodeURIComponent(badgeRegistrationId)}?v=2026${isMemberSelected ? `&member=${encodeURIComponent(badgeSelectedMember)}` : ''}`
    : 'https://www.pibiopenintelligence.com/registered-students';

  const badgeLinkedInPostText = `🚀 I've taken a step beyond the classroom!

I've registered our AI/ML project "${unlockedBadge?.projectTitle || badgeModalProject?.title || 'AI/ML Project'}" for the **PiBi Open Intelligence Student Project Awards 2026**!

I believe student projects shouldn't end with a final-year presentation. They should be shared, improved, and developed further.

Proud to be recognized as an Open Intelligence Builder!

🔗 View my Official Builder Badge: ${badgePublicUrl}

#PiBiOpenIntelligence #StudentProjects #ArtificialIntelligence #MachineLearning #LearnBuildContribute`;

  const handleDownloadBadgeFromModal = async () => {
    if (!unlockedBadge) return;
    setBadgeDownloading(true);
    try {
      await generateBadgePng({
        studentName: currentBadgeInnovator,
        projectTitle: unlockedBadge.projectTitle || badgeModalProject?.title,
        registrationId: unlockedBadge.registrationId || badgeModalProject?.registration_id,
        institution: unlockedBadge.institution || badgeModalProject?.institution,
        domain: unlockedBadge.domain || badgeModalProject?.domain,
        dept: unlockedBadge.dept || badgeModalProject?.dept,
        year: unlockedBadge.year || badgeModalProject?.year,
      });
      setBadgeDownloadSuccess(true);
      setTimeout(() => setBadgeDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setBadgeDownloading(false);
    }
  };

  const handleShareBadgeLinkedIn = async () => {
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(badgeLinkedInPostText);
      } catch (e) {}
    }
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(badgeLinkedInPostText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setBadgeLinkedInOpened(true);
    setTimeout(() => setBadgeLinkedInOpened(false), 8000);
  };

  // Lock body scroll when modal is active
  useEffect(() => {
    if (inspectProject || badgeModalProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setInspectProject(null);
        setBadgeModalProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspectProject, badgeModalProject]);

  // Live registration statistics computed from projects and API
  const displayStats = useMemo(() => {
    let innovatorsCount = 0;
    const colleges = new Set();
    const domains = new Set();

    projects.forEach((p) => {
      if (Array.isArray(p.team_members) && p.team_members.length > 0) {
        innovatorsCount += p.team_members.length;
      } else {
        innovatorsCount += 1;
      }
      if (p.institution) colleges.add(p.institution.trim().toLowerCase());
      const dom = p.domain || p.category;
      if (dom) {
        dom.split(',').forEach((d) => {
          const trimmed = d.trim().toLowerCase();
          if (trimmed) domains.add(trimmed);
        });
      }
    });

    return {
      totalInnovators: stats.totalInnovators || innovatorsCount,
      totalProjects: stats.totalProjects || projects.length,
      uniqueColleges: stats.uniqueColleges || colleges.size,
      uniqueDomains: stats.uniqueDomains || domains.size,
    };
  }, [projects, stats]);

  // Unique domains available for filtering
  const availableDomains = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      const d = p.domain || p.category;
      if (d) {
        d.split(',').forEach((sub) => {
          const trimmed = sub.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set).sort();
  }, [projects]);

  // Clean list sorted by latest submission with search and domain filtering
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((p) => {
        const title = (p.title || '').toLowerCase();
        const lead = (p.lead_student || '').toLowerCase();
        const inst = (p.institution || '').toLowerCase();
        const reg = (p.registration_id || '').toLowerCase();
        const city = (p.city || '').toLowerCase();
        const dept = (p.dept || '').toLowerCase();
        const members = Array.isArray(p.team_members)
          ? p.team_members.map((m) => (typeof m === 'string' ? m : m.name || '')).join(' ').toLowerCase()
          : '';
        return (
          title.includes(q) ||
          lead.includes(q) ||
          inst.includes(q) ||
          reg.includes(q) ||
          city.includes(q) ||
          dept.includes(q) ||
          members.includes(q)
        );
      });
    }

    if (selectedDomain && selectedDomain !== 'ALL') {
      list = list.filter((p) => {
        const dom = (p.domain || p.category || '').toLowerCase();
        return dom.includes(selectedDomain.toLowerCase());
      });
    }

    return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [projects, searchTerm, selectedDomain]);

  const handleCopyShareLink = (projectId) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/registered-students?project=${projectId}`;
      navigator.clipboard.writeText(url);
      setCopiedId(projectId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-[#2ec4b6]/20 selection:text-[#1f6fb2] w-full max-w-full overflow-x-hidden">
      <main className="flex-1 pt-5 sm:pt-8 pb-16 sm:pb-20 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-w-0">
        {/* ─── HERO HEADER BANNER ────────────────────────────────────────── */}
        <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-8 mb-5 sm:mb-6 overflow-hidden w-full min-w-0">
          {/* Top Brand Blue & Cyan Gradient Stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            <div className="max-w-2xl min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Registered Student Innovators
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-[#1f6fb2]/10 text-[#1f6fb2] border border-[#1f6fb2]/20 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{loading ? '...' : (projects.length || displayStats.totalProjects || 0)} Registered Teams</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Meet all the registered student innovators, co-engineering teams, and collegiate prototypes participating in the 2026 National Innovation Showcase.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:opacity-95 hover:scale-[1.02] active:scale-95 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                <span>➕ Submit Your Project</span>
              </button>

              {isTop10Active && (
                <Link
                  href="/top-10"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl sm:rounded-2xl text-white font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 hover:opacity-95 hover:scale-[1.02] cursor-pointer animate-in fade-in"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <span>🏆 Top 10 Leaderboard</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ─── SEARCH & FILTER CONTROLS ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 mb-5 sm:mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full min-w-0">
          <div className="relative flex-1 min-w-0">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student, college, project title, or ID..."
              className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1f6fb2] focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto min-w-0">
            {availableDomains.length > 0 && (
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full sm:w-auto sm:max-w-xs px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2] cursor-pointer truncate"
              >
                <option value="ALL">All Domains ({projects.length})</option>
                {availableDomains.map((dom) => {
                  const display = dom.length > 36 ? dom.slice(0, 34) + '…' : dom;
                  return (
                    <option key={dom} value={dom} title={dom}>
                      {display}
                    </option>
                  );
                })}
              </select>
            )}

            <div className="text-xs font-bold text-slate-600 px-3 py-2.5 bg-slate-100 rounded-xl whitespace-nowrap text-center sm:text-left shrink-0">
              <span>Showing </span>
              <span className="text-[#1f6fb2]">{filteredProjects.length}</span>
              <span> of </span>
              <span className="text-slate-900">{projects.length}</span>
              <span> Projects</span>
            </div>
          </div>
        </div>

        {/* ─── LOADING STATE ────────────────────────────────────────────── */}
        {loading && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-[#1f6fb2] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-semibold text-sm">Loading registered student innovators...</p>
          </div>
        )}

        {/* ─── EMPTY STATE ──────────────────────────────────────────────── */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-[#1f6fb2] flex items-center justify-center text-3xl mx-auto mb-4">
              {projects.length === 0 ? '👥' : '🔍'}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
              {projects.length === 0 ? 'No Registrations Yet' : 'No Matching Innovators Found'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {projects.length === 0
                ? 'No student projects have been submitted yet. Be the first innovator to register!'
                : `We could not find any registered projects matching "${searchTerm || selectedDomain}". Try clearing your search filters.`}
            </p>
            {projects.length === 0 ? (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all cursor-pointer inline-block shadow-md hover:opacity-95 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                Register Your Project Now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDomain('ALL');
                }}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all cursor-pointer inline-block shadow-md hover:opacity-95 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}

        {/* ─── CARD GRID VIEW ───────────────────────────────────────────── */}
        {!loading && viewMode === 'grid' && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full min-w-0">
            {filteredProjects.map((project, idx) => {
              const domain = project.domain || project.category || 'AI & ML';
              const teamMembers = Array.isArray(project.team_members) ? project.team_members : [];

              return (
                <div
                  key={project.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-[#1f6fb2]/40 w-full min-w-0"
                >
                  {/* Card Header Top Gradient */}
                  <div className="p-4 sm:p-5 pb-3 min-w-0">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: '#f0f9ff',
                            color: '#1f6fb2',
                            border: '1px solid rgba(31, 111, 178, 0.25)',
                            borderRadius: '6px',
                            padding: '2px 8px',
                          }}
                          title={domain}
                        >
                          {domain.split(',')[0]?.trim() || domain}
                        </span>
                        {domain.includes(',') && (
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 800,
                              backgroundColor: '#e0f2fe',
                              color: '#0369a1',
                              border: '1px solid rgba(31, 111, 178, 0.25)',
                              borderRadius: '4px',
                              padding: '2px 5px',
                              flexShrink: 0,
                            }}
                            title={domain}
                          >
                            +{domain.split(',').length - 1}
                          </span>
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#94a3b8',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          marginLeft: 'auto',
                        }}
                      >
                        {project.created_at
                          ? new Date(project.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Candidate 2026'}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-[#1f6fb2] transition-colors leading-snug line-clamp-2 break-words">
                      {project.title}
                    </h3>

                    {/* Lead Student & College */}
                    <div className="mt-3 space-y-1.5 pt-3 border-t border-slate-100 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold shadow-2xs shrink-0"
                          style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                        >
                          {(project.lead_student || 'S')[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {formatName(project.lead_student)}
                        </span>
                        <span className="text-[9px] font-extrabold text-[#1f6fb2] bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200/70 shrink-0">
                          Lead
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 min-w-0">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M16 11h2M16 15h2M10 21V7l4-3v17" />
                        </svg>
                        <span className="truncate">{formatInstitution(project.institution)}</span>
                        {(project.city || project.state) && (
                          <span className="text-[#1f6fb2] font-semibold shrink-0">• {project.city || project.state}</span>
                        )}
                      </div>

                      {(project.dept || project.year) && (
                        <div className="text-[10px] text-slate-400 font-medium truncate">
                          {[project.dept, project.year].filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </div>

                    {/* ── TEAM MEMBERS DISPLAY (HIGHLIGHTED) ── */}
                    {teamMembers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <span>👥</span>
                            <span>Team Members ({teamMembers.length})</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {teamMembers.map((member, mIdx) => {
                            const isLead = member.toLowerCase() === (project.lead_student || '').toLowerCase();
                            return (
                              <span
                                key={mIdx}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border max-w-full ${
                                  isLead
                                    ? 'bg-sky-50 text-[#1f6fb2] border-sky-200 font-bold'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${isLead ? 'bg-[#1f6fb2]' : 'bg-emerald-500'}`} />
                                <span className="truncate max-w-[130px] sm:max-w-[180px]">{member}</span>
                                {isLead && <span className="text-[8px] font-bold text-[#1f6fb2] shrink-0">(Lead)</span>}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Pitch / USP / Problem Snippet */}
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2 break-words">
                      {project.usp || project.tagline || project.problem_statement || project.solution || 'Collegiate AI & tech innovation prototype.'}
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shrink-0"
                          title="View GitHub Repository"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </a>
                      )}

                      {project.registration_id && (
                        <button
                          type="button"
                          onClick={() => handleOpenBadgeModal(project)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#070e1e] text-[#2ec4b6] border border-[#2ec4b6]/40 hover:bg-[#0c162c] text-[10px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                          title="Collect Badge with 4-Digit PIN"
                        >
                          <span>🎖️ Badge</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectProject(project)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1f6fb2]/10 to-[#2ec4b6]/15 hover:from-[#1f6fb2]/20 hover:to-[#2ec4b6]/25 text-[#1f6fb2] border border-[#1f6fb2]/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95 shadow-2xs shrink-0"
                    >
                      <span>Full Details</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── TABLE DIRECTORY VIEW ─────────────────────────────────────── */}
        {!loading && viewMode === 'table' && filteredProjects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto table-scroll">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-4 text-center w-16">S NO</th>
                    <th className="py-4 px-5">PROJECT & DOMAIN</th>
                    <th className="py-4 px-5">INNOVATOR & TEAM</th>
                    <th className="py-4 px-5">INSTITUTION</th>
                    <th className="py-4 px-5">UVP / HIGHLIGHT</th>
                    <th className="py-4 px-5 text-center w-40">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((project, idx) => {
                    const teamMembers = Array.isArray(project.team_members) ? project.team_members : [];
                    return (
                      <tr key={project.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="py-4 px-4 text-center font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-extrabold text-slate-900 text-sm group-hover:text-[#1f6fb2] transition-colors">
                            {project.title}
                          </div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-[#1f6fb2] border border-sky-200/70 mt-1">
                            {project.domain || project.category || 'AI & ML'}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 text-xs">
                            {formatName(project.lead_student)}
                          </div>
                          {teamMembers.length > 0 && (
                            <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                              👥 {teamMembers.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <div className="text-slate-800 font-medium text-xs">
                            {formatInstitution(project.institution)}
                          </div>
                          {project.dept && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {project.dept}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-5 max-w-xs">
                          <div className="text-xs text-slate-600 line-clamp-2">
                            {project.usp || project.tagline || project.problem_statement}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {project.registration_id && (
                              <button
                                type="button"
                                onClick={() => handleOpenBadgeModal(project)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#070e1e] text-[#2ec4b6] border border-[#2ec4b6]/40 hover:bg-[#0c162c] text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                                title="Collect Badge"
                              >
                                🎖️ Badge
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setInspectProject(project)}
                              className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#1f6fb2] border border-sky-200/80 font-bold text-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                            >
                              Inspect
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ─── FULL PROJECT DOSSIER MODAL ─────────────────────────────────── */}
      {inspectProject && (() => {
        const rawDomain = inspectProject.domain || inspectProject.category || 'AI & Machine Learning';
        const domainList = rawDomain.split(',').map((d) => d.trim()).filter(Boolean);
        const primaryDomain = domainList[0] || rawDomain;
        const extraDomainsCount = domainList.length > 1 ? domainList.length - 1 : 0;

        return (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden"
            onClick={() => setInspectProject(null)}
          >
            <div
              className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] sm:max-h-[90vh] flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header: Video Player or Top Hero Stripe */}
              {getYouTubeEmbedUrl(inspectProject.video_url) ? (
                <div className="relative aspect-video max-h-[300px] w-full bg-slate-950 shrink-0 sticky top-0 z-30">
                  <iframe
                    src={getYouTubeEmbedUrl(inspectProject.video_url)}
                    title={`${inspectProject.title} Demo Video`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    type="button"
                    onClick={() => setInspectProject(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center transition-all cursor-pointer z-40 border border-white/20 shadow-md"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              ) : isDirectVideoFile(inspectProject.video_url) ? (
                <div className="relative aspect-video max-h-[300px] w-full bg-black shrink-0 sticky top-0 z-30 flex items-center justify-center">
                  <video
                    src={inspectProject.video_url}
                    controls
                    playsInline
                    className="w-full h-full max-h-[300px] object-contain"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-40">
                    <a
                      href={inspectProject.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold transition-all border border-white/20 shadow-md flex items-center gap-1.5"
                      title="Open video in new tab"
                    >
                      <span>Open Video</span>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => setInspectProject(null)}
                      className="w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-4 sm:p-6 text-white shrink-0 sticky top-0 z-30 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                      <span
                        className="inline-block max-w-[190px] xs:max-w-[240px] sm:max-w-md truncate px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 tracking-wide leading-tight"
                        title={rawDomain}
                      >
                        {primaryDomain}
                      </span>
                      {extraDomainsCount > 0 && (
                        <span
                          className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-white/25 text-white border border-white/40 shrink-0 leading-tight"
                          title={domainList.slice(1).join(', ')}
                        >
                          +{extraDomainsCount} More
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectProject(null)}
                      className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer border border-white/30 shrink-0 shadow-xs"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black text-white leading-snug break-words">
                    {inspectProject.title}
                  </h2>

                  <p className="text-xs text-sky-100 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-medium leading-relaxed">
                    <span className="font-bold text-white">Lead: {formatName(inspectProject.lead_student)}</span>
                    <span className="text-sky-200/60">•</span>
                    <span className="text-sky-100">{formatInstitution(inspectProject.institution)}</span>
                  </p>
                </div>
              )}

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 text-slate-700">
                {/* If multiple domains exist, show all domain tags nicely in body */}
                {domainList.length > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                      Domains:
                    </span>
                    {domainList.map((dom, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-[#1f6fb2] border border-sky-200/70"
                      >
                        {dom}
                      </span>
                    ))}
                  </div>
                )}

                {/* If Video was shown above, show title here */}
                {getYouTubeEmbedUrl(inspectProject.video_url) && (
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="inline-block max-w-[200px] sm:max-w-md truncate px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-[#1f6fb2] border border-sky-200/70">
                        {primaryDomain}
                      </span>
                      {extraDomainsCount > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-sky-100 text-[#1f6fb2] border border-sky-200 shrink-0">
                          +{extraDomainsCount} More
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug break-words">
                      {inspectProject.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
                      <span className="font-bold text-slate-800">Lead: {formatName(inspectProject.lead_student)}</span>
                      <span className="text-slate-300">•</span>
                      <span>{formatInstitution(inspectProject.institution)}</span>
                    </p>
                  </div>
                )}

                {/* Team Members Roster Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1f6fb2]/5 to-[#2ec4b6]/5 border border-[#1f6fb2]/20">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#1f6fb2] mb-2 flex items-center gap-1.5">
                    <span>👥 Team Members & Innovators</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#1f6fb2]/30 text-slate-900 text-xs font-bold shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#1f6fb2]" />
                      <span>{formatName(inspectProject.lead_student)}</span>
                      <span className="text-[9px] font-extrabold text-[#1f6fb2] bg-sky-100 border border-sky-200/60 px-1.5 py-0.2 rounded">Team Lead</span>
                    </div>

                    {Array.isArray(inspectProject.team_members) &&
                      inspectProject.team_members
                        .filter((m) => m?.toLowerCase() !== (inspectProject.lead_student || '').toLowerCase())
                        .map((member, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{member}</span>
                          </div>
                        ))}
                  </div>
                </div>

                {/* Institution Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">College / University</div>
                    <div className="font-bold text-slate-800 mt-0.5">{formatInstitution(inspectProject.institution)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">City / District (Location)</div>
                    <div className="font-extrabold text-[#1f6fb2] mt-0.5">{inspectProject.city || inspectProject.state || 'Tamil Nadu'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Department & Year</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {[inspectProject.dept, inspectProject.year].filter(Boolean).join(' • ') || 'Engineering Candidate'}
                    </div>
                  </div>
                </div>

                {/* Problem Statement */}
                {inspectProject.problem_statement && (
                  <div className="space-y-1.5">
                    <h4 className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/30 font-black text-xs uppercase tracking-wider shadow-2xs">
                      <span>⚠️</span>
                      <span>Problem Statement</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-amber-50/20 border border-amber-200/70 text-xs text-slate-700 leading-relaxed font-medium">
                      {inspectProject.problem_statement}
                    </div>
                  </div>
                )}

                {/* Proposed Solution */}
                {inspectProject.solution && (
                  <div className="space-y-1.5">
                    <h4 className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 font-black text-xs uppercase tracking-wider shadow-2xs">
                      <span>💡</span>
                      <span>Proposed Solution Architecture</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-emerald-50/20 border border-emerald-200/70 text-xs text-slate-700 leading-relaxed font-medium">
                      {inspectProject.solution}
                    </div>
                  </div>
                )}

                {/* USP & Outcome */}
                {(inspectProject.usp || inspectProject.outcome) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {inspectProject.usp && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                        <div className="text-[10px] font-bold uppercase text-amber-800">Competitive UVP</div>
                        <div className="text-xs font-semibold text-amber-950 mt-1 leading-relaxed">
                          {inspectProject.usp}
                        </div>
                      </div>
                    )}

                    {inspectProject.outcome && (
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                        <div className="text-[10px] font-bold uppercase text-emerald-800">Expected Outcome</div>
                        <div className="text-xs font-semibold text-emerald-950 mt-1 leading-relaxed">
                          {inspectProject.outcome}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Technical Summary */}
                {inspectProject.technical_summary && (
                  <div className="space-y-1.5">
                    <h4 className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-700 border border-sky-500/30 font-black text-xs uppercase tracking-wider shadow-2xs">
                      <span>🛠️</span>
                      <span>Tech Stack & Implementation</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono text-slate-700 leading-relaxed">
                      {inspectProject.technical_summary}
                    </div>
                  </div>
                )}

                {/* External Links */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-2.5">
                  {inspectProject.github_url && (
                    <a
                      href={inspectProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex-1 sm:flex-none text-center"
                    >
                      <span>View GitHub</span>
                    </a>
                  )}

                  {inspectProject.presentation_url && (
                    <a
                      href={inspectProject.presentation_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-[#1f6fb2] border border-sky-200 font-bold text-xs hover:bg-sky-100 transition-all flex-1 sm:flex-none text-center"
                    >
                      <span>Slide Deck</span>
                    </a>
                  )}

                  {inspectProject.demo_url && (
                    <a
                      href={inspectProject.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex-1 sm:flex-none text-center"
                    >
                      <span>Live Prototype ↗</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const p = inspectProject;
                      setInspectProject(null);
                      handleOpenBadgeModal(p);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6] text-white font-bold text-xs hover:opacity-95 shadow-sm transition-all cursor-pointer flex-1 sm:flex-none text-center"
                  >
                    <span>🎖️ Builder Badge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(inspectProject.id)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all w-full sm:w-auto text-center justify-center sm:ml-auto"
                  >
                    {copiedId === inspectProject.id ? '✓ Link Copied' : 'Share Project'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── DIRECT SUBMIT PROJECT MODAL ────────────────────────────────── */}
      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={() => {
          setIsSubmitModalOpen(false);
          fetchRegistered();
        }}
      />

      {/* ─── OFFICIAL BUILDER BADGE MODAL ──────────────────────────────── */}
      {badgeModalProject && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setBadgeModalProject(null)}
        >
          <div
            className="bg-[#070e1e] text-slate-100 rounded-3xl max-w-4xl w-full border border-teal-500/30 shadow-2xl p-5 sm:p-7 relative my-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setBadgeModalProject(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer z-50"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {!unlockedBadge ? (
              /* STEP A: Enter 4-Digit PIN */
              <div className="max-w-md mx-auto py-6 space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-[#2ec4b6] mb-1">
                    <KeyRound className="w-7 h-7" />
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    Access Builder Badge
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400">
                    Project: <strong className="text-white">&ldquo;{badgeModalProject.title || 'Student Innovation'}&rdquo;</strong>
                  </p>
                  {badgeModalProject.registration_id && (
                    <p className="text-xs font-mono text-teal-300 font-bold">
                      Registration ID: {badgeModalProject.registration_id}
                    </p>
                  )}
                </div>

                {badgeError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{badgeError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyBadgePin} className="space-y-4">
                  {!badgeModalProject.registration_id && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Registration ID or Registered Email
                      </label>
                      <input
                        type="text"
                        value={badgeCustomId}
                        onChange={(e) => setBadgeCustomId(e.target.value)}
                        placeholder="PIBI-2026-BDR-XXXX"
                        className="w-full px-4 py-3 rounded-xl bg-[#0b162c] border border-slate-700 text-white text-sm focus:outline-hidden focus:border-[#2ec4b6] transition"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Enter 4-Digit Security PIN
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Check your email inbox
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={badgePin}
                      onChange={(e) => setBadgePin(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •"
                      className="w-full px-4 py-3 rounded-xl bg-[#0b162c] border border-slate-700 text-white text-center font-mono text-2xl tracking-[0.5em] font-black focus:outline-hidden focus:border-[#2ec4b6] transition"
                      autoFocus
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={badgeLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6] text-white font-extrabold text-sm sm:text-base shadow-lg hover:opacity-95 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {badgeLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Security PIN...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Unlock My Builder Badge</span>
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Your 4-digit PIN was sent from <strong>openintelligencepibi@gmail.com</strong> when your project was submitted.
                </p>
              </div>
            ) : (
              /* STEP B: Render Unlocked Badge from pibi.pdf template */
              <div className="space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Security PIN Verified · Badge Unlocked</span>
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    {currentBadgeInnovator}&apos;s Builder Badge
                  </h3>

                  <p className="text-xs text-slate-400">
                    PiBi Open Intelligence · Student Project Awards 2026
                  </p>
                </div>

                {/* Team Members Selector (if multiple members) */}
                {badgeTeamMembers.length > 1 && (
                  <div className="p-3.5 rounded-2xl bg-[#0b162c] border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#2ec4b6]" />
                        <span>Registered Team Members ({badgeTeamMembers.length})</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Click any team member to view & download their personalized badge
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {badgeTeamMembers.map((member, idx) => {
                        const isLead = member.toLowerCase() === (unlockedBadge.studentName || badgeModalProject.lead_student || '').toLowerCase();
                        const active = currentBadgeInnovator.toLowerCase() === member.toLowerCase();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setBadgeSelectedMember(member)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                              active
                                ? 'bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6] text-white shadow-md'
                                : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/70'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5 text-teal-300" />
                            <span>{member}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${active ? 'bg-black/30 text-teal-100' : 'bg-slate-800 text-slate-400'}`}>
                              {isLead ? 'Lead' : 'Member'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Official Badge Canvas (Rendered from public/docs/pibi.pdf) */}
                <div className="py-1">
                  <DigitalBadge
                    studentName={currentBadgeInnovator}
                    institution={unlockedBadge.institution || badgeModalProject.institution}
                    dept={unlockedBadge.dept || badgeModalProject.dept}
                    year={unlockedBadge.year || badgeModalProject.year}
                    projectTitle={unlockedBadge.projectTitle || badgeModalProject.title}
                    registrationId={unlockedBadge.registrationId || badgeModalProject.registration_id}
                  />
                </div>

                {/* Summary Details */}
                <div className="p-3.5 rounded-2xl bg-[#0b162c] border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Innovator</span>
                    <span className="font-bold text-white truncate block">{currentBadgeInnovator}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution / College</span>
                    <span className="font-bold text-slate-200 truncate block">{unlockedBadge.institution || badgeModalProject.institution || 'Engineering College'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Department & Year</span>
                    <span className="font-bold text-[#2ec4b6] truncate block">{[unlockedBadge.year || badgeModalProject.year, unlockedBadge.dept || badgeModalProject.dept].filter(Boolean).join(' • ') || 'Engineering 2026'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration ID</span>
                    <span className="font-mono font-bold text-teal-300 truncate block">{unlockedBadge.registrationId || badgeModalProject.registration_id}</span>
                  </div>
                </div>

                {/* Side-by-side Download and LinkedIn Share Buttons */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <button
                      type="button"
                      onClick={handleDownloadBadgeFromModal}
                      disabled={badgeDownloading}
                      className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1f6fb2] via-[#0284c7] to-[#2ec4b6] hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-xl transition cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98"
                    >
                      {badgeDownloading ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating High-Res PNG...</span>
                        </>
                      ) : badgeDownloadSuccess ? (
                        <>
                          <Check className="w-5 h-5 text-white" />
                          <span>Badge Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Download My Badge</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleShareBadgeLinkedIn}
                      className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white font-extrabold text-sm sm:text-base shadow-xl transition cursor-pointer hover:scale-[1.01] active:scale-98"
                    >
                      <LinkedInIcon className="w-5 h-5" />
                      <span>Share on LinkedIn</span>
                    </button>
                  </div>

                  {badgeLinkedInOpened && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>LinkedIn opened in a new tab! Your badge poster PNG was downloaded and the post link will preview your personalized badge card.</span>
                    </div>
                  )}

                  {/* LinkedIn Template Snippet */}
                  <div className="p-4 rounded-2xl bg-[#070e1e] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#2ec4b6]" />
                        <span>Official LinkedIn Post Template</span>
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (navigator?.clipboard?.writeText) {
                            await navigator.clipboard.writeText(badgeLinkedInPostText);
                          }
                          setBadgeCopiedLink(true);
                          setTimeout(() => setBadgeCopiedLink(false), 2500);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2ec4b6] hover:bg-[#28ad9f] text-slate-950 font-extrabold text-xs transition cursor-pointer"
                      >
                        {badgeCopiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{badgeCopiedLink ? 'Copied!' : 'Copy Post'}</span>
                      </button>
                    </div>
                    <div className="p-3 bg-[#050a16] rounded-xl border border-slate-800 text-xs font-sans text-slate-300 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                      {badgeLinkedInPostText}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
