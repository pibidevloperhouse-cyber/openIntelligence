'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

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

  // Top 10 button toggle state controlled via Admin panel
  const [isTop10Active, setIsTop10Active] = useState(false);

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
  }, []);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (inspectProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setInspectProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inspectProject]);

  // Clean list sorted by latest submission
  const filteredProjects = useMemo(() => {
    return [...projects].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [projects]);

  const handleCopyShareLink = (projectId) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/registered-students?project=${projectId}`;
      navigator.clipboard.writeText(url);
      setCopiedId(projectId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-[#7c3aed]/20 selection:text-[#6d28d9]">
      <main className="flex-1 pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb Navigation */}
        {/* <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#1f6fb2] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/students" className="hover:text-[#1f6fb2] transition-colors">Students Showcase</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Registered Candidates</span>
        </div> */}

        {/* ─── HERO HEADER BANNER ────────────────────────────────────────── */}
        {/* ─── HERO HEADER BANNER ────────────────────────────────────────── */}
        <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8 overflow-hidden">
          {/* Top Royal Purple / Indigo Gradient Stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: 'linear-gradient(115deg, #4f46e5 0%, #7c3aed 45%, #9333ea 75%, #06b6d4 100%)' }}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Registered Student Innovators
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Meet all the registered student innovators, co-engineering teams, and collegiate prototypes participating in the 2026 National Innovation Showcase.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/students"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                <span>➕ Submit Your Project</span>
              </Link>

              {isTop10Active && (
                <Link
                  href="/top-10"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95 hover:opacity-95 hover:scale-[1.02] cursor-pointer animate-in fade-in"
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

        {/* ─── LOADING STATE ────────────────────────────────────────────── */}
        {loading && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-[#7c3aed] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-semibold text-sm">Loading registered student innovators...</p>
          </div>
        )}

        {/* ─── EMPTY STATE ──────────────────────────────────────────────── */}
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-3xl mx-auto mb-4">
              👥
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Registrations Yet</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              No student projects have been submitted yet. Be the first innovator to register!
            </p>
            <Link
              href="/students"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all cursor-pointer inline-block"
            >
              Register Your Project Now
            </Link>
          </div>
        )}

        {/* ─── CARD GRID VIEW ───────────────────────────────────────────── */}
        {!loading && viewMode === 'grid' && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project, idx) => {
              const domain = project.domain || project.category || 'AI & ML';
              const teamMembers = Array.isArray(project.team_members) ? project.team_members : [];

              return (
                <div
                  key={project.id || idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-purple-300"
                >
                  {/* Card Header Top Gradient */}
                  <div className="p-5 pb-3">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            maxWidth: '170px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: '#faf5ff',
                            color: '#7e22ce',
                            border: '1px solid rgba(216, 180, 254, 0.7)',
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
                              backgroundColor: '#f3e8ff',
                              color: '#6b21a8',
                              border: '1px solid #e9d5ff',
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
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-700 transition-colors leading-snug line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Lead Student & College */}
                    <div className="mt-3 space-y-1.5 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#4f46e5] to-[#7c3aed] text-white flex items-center justify-center text-[10px] font-bold">
                          {(project.lead_student || 'S')[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 text-xs">
                          {formatName(project.lead_student)}
                        </span>
                        <span className="text-[9px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200/60">
                          Lead
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                        <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M3 21h18M3 7v14M21 7v14M6 11h2M6 15h2M16 11h2M16 15h2M10 21V7l4-3v17" />
                        </svg>
                        <span className="truncate">{formatInstitution(project.institution)}</span>
                        {(project.city || project.state) && (
                          <span className="text-purple-700 font-semibold shrink-0">• {project.city || project.state}</span>
                        )}
                      </div>

                      {(project.dept || project.year) && (
                        <div className="text-[10px] text-slate-400 font-medium">
                          {[project.dept, project.year].filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </div>

                    {/* ── TEAM MEMBERS DISPLAY (HIGHLIGHTED) ── */}
                    {teamMembers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
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
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                                  isLead
                                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isLead ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                                <span>{member}</span>
                                {isLead && <span className="text-[8px] font-bold text-purple-600">(Lead)</span>}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Pitch / USP / Problem Snippet */}
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {project.usp || project.tagline || project.problem_statement || project.solution || 'Collegiate AI & tech innovation prototype.'}
                    </p>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="View GitHub Repository"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setInspectProject(project)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 font-bold text-xs transition-all cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                    >
                      <span>Inspect Dossier</span>
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
                    <th className="py-4 px-5">USP / HIGHLIGHT</th>
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
                          <div className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                            {project.title}
                          </div>
                          <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/70 mt-1">
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
                          <button
                            type="button"
                            onClick={() => setInspectProject(project)}
                            className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 font-bold text-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            Inspect
                          </button>
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
      {inspectProject && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-hidden"
          onClick={() => setInspectProject(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col relative"
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
                <button
                  type="button"
                  onClick={() => setInspectProject(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center transition-all cursor-pointer z-40 border border-white/20 shadow-md"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                className="p-6 text-white shrink-0 sticky top-0 z-30 shadow-md"
                style={{ background: 'linear-gradient(115deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 tracking-wide">
                    {inspectProject.domain || inspectProject.category || 'AI & Machine Learning'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectProject(null)}
                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer border border-white/30"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {inspectProject.title}
                </h2>

                <p className="text-xs text-purple-100 mt-1 flex items-center gap-1.5 font-medium">
                  <span>Lead: {formatName(inspectProject.lead_student)}</span>
                  <span>•</span>
                  <span>{formatInstitution(inspectProject.institution)}</span>
                </p>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-700">
              {/* If Video was shown above, show title here */}
              {getYouTubeEmbedUrl(inspectProject.video_url) && (
                <div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/70 mb-2">
                    {inspectProject.domain || inspectProject.category || 'AI & ML'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {inspectProject.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Lead: {formatName(inspectProject.lead_student)} • {formatInstitution(inspectProject.institution)}
                  </p>
                </div>
              )}

              {/* Team Members Roster Card */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-800 mb-2 flex items-center gap-1.5">
                  <span>👥 Team Members & Innovators</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-950 text-xs font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    <span>{formatName(inspectProject.lead_student)}</span>
                    <span className="text-[9px] font-extrabold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">Team Lead</span>
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
                  <div className="font-bold text-purple-700 mt-0.5">{inspectProject.city || inspectProject.state || 'Tamil Nadu'}</div>
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
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️ Problem Statement</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-medium">
                    {inspectProject.problem_statement}
                  </div>
                </div>
              )}

              {/* Proposed Solution */}
              {inspectProject.solution && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>💡 Proposed Solution Architecture</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-medium">
                    {inspectProject.solution}
                  </div>
                </div>
              )}

              {/* USP & Outcome */}
              {(inspectProject.usp || inspectProject.outcome) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {inspectProject.usp && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                      <div className="text-[10px] font-bold uppercase text-amber-800">Competitive USP</div>
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
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    🛠️ Tech Stack & Implementation
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono text-slate-700 leading-relaxed">
                    {inspectProject.technical_summary}
                  </div>
                </div>
              )}

              {/* External Links */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                {inspectProject.github_url && (
                  <a
                    href={inspectProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
                  >
                    <span>View GitHub Code</span>
                  </a>
                )}

                {inspectProject.presentation_url && (
                  <a
                    href={inspectProject.presentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-[#1f6fb2] border border-sky-200 font-bold text-xs hover:bg-sky-100 transition-all"
                  >
                    <span>Slide Deck</span>
                  </a>
                )}

                {inspectProject.demo_url && (
                  <a
                    href={inspectProject.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all"
                  >
                    <span>Live Prototype ↗</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleCopyShareLink(inspectProject.id)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all ml-auto"
                >
                  {copiedId === inspectProject.id ? '✓ Link Copied' : 'Share Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
