'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  Users,
  UserCheck,
} from 'lucide-react';
import DigitalBadge, { generateBadgePng } from '@/components/student-showcase/components/DigitalBadge';
import { trackEvent } from '@/lib/analytics';

const LinkedInIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export default function PublicBadgeClient({ badgeData }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [linkedInOpenedNotice, setLinkedInOpenedNotice] = useState(false);

  const {
    registrationId,
    studentName,
    projectTitle,
    institution,
    domain,
    dept,
    year,
    teamMembers,
    createdAt,
  } = badgeData;

  const [selectedMember, setSelectedMember] = useState(studentName || '');

  const allTeamMembers = Array.from(new Set([
    studentName,
    ...(Array.isArray(teamMembers) ? teamMembers : [])
  ].map(m => String(m).trim()).filter(Boolean)));

  const currentInnovator = selectedMember || studentName || 'Student Innovator';

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.pibiopenintelligence.com';
  const badgeUrl = `${siteOrigin}/students/badge/${registrationId}`;
  const campaignUrl = `${siteOrigin}/students`;

  useEffect(() => {
    trackEvent('public_badge_viewed', {
      registration_id: registrationId,
      domain,
    });
  }, [registrationId, domain]);

  const isMemberSelected = selectedMember && selectedMember !== studentName;
  const publicShareUrl = `https://www.pibiopenintelligence.com/students/badge/${encodeURIComponent(registrationId)}${isMemberSelected ? `?member=${encodeURIComponent(selectedMember)}` : ''}`;

  const linkedInPostText = `🚀 I've taken a step beyond the classroom!

I've registered our AI/ML project "${projectTitle || 'AI/ML Project'}" for the **PiBi Open Intelligence Student Project Awards 2026**!

I believe student projects shouldn't end with a final-year presentation. They should be shared, improved, and developed further.

Proud to be recognized as an Open Intelligence Builder!

🔗 View my Official Builder Badge: ${publicShareUrl}

#PiBiOpenIntelligence #StudentProjects #ArtificialIntelligence #MachineLearning #LearnBuildContribute`;

  const handleDownloadBadge = async () => {
    setDownloading(true);
    setDownloadError('');
    try {
      trackEvent('badge_download_clicked', { registration_id: registrationId });
      await generateBadgePng({
        studentName: currentInnovator,
        projectTitle,
        registrationId,
        institution,
        domain,
        dept,
        year,
      });
      setDownloadSuccess(true);
      trackEvent('badge_downloaded', { registration_id: registrationId });
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setDownloadError('Could not generate PNG. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLinkedIn = async () => {
    trackEvent('share_linkedin_clicked', { registration_id: registrationId });
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(linkedInPostText);
      } catch (e) {}
    }
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInPostText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setLinkedInOpenedNotice(true);
    setTimeout(() => setLinkedInOpenedNotice(false), 8000);
  };

  const handleShareWhatsApp = () => {
    trackEvent('share_whatsapp_clicked', { registration_id: registrationId });
    const message = `🚀 Proud to share my Open Intelligence Builder Badge for "${projectTitle}" at the PiBi Open Intelligence Student Project Awards 2026!\n\nView my badge: ${badgeUrl}\n\nSubmit your AI project: ${campaignUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPost = async () => {
    try {
      trackEvent('copy_linkedin_post', { registration_id: registrationId });
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(linkedInPostText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = linkedInPostText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = async () => {
    try {
      trackEvent('copy_registration_link', { registration_id: registrationId });
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(badgeUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#070e1e] text-slate-100 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#1f6fb2]/20 via-[#2ec4b6]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar / Return to Hub */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <Link
            href="/students"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <span>← Back to Student Showcase</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Verified Registration
            </span>
          </div>
        </div>

        {/* Public Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[#2ec4b6] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Student Registration Badge</span>
          </div>

          <h1
            className="text-2xl sm:text-4xl font-black text-white tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta)' }}
          >
            {currentInnovator} is an Open Intelligence Builder
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            PiBi Open Intelligence · Student Project Awards 2026
          </p>
        </div>

        {/* Team Members Selector (if multiple members registered) */}
        {allTeamMembers.length > 1 && (
          <div className="p-4 rounded-2xl bg-[#0b162c] border border-slate-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#2ec4b6]" />
                <span>Team Members ({allTeamMembers.length})</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Click any team member to view & download their personalized badge
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {allTeamMembers.map((member, idx) => {
                const isLead = member.toLowerCase() === (studentName || '').toLowerCase();
                const active = currentInnovator.toLowerCase() === member.toLowerCase();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6] text-white shadow-md'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700/70 hover:border-slate-500'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-teal-300" />
                    <span>{member}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        active ? 'bg-black/30 text-teal-100' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isLead ? 'Lead' : 'Member'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* The Badge Component (Rendered from public/docs/pibi.pdf) */}
        <div className="py-2">
          <DigitalBadge
            studentName={currentInnovator}
            institution={institution}
            dept={dept}
            year={year}
            projectTitle={projectTitle}
            registrationId={registrationId}
          />
        </div>

        {/* Student Details Summary Bar */}
        <div className="p-4 rounded-2xl bg-[#0b162c] border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Innovator</span>
            <span className="font-bold text-white truncate block">{currentInnovator}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution / College</span>
            <span className="font-bold text-slate-200 truncate block">{institution || 'Engineering College'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Department & Year</span>
            <span className="font-bold text-[#2ec4b6] truncate block">{[year, dept].filter(Boolean).join(' • ') || 'Engineering 2026'}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration ID</span>
            <span className="font-mono font-bold text-teal-300 truncate block">{registrationId}</span>
          </div>
        </div>

        {/* Actions Container */}
        <div className="rounded-3xl bg-[#0b162c] border border-slate-800/90 p-5 sm:p-7 space-y-4 shadow-2xl">
          {/* Primary Action Buttons: Download & LinkedIn Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={handleDownloadBadge}
              disabled={downloading}
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#1f6fb2] via-[#0284c7] to-[#2ec4b6] hover:opacity-95 text-white font-extrabold text-sm sm:text-base shadow-xl transition cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98"
            >
              {downloading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating High-Res PNG...</span>
                </>
              ) : downloadSuccess ? (
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
              onClick={handleShareLinkedIn}
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white font-extrabold text-sm sm:text-base shadow-xl transition cursor-pointer hover:scale-[1.01] active:scale-98"
            >
              <LinkedInIcon className="w-5 h-5" />
              <span>Share on LinkedIn</span>
            </button>
          </div>

          {linkedInOpenedNotice && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>LinkedIn opened in new tab! Post text has been copied to your clipboard. Simply paste and attach your badge.</span>
            </div>
          )}

          {downloadError && (
            <div className="text-center text-xs text-rose-400 font-semibold">{downloadError}</div>
          )}

          {/* Secondary Actions: WhatsApp & Copy Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1eb956] text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Badge URL'}</span>
            </button>
          </div>

          {/* LinkedIn Template */}
          <div className="p-4 rounded-2xl bg-[#070e1e] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2ec4b6]" />
                <span>Official LinkedIn Post Template</span>
              </span>

              <button
                type="button"
                onClick={handleCopyPost}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2ec4b6] hover:bg-[#28ad9f] text-slate-950 font-extrabold text-xs transition cursor-pointer"
              >
                {copiedPost ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPost ? 'Copied!' : 'Copy Post'}</span>
              </button>
            </div>

            <div className="p-3 bg-[#050a16] rounded-xl border border-slate-800 text-xs font-sans text-slate-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {linkedInPostText}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Download your badge above and attach it to your LinkedIn post.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
