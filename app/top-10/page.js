'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// Helper to extract clean YouTube embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const watchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=0&rel=0`;
    }
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=0&rel=0`;
    }
  } catch {}
  return null;
}

export default function Top10ShowcasePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('votes'); // 'votes' | 'rank' | 'alpha'

  // Modals & User state
  const [votingProject, setVotingProject] = useState(null);
  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [voteSubmitting, setVoteSubmitting] = useState(false);
  const [voteError, setVoteError] = useState('');
  const [voteSuccess, setVoteSuccess] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [votedProjectId, setVotedProjectId] = useState(null);
  const [votedProjectTitle, setVotedProjectTitle] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isTop10Active, setIsTop10Active] = useState(true);

  // Load from localStorage and fetch admin settings on mount
  useEffect(() => {
    fetch('/api/student-projects/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.isTop10Active === 'boolean') {
          setIsTop10Active(d.isTop10Active);
        }
      })
      .catch(() => {});

    try {
      const storedId = localStorage.getItem('pibi_top10_voted_project_id');
      const storedTitle = localStorage.getItem('pibi_top10_voted_project_title');
      if (storedId) {
        setVotedProjectId(storedId);
        if (storedTitle) setVotedProjectTitle(storedTitle);
      }
      const savedEmail = localStorage.getItem('pibi_top10_voter_email');
      if (savedEmail) {
        setVoterEmail(savedEmail);
        // Verify vote status from server for this email
        fetch(`/api/top-10-projects/vote?email=${encodeURIComponent(savedEmail)}`)
          .then((r) => r.json())
          .then((data) => {
            if (data && data.hasVoted && data.votedProjectId) {
              setVotedProjectId(data.votedProjectId);
              if (data.votedProjectTitle) setVotedProjectTitle(data.votedProjectTitle);
              localStorage.setItem('pibi_top10_voted_project_id', data.votedProjectId);
              if (data.votedProjectTitle) localStorage.setItem('pibi_top10_voted_project_title', data.votedProjectTitle);
            }
          })
          .catch(() => {});
      }
      const savedName = localStorage.getItem('pibi_top10_voter_name');
      if (savedName) setVoterName(savedName);
    } catch {}
  }, []);

  // Fetch Top 10 projects
  const fetchTopProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/top-10-projects');
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
        setTotalVotes(data.totalVotes || 0);
      }
    } catch (err) {
      console.error('Failed to load Top 10 projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProjects();
  }, []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      const cat = p.category || p.domain;
      if (cat) set.add(cat);
    });
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    let result = projects.filter((p) => {
      if (selectedCategory !== 'ALL' && (p.category || p.domain) !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = p.title?.toLowerCase().includes(q);
        const matchStudent = p.lead_student?.toLowerCase().includes(q);
        const matchInst = p.institution?.toLowerCase().includes(q);
        const matchTagline = p.tagline?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q));
        const matchTeam = Array.isArray(p.team_members) && p.team_members.some((m) => m.toLowerCase().includes(q));
        return matchTitle || matchStudent || matchInst || matchTagline || matchDesc || matchTags || matchTeam;
      }
      return true;
    });

    if (sortBy === 'votes') {
      result.sort((a, b) => (b.votes_count || 0) - (a.votes_count || 0));
    } else if (sortBy === 'rank') {
      result.sort((a, b) => (a.top_10_rank || 99) - (b.top_10_rank || 99));
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [projects, selectedCategory, searchTerm, sortBy]);

  // Handle Vote Submission
  const handleCastVote = async (e) => {
    e.preventDefault();
    if (!votingProject) return;

    setVoteError('');
    setVoteSuccess('');

    const cleanName = voterName.trim();
    const cleanEmail = voterEmail.trim().toLowerCase();

    if (!cleanName || cleanName.length < 2) {
      setVoteError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setVoteError('Please enter a valid email address.');
      return;
    }

    setVoteSubmitting(true);
    try {
      const res = await fetch('/api/top-10-projects/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: votingProject.id,
          voterName: cleanName,
          voterEmail: cleanEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Strict error for duplicate vote
        setVoteError(data.error || 'Failed to submit vote. Duplicate votes with the same email are blocked.');
        if (data.alreadyVotedProjectId) {
          setVotedProjectId(data.alreadyVotedProjectId);
          if (data.alreadyVotedTitle) setVotedProjectTitle(data.alreadyVotedTitle);
          try {
            localStorage.setItem('pibi_top10_voted_project_id', data.alreadyVotedProjectId);
            if (data.alreadyVotedTitle) localStorage.setItem('pibi_top10_voted_project_title', data.alreadyVotedTitle);
          } catch {}
        }
        return;
      }

      // Success!
      setVoteSuccess(data.message || `🎉 Your vote for "${votingProject.title}" has been recorded!`);
      setVotedProjectId(votingProject.id);
      setVotedProjectTitle(votingProject.title);

      // Update state locally
      setProjects((prev) =>
        prev.map((p) =>
          p.id === votingProject.id ? { ...p, votes_count: data.newVoteCount } : p
        )
      );
      setTotalVotes((prev) => prev + 1);

      // Save to localStorage
      try {
        localStorage.setItem('pibi_top10_voter_email', cleanEmail);
        localStorage.setItem('pibi_top10_voter_name', cleanName);
        localStorage.setItem('pibi_top10_voted_project_id', votingProject.id);
        localStorage.setItem('pibi_top10_voted_project_title', votingProject.title);
      } catch {}

      // Fire confetti if available
      if (typeof window !== 'undefined') {
        import('canvas-confetti')
          .then((confettiModule) => {
            const confetti = confettiModule.default;
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#1f6fb2', '#2ec4b6', '#f59e0b', '#10b981', '#ec4899'],
            });
          })
          .catch(() => {});
      }
    } catch (err) {
      setVoteError(err.message || 'Network error occurred while submitting your vote.');
    } finally {
      setVoteSubmitting(false);
    }
  };

  // Copy share link
  const handleCopyLink = (projectId, title) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/top-10?project=${projectId}`;
      navigator.clipboard.writeText(url);
      setCopiedId(projectId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-[#2ec4b6]/20 selection:text-[#1f6fb2]">
      <main className="flex-1 pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-[#1f6fb2] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/students" className="hover:text-[#1f6fb2] transition-colors">Student Innovation</Link>
          <span>/</span>
          <span className="text-[#1f6fb2]">Top 10 Finalists & Voting</span>
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12 p-8 md:p-12 text-center bg-gradient-to-br from-[#0a192f] via-[#0f2d4a] to-[#134e4a] text-white shadow-2xl border border-sky-900/40">
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2ec4b6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1f6fb2]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-extrabold text-xs uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>🏆 Public Choice Awards 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 text-white drop-shadow-md">
              Top 10 Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-300">AI & Tech Innovations</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed mb-6">
              Watch real prototype demo videos created by student innovators across top universities. Discover breakthrough deep tech, review code architectures, and cast your official vote for the People&apos;s Choice Champion!
            </p>

            {/* Anti-Fraud Notice & Live Stats Pill */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>1 Vote Per Verified Email • Duplicate Protection</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-cyan-300">
                <span className="font-extrabold text-white text-base">{projects.length}</span>
                <span>Finalist Teams</span>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-amber-300">
                <span className={`w-2 h-2 rounded-full ${isTop10Active ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'}`} />
                <span>{isTop10Active ? 'Live Public Voting Open' : 'Voting Paused by Admin'}</span>
              </div>
            </div>

            {!isTop10Active && (
              <div className="mt-5 p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                <span>🔒</span>
                <span>Top 10 public voting is currently set to OFF in the Admin dashboard. Voting is temporarily locked.</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters, Search & Sorting Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search projects, student names, colleges, tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6] text-white shadow-md shadow-cyan-900/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat === 'ALL' ? 'All Domains' : cat}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1f6fb2]"
            >
              <option value="votes">⭐ Featured Finalists</option>
              <option value="rank">🏆 Top 10 Rank</option>
              <option value="alpha">🔤 Project Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#1f6fb2]/20 border-t-[#1f6fb2] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-semibold text-sm">Loading Top 10 Student Showcases...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Projects Found</h3>
            <p className="text-sm text-slate-500 mb-6">
              No projects matched your search or category filter. Try clearing filters to view all top projects.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1f6fb2] text-white font-bold text-xs hover:bg-[#18598f] transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => {
              const embedUrl = getYouTubeEmbedUrl(project.video_url);
              const rank = index + 1;
              const isVotedByMe = votedProjectId === project.id;
              const hasAlreadyVotedOther = Boolean(votedProjectId && votedProjectId !== project.id);

              return (
                <div
                  key={project.id}
                  id={project.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Card Header & Video Section */}
                  <div>
                    {/* Video Player or Thumbnail */}
                    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={`${project.title} Video Walkthrough`}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-slate-900 to-sky-950">
                          <span className="text-4xl mb-2">▶</span>
                          <span className="font-bold text-sm mb-3">{project.title} Demonstration</span>
                          {project.video_url && (
                            <a
                              href={project.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md"
                            >
                              <span>Watch Video on YouTube ↗</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Rank Overlay Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white font-black text-xs shadow-lg">
                        {rank === 1 ? (
                          <span className="text-amber-400">🥇 #1 LEADER</span>
                        ) : rank === 2 ? (
                          <span className="text-slate-300">🥈 #2 FINALIST</span>
                        ) : rank === 3 ? (
                          <span className="text-amber-500">🥉 #3 FINALIST</span>
                        ) : (
                          <span className="text-cyan-300">🏆 TOP #{rank}</span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 md:p-7">
                      {/* Domain and Institution */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1f6fb2]/10 text-[#1f6fb2] border border-[#1f6fb2]/20">
                          {project.domain || project.category || 'AI & ML'}
                        </span>

                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          🏛️ {project.institution}
                        </span>
                      </div>

                      {/* Project Title */}
                      <h2 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-[#1f6fb2] transition-colors leading-snug">
                        {project.title}
                      </h2>

                      {/* Pitch Tagline */}
                      {(project.pitch || project.tagline) && (
                        <p className="text-sm font-medium text-slate-500 italic mb-4">
                          &ldquo;{project.pitch || project.tagline}&rdquo;
                        </p>
                      )}

                      {/* Student & Team Details */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5 text-xs text-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-400 uppercase tracking-wide text-[0.7rem]">Lead Innovator</span>
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            👤 {project.lead_student}
                          </span>
                        </div>

                        {project.dept && (
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-400 uppercase tracking-wide text-[0.7rem]">Department / Year</span>
                            <span className="font-medium text-slate-800">
                              🎓 {project.dept} {project.year ? `• ${project.year}` : ''}
                            </span>
                          </div>
                        )}

                        {Array.isArray(project.team_members) && project.team_members.length > 1 && (
                          <div className="pt-1.5 border-t border-slate-200/60 flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-400 uppercase tracking-wide text-[0.7rem] shrink-0">Team</span>
                            <span className="font-medium text-slate-700 text-right">
                              👥 {project.team_members.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Problem & Solution Accordion / Highlights */}
                      <div className="space-y-3 mb-5">
                        {project.problem_statement && (
                          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs">
                            <div className="font-bold text-rose-800 uppercase tracking-wider text-[0.68rem] mb-1 flex items-center gap-1.5">
                              <span>🔴 Problem Solved</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {project.problem_statement}
                            </p>
                          </div>
                        )}

                        {project.solution && (
                          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
                            <div className="font-bold text-emerald-800 uppercase tracking-wider text-[0.68rem] mb-1 flex items-center gap-1.5">
                              <span>🟢 Working Solution</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {project.solution}
                            </p>
                          </div>
                        )}

                        {project.usp && (
                          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-xs">
                            <span className="font-bold text-amber-900 text-[0.68rem] uppercase tracking-wider block mb-0.5">
                              ⚡ Key Innovation (USP):
                            </span>
                            <span className="text-amber-950 font-medium">{project.usp}</span>
                          </div>
                        )}
                      </div>

                      {/* Tech Chips */}
                      {Array.isArray(project.tags) && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md text-[0.72rem] font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Deliverable Resource Links */}
                      <div className="flex items-center flex-wrap gap-2 text-xs font-semibold mb-6">
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors"
                          >
                            <span>🌐 Live Demo</span>
                            <span className="text-[10px]">&rarr;</span>
                          </a>
                        )}

                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
                          >
                            <span>💻 GitHub Code</span>
                            <span className="text-[10px]">&rarr;</span>
                          </a>
                        )}

                        {project.presentation_url && (
                          <a
                            href={project.presentation_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                          >
                            <span>📊 Pitch Slides</span>
                            <span className="text-[10px]">&rarr;</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Vote Action & Share Button */}
                  <div className="p-6 md:p-7 pt-4 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    {/* Share / Copy link button */}
                    <button
                      onClick={() => handleCopyLink(project.id, project.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                      title="Share link to this project"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                      <span>{copiedId === project.id ? 'Copied Link!' : 'Share Project'}</span>
                    </button>

                    {/* VOTE BUTTON */}
                    {isVotedByMe ? (
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Your Official Vote Placed ✅</span>
                      </div>
                    ) : hasAlreadyVotedOther ? (
                      <button
                        type="button"
                        onClick={() => {
                          setVotingProject(project);
                          setVoteError(`Duplicate vote blocked! You have already cast your 1 official vote in this competition for "${votedProjectTitle || 'another project'}". Each verified email is strictly limited to 1 vote across all projects.`);
                          setVoteSuccess('');
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
                        title="You have already cast your single vote"
                      >
                        <span>🔒</span>
                        <span>Vote Locked (1 Per Person)</span>
                      </button>
                    ) : !isTop10Active ? (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                        <span>🔒</span>
                        <span>Voting Paused by Admin</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setVotingProject(project);
                          setVoteError('');
                          setVoteSuccess('');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-200 shadow-md cursor-pointer bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white shadow-rose-900/20 hover:scale-105"
                      >
                        <span>🗳️</span>
                        <span>Vote for This Project</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Voting Rules Info Card */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>⚖️</span>
            <span>How Public Choice Voting Works</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span>1️⃣ Watch & Inspect</span>
              </div>
              <p>Watch student prototypes, examine real-world use cases, and inspect the technical code architecture before choosing.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span>2️⃣ One Person, One Vote</span>
              </div>
              <p>Each voter is verified by email address. Submitting duplicate votes with the same email is strictly blocked by the system.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <span>3️⃣ Cash Prizes & Spotlight</span>
              </div>
              <p>Public votes directly decide the People&apos;s Choice Champion who takes home official awards and features on PiBi Open Intelligence.</p>
            </div>
          </div>
        </div>
      </main>

      {/* ─── VOTE SUBMISSION MODAL ────────────────────────────────────── */}
      {votingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
          onClick={() => !voteSubmitting && setVotingProject(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-br from-[#0a192f] to-[#1f6fb2] text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
                  Official Public Vote
                </span>
                <button
                  onClick={() => setVotingProject(null)}
                  disabled={voteSubmitting}
                  className="text-white/80 hover:text-white font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-xl font-black text-white leading-snug">
                {votingProject.title}
              </h3>
              <p className="text-xs text-cyan-200 mt-1">
                By {votingProject.lead_student} • {votingProject.institution}
              </p>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCastVote} className="p-6 space-y-4">
              {/* Duplicate Error Message Alert */}
              {voteError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium space-y-1 animate-pulse">
                  <div className="font-bold flex items-center gap-1.5 text-rose-900">
                    <span>⚠️ Duplicate Vote Blocked</span>
                  </div>
                  <p>{voteError}</p>
                </div>
              )}

              {/* Success Message Alert */}
              {voteSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-2 text-center">
                  <div className="text-3xl">🎉</div>
                  <p>{voteSuccess}</p>
                  <button
                    type="button"
                    onClick={() => setVotingProject(null)}
                    className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                  >
                    Close Window
                  </button>
                </div>
              )}

              {!voteSuccess && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                      disabled={voteSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. anand@gmail.com"
                      value={voterEmail}
                      onChange={(e) => setVoterEmail(e.target.value)}
                      disabled={voteSubmitting}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1f6fb2] focus:bg-white"
                    />
                    <p className="text-[0.72rem] text-slate-500 mt-1.5 flex items-center gap-1">
                      <span>🔒</span> Strictly 1 vote per email across all projects. You cannot use this email to vote for another project once submitted.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
                    <span className="text-amber-600 font-bold text-xs shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <strong>Contest Rule:</strong> Each email address can cast only <strong>1 single vote</strong> across all projects. Once you vote for <em>"{votingProject.title}"</em>, you cannot change your vote or vote for any other project.
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setVotingProject(null)}
                      disabled={voteSubmitting}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={voteSubmitting || !isTop10Active}
                      className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-600 hover:to-red-700 transition-all shadow-md shadow-rose-900/20 cursor-pointer disabled:opacity-60 flex items-center gap-2"
                    >
                      {voteSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying & Recording...</span>
                        </>
                      ) : !isTop10Active ? (
                        <>
                          <span>🔒 Voting Paused by Admin</span>
                        </>
                      ) : (
                        <>
                          <span>🗳️ Submit Official Vote</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
