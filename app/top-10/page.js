'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// Helper to extract clean YouTube embed URL
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  // If dummy or placeholder, return null so it renders the high-end interactive showcase banner
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
  } catch { }
  return null;
}

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

function formatName(name) {
  if (!name) return 'Student Innovator';
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
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

  // New Showcase Interactive State (Grid vs Leaderboard, Card Tabs, Dossier Modal)
  const [viewMode, setViewMode] = useState('leaderboard'); // 'grid' | 'leaderboard'
  const [inspectProject, setInspectProject] = useState(null);
  const [cardActiveTabs, setCardActiveTabs] = useState({});

  const getCardTab = (id) => cardActiveTabs[id] || 'usp';
  const setCardTab = (id, tab) => setCardActiveTabs((prev) => ({ ...prev, [id]: tab }));

  // Load from localStorage and fetch admin settings on mount
  useEffect(() => {
    fetch('/api/student-projects/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.isTop10Active === 'boolean') {
          setIsTop10Active(d.isTop10Active);
        }
      })
      .catch(() => { });

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
          .catch(() => { });
      }
      const savedName = localStorage.getItem('pibi_top10_voter_name');
      if (savedName) setVoterName(savedName);
    } catch { }
  }, []);

  // Lock body scroll and listen for Escape key when any modal is open
  useEffect(() => {
    if (inspectProject || votingProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !voteSubmitting) {
        setInspectProject(null);
        setVotingProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspectProject, votingProject, voteSubmitting]);

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
          } catch { }
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
      } catch { }

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
          .catch(() => { });
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
        {/* Executive Innovation Hero Card */}
        <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 mb-8 overflow-hidden">
          {/* Top Brand Gradient Stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#1f6fb2] bg-sky-50 border border-sky-200/70 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#2ec4b6] animate-pulse" />
                <span>PiBi Grand Finale • Official Leaderboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Top 10 Student Innovations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Explore finalist prototypes, inspect technical architectures, and cast your official vote.
              </p>
            </div>

            {/* Live Competition Metrics & Status */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                >
                  {projects.length}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Finalists</div>
                  <div className="text-xs font-extrabold text-slate-800">Audited Builds</div>
                </div>
              </div>

              {isTop10Active ? (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <div className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Public Ballot</div>
                    <div className="text-xs font-extrabold text-emerald-800">Voting Live</div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
                  <span>🔒</span>
                  <span>Voting Paused</span>
                </div>
              )}
            </div>
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

        {/* COMPETITION LEADERBOARD TABLE */}
        {!loading && filteredProjects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-8">
            <div className="overflow-x-auto table-scroll">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-4 px-4 sm:px-6 text-center w-20">S NO</th>
                    <th className="py-4 px-4 sm:px-6">PROJECT & DOMAIN</th>
                    <th className="py-4 px-4 sm:px-6">INSTITUTION & LEAD</th>
                    <th className="py-4 px-4 sm:px-6">KEY COMPETITIVE UVP</th>
                    <th className="py-4 px-4 sm:px-6 text-center w-52">
                      <div className="flex items-center justify-center text-center">ACTIONS</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProjects.map((project, idx) => {
                    const rank = idx + 1;
                    const isVotedByMe = votedProjectId === project.id;
                    return (
                      <tr key={project.id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Rank Medallion */}
                        <td className="py-4.5 px-4 sm:px-6 text-center whitespace-nowrap">
                          <div className="inline-flex items-center justify-center">
                            {rank === 1 ? (
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 font-black text-sm flex items-center justify-center shadow-xs ring-2 ring-amber-200/80">
                                1
                              </div>
                            ) : rank === 2 ? (
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-black text-sm flex items-center justify-center shadow-xs ring-2 ring-slate-200">
                                2
                              </div>
                            ) : rank === 3 ? (
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-amber-50 font-black text-sm flex items-center justify-center shadow-xs ring-2 ring-amber-500/40">
                                3
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center border border-slate-200">
                                {rank}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Project Title & Domain */}
                        <td className="py-4.5 px-4 sm:px-6">
                          <div>
                            <div className="font-extrabold text-slate-900 text-sm group-hover:text-[#1f6fb2] transition-colors leading-snug">
                              {project.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-[#1f6fb2] border border-sky-200/70">
                                {project.domain || project.category || 'AI & ML'}
                              </span>
                              {project.demo_url && (
                                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Live Prototype
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Institution & Student Lead */}
                        <td className="py-4.5 px-4 sm:px-6">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">
                                {formatName(project.lead_student)}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                Lead
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 truncate">
                              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M16 11h2M16 15h2M10 21V7l4-3v17" />
                              </svg>
                              <span className="truncate">{formatInstitution(project.institution)}</span>
                            </div>
                          </div>
                        </td>

                        {/* Key Competitive USP */}
                        <td className="py-4.5 px-4 sm:px-6 max-w-sm">
                          <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-slate-700 text-xs leading-relaxed font-medium line-clamp-2">
                            {project.usp || project.tagline || project.description}
                          </div>
                        </td>

                        {/* Actions (Strictly Centered) */}
                        <td className="py-4.5 px-4 sm:px-6 text-center whitespace-nowrap w-52">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectProject(project)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200/90 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                              title="Inspect Innovation Architecture"
                            >
                              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>Inspect</span>
                            </button>

                            {isVotedByMe ? (
                              <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 shadow-2xs">
                                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Voted</span>
                              </span>
                            ) : !isTop10Active ? (
                              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed">
                                <span>🔒 Paused</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setVotingProject(project);
                                  setVoteError('');
                                  setVoteSuccess('');
                                }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white font-bold text-xs shadow-sm shadow-cyan-900/10 hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                              >
                                <span>Vote 🗳️</span>
                              </button>
                            )}
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

        {/* Executive Competition Protocol & Trust Pillars */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 mb-8">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  Verified Ballot Integrity
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Strict single-vote quota enforced per validated email address. Duplicate ballot attempts are cryptographically checked and prevented.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-[#1f6fb2]">
                <span>Anti-fraud verification active</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  Public Choice Laurels
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Community balloting directly determines the prestigious Public Choice Trophy, weighted alongside academic and industry jury scoring.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-[#1f6fb2]">
                <span>Official Grand Finale Prize</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-2xs"
                  style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">
                  Full Technical Dossiers
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Inspect working live prototype URLs, architectural diagrams, problem statements, and GitHub code repositories before casting your ballot.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-[#1f6fb2]">
                <span>100% auditable student code</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ─── VOTE SUBMISSION MODAL ────────────────────────────────────── */}
      {votingProject && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          onClick={() => !voteSubmitting && setVotingProject(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-6 text-white"
              style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-3 py-1 rounded-full text-[0.68rem] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  Official Public Choice Ballot
                </span>
                <button
                  onClick={() => setVotingProject(null)}
                  disabled={voteSubmitting}
                  className="w-8 h-8 rounded-lg bg-black/15 hover:bg-black/30 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer border border-white/20"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-xl font-black text-white leading-snug">
                {votingProject.title}
              </h3>
              <p className="text-xs text-cyan-50/95 mt-1 flex items-center gap-1.5 font-medium">
                <span>By {formatName(votingProject.lead_student)}</span>
                <span>•</span>
                <span>{formatInstitution(votingProject.institution)}</span>
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
                      className="px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-cyan-900/20 cursor-pointer disabled:opacity-60 flex items-center gap-2 hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                    >
                      {voteSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying & Recording...</span>
                        </>
                      ) : !isTop10Active ? (
                        <>
                          <span>🔒 Voting Paused</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Cast Official Vote</span>
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

      {/* ─── FULL INNOVATION DOSSIER MODAL ────────────────────────────────────── */}
      {inspectProject && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden"
          onClick={() => setInspectProject(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[88vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Video Player or Executive Header — STICKY & ALWAYS VISIBLE */}
            {getYouTubeEmbedUrl(inspectProject.video_url) ? (
              <div className="relative aspect-video max-h-[290px] w-full bg-slate-950 shrink-0 sticky top-0 z-30">
                <iframe
                  src={getYouTubeEmbedUrl(inspectProject.video_url)}
                  title={`${inspectProject.title} Video Demonstration`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  type="button"
                  onClick={() => setInspectProject(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center transition-all cursor-pointer z-40 shadow-md border border-white/20"
                  aria-label="Close"
                  title="Close (Esc)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                className="p-5 sm:p-6 text-white shrink-0 sticky top-0 z-30 shadow-md"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                <div className="flex items-start justify-between gap-4 mb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 tracking-wide">
                      {inspectProject.domain || inspectProject.category || 'AI & ML'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-black/15 text-white backdrop-blur-md border border-white/20">
                      <svg className="w-3.5 h-3.5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M16 11h2M16 15h2M10 21V7l4-3v17" />
                      </svg>
                      <span>{formatInstitution(inspectProject.institution)}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectProject(null)}
                    className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-white/20"
                    aria-label="Close"
                    title="Close (Esc)"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {inspectProject.title}
                </h2>
                {(inspectProject.pitch || inspectProject.tagline) && (
                  <p className="text-xs sm:text-sm text-cyan-50/95 mt-1 leading-relaxed max-w-2xl font-medium">
                    {inspectProject.pitch || inspectProject.tagline}
                  </p>
                )}
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1 modal-scroll">
              {/* Innovator Metadata & Resource Actions Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs"
                    style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                  >
                    {inspectProject.lead_student?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {formatName(inspectProject.lead_student)}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold px-1.5 py-0.5 rounded bg-slate-200/70">
                        Lead Innovator
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {inspectProject.dept || 'Engineering'} {inspectProject.year ? `• ${inspectProject.year}` : ''}
                    </div>
                  </div>
                </div>

                {/* External Resource Links */}
                <div className="flex items-center gap-2 flex-wrap">
                  {inspectProject.demo_url && (
                    <a
                      href={inspectProject.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition-all hover:opacity-95"
                      style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                    >
                      <span>Live Prototype</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </a>
                  )}
                  {inspectProject.github_url && (
                    <a
                      href={inspectProject.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>Repository</span>
                    </a>
                  )}
                  {inspectProject.presentation_url && (
                    <a
                      href={inspectProject.presentation_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                      <span>Deck</span>
                    </a>
                  )}
                </div>
              </div>

              {/* 4 Core Innovation Pillars in 2-Column Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {inspectProject.usp && (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Competitive Edge (UVP)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                      {inspectProject.usp}
                    </p>
                  </div>
                )}

                {inspectProject.problem_statement && (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Problem Statement
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {inspectProject.problem_statement}
                    </p>
                  </div>
                )}

                {inspectProject.solution && (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Technical Architecture
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {inspectProject.solution}
                    </p>
                  </div>
                )}

                {inspectProject.outcome && (
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Measurable Impact
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {inspectProject.outcome}
                    </p>
                  </div>
                )}
              </div>

              {/* Full Description / Overview */}
              {inspectProject.description && inspectProject.description !== inspectProject.problem_statement && (
                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs sm:text-sm">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Executive Summary
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {inspectProject.description}
                  </p>
                </div>
              )}

              {/* Tech Architecture Stack */}
              {inspectProject.technical_summary && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs flex items-start gap-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 pt-0.5">Stack:</span>
                  <span className="text-slate-700 font-mono leading-relaxed">{inspectProject.technical_summary}</span>
                </div>
              )}

              {/* Team Members */}
              {Array.isArray(inspectProject.team_members) && inspectProject.team_members.length > 1 && (
                <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700">Team Contributors:</span>
                  <span>{inspectProject.team_members.join(', ')}</span>
                </div>
              )}

              {/* Tags */}
              {Array.isArray(inspectProject.tags) && inspectProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {inspectProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Bottom Sticky Bar */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(inspectProject.id, inspectProject.title)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                  </svg>
                  <span>{copiedId === inspectProject.id ? 'Copied Link! ✓' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectProject(null)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div>
                {votedProjectId === inspectProject.id ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Voted by You</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const proj = inspectProject;
                      setInspectProject(null);
                      setVotingProject(proj);
                      setVoteError('');
                      setVoteSuccess('');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md shadow-cyan-900/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Cast Official Vote</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
