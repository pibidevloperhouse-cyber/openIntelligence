'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  KeyRound,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Mail,
  Info,
  Users,
  UserCheck
} from 'lucide-react';
import DigitalBadge, { generateBadgePng } from '@/components/student-showcase/components/DigitalBadge';
import { trackEvent } from '@/lib/analytics';

const LinkedInIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export default function CollectBadgeClient() {
  const searchParams = useSearchParams();
  const initialRegId = searchParams.get('regId') || '';

  const [identifier, setIdentifier] = useState(initialRegId);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [badgeData, setBadgeData] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [copiedPost, setCopiedPost] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [linkedInOpenedNotice, setLinkedInOpenedNotice] = useState(false);

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.pibiopenintelligence.com';
  const campaignUrl = `${siteOrigin}/students`;
  const badgePublicUrl = badgeData?.registrationId ? `${siteOrigin}/students/badge/${badgeData.registrationId}` : campaignUrl;

  const handleUnlock = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Registration ID or Email address.');
      return;
    }
    if (!pin.trim() || pin.trim().length < 4) {
      setError('Please enter your 4-digit Security PIN sent to your email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student-projects/badge/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          pin: pin.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Incorrect 4-digit Security PIN. Please check your confirmation email.');
        return;
      }

      setBadgeData(data.badge);
      setSelectedMember(data.badge.studentName || '');

      // Trigger Confetti Celebration
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#1f6fb2', '#2ec4b6', '#38bdf8', '#10b981', '#f59e0b'],
      });

      trackEvent('badge_unlocked_with_pin', {
        registration_id: data.badge.registrationId,
      });
    } catch (err) {
      setError('Unable to verify PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentInnovator = selectedMember || badgeData?.studentName || 'Student Innovator';
  const allTeamMembers = Array.from(new Set([
    badgeData?.studentName,
    ...(Array.isArray(badgeData?.teamMembers) ? badgeData.teamMembers : [])
  ].map(m => String(m).trim()).filter(Boolean)));

  const isCurrentLead = badgeData?.studentName && currentInnovator.toLowerCase() === badgeData.studentName.toLowerCase();

  const linkedInPostText = `🚀 I've taken a step beyond the classroom!

I've registered our AI/ML project "${badgeData?.projectTitle || 'AI/ML Project'}" for the **PiBi Open Intelligence Student Project Awards 2026**!

I believe student projects shouldn't end with a final-year presentation. They should be shared, improved, and developed further.

Proud to be recognized as an Open Intelligence Builder!

🔗 Explore the projects & register: ${campaignUrl}

#PiBiOpenIntelligence #StudentProjects #ArtificialIntelligence #MachineLearning #LearnBuildContribute`;

  const handleDownloadBadge = async () => {
    if (!badgeData) return;
    setDownloading(true);
    setDownloadError('');
    try {
      trackEvent('badge_download_clicked', { registration_id: badgeData.registrationId });
      await generateBadgePng({
        studentName: currentInnovator,
        projectTitle: badgeData.projectTitle,
        registrationId: badgeData.registrationId,
        institution: badgeData.institution,
        domain: badgeData.domain,
        dept: badgeData.dept,
        year: badgeData.year,
      });
      setDownloadSuccess(true);
      trackEvent('badge_downloaded', { registration_id: badgeData.registrationId });
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setDownloadError('Could not generate PNG. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLinkedIn = async () => {
    trackEvent('share_linkedin_clicked', { registration_id: badgeData?.registrationId });
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(linkedInPostText);
      } catch (e) {}
    }
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedInPostText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setLinkedInOpenedNotice(true);
    setTimeout(() => setLinkedInOpenedNotice(false), 6000);
  };

  const handleShareWhatsApp = () => {
    trackEvent('share_whatsapp_clicked', { registration_id: badgeData?.registrationId });
    const message = `🚀 Proud to receive my official Open Intelligence Builder Badge for "${badgeData?.projectTitle}"!\n\nView my badge: ${badgePublicUrl}\n\nRegister your student AI project: ${campaignUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPost = async () => {
    try {
      trackEvent('copy_linkedin_post', { registration_id: badgeData?.registrationId });
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
      trackEvent('copy_registration_link', { registration_id: badgeData?.registrationId });
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(badgePublicUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const pinDigits = [pin[0] || '', pin[1] || '', pin[2] || '', pin[3] || ''];

  return (
    <main className="min-h-screen bg-[#040814] text-slate-100 py-8 sm:py-14 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-200">
      {/* Background Ambient Lighting & Cyber Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f6fb2_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#1f6fb2]/25 via-[#2ec4b6]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#0284c7]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-[#2ec4b6]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto w-full space-y-8 my-auto">
        {/* Top Header & Security Navigation Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <Link
            href="/registered-students"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/40 text-xs font-bold text-slate-300 hover:text-white transition shadow-xs group"
          >
            <span className="transition-transform group-hover:-translate-x-0.5 text-teal-400">←</span>
            <span>Back to Student Showcase</span>
          </Link>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-teal-500/30 shadow-[0_0_15px_rgba(46,196,182,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ec4b6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ec4b6]"></span>
            </span>
            <span className="text-[11px] font-mono font-bold text-teal-300 tracking-wider uppercase">
              PiBi Security Verified Portal
            </span>
          </div>
        </header>

        {!badgeData ? (
          /* STEP A: LUXURY PIN VERIFICATION STAGE */
          <div className="relative max-w-xl mx-auto w-full py-4 sm:py-6">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-[#1f6fb2]/50 via-[#2ec4b6]/40 to-[#0284c7]/50 blur-2xl opacity-75 -z-10" />

            <div className="relative rounded-[28px] bg-gradient-to-b from-[#0a1428]/95 via-[#070e1e]/95 to-[#040814]/95 backdrop-blur-2xl border border-teal-500/30 p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(46,196,182,0.15)] space-y-7">
              {/* Emblem & Hero Heading */}
              <div className="text-center space-y-3">
                <div className="relative mx-auto w-20 h-20 mb-2">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#1f6fb2] via-[#0284c7] to-[#2ec4b6] blur-md opacity-75 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1f6fb2] via-[#0284c7] to-[#2ec4b6] p-[2px] shadow-2xl flex items-center justify-center">
                    <div className="w-full h-full bg-[#070e1e] rounded-[14px] flex items-center justify-center text-[#2ec4b6]">
                      <KeyRound className="w-9 h-9 text-[#2ec4b6]" />
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-extrabold tracking-widest uppercase">
                  <Sparkles className="w-3 h-3 text-[#2ec4b6]" />
                  <span>Official Recognition Credential</span>
                </div>

                <h1
                  className="text-2xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  Access Your Builder Badge
                </h1>

                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Enter your Registration ID and the secret <strong>4-digit Security PIN</strong> sent to your email to unlock your official credential.
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 shadow-sm animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-rose-200">Verification Notice</p>
                    <p className="text-xs text-rose-300/90 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleUnlock} className="space-y-5">
                {/* Field 1: Registration ID or Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Registration ID or Registered Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="PIBI-2026-BDR-XXXX or your.email@example.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#070e1e]/90 border border-slate-700/80 hover:border-slate-600 focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 text-white text-sm font-mono tracking-wide transition placeholder:text-slate-500 placeholder:font-sans outline-hidden shadow-inner"
                      required
                    />
                    {identifier && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        CONFIRMED
                      </span>
                    )}
                  </div>
                </div>

                {/* Field 2: Luxury Segmented 4-Digit PIN */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      4-Digit Security PIN
                    </label>
                    <span className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>Check email inbox</span>
                    </span>
                  </div>

                  <div className="relative">
                    {/* Native transparent input for handling mobile/desktop keyboard & paste */}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      autoFocus
                      required
                    />

                    {/* Visual Segmented 4 Boxes */}
                    <div className="grid grid-cols-4 gap-3 sm:gap-4">
                      {[0, 1, 2, 3].map((idx) => {
                        const isFilled = Boolean(pin[idx]);
                        const isCurrent = pin.length === idx || (pin.length === 4 && idx === 3);
                        return (
                          <div
                            key={idx}
                            className={`h-16 sm:h-20 rounded-2xl border-2 flex items-center justify-center font-mono text-2xl sm:text-3xl font-black transition-all duration-200 select-none ${
                              isFilled
                                ? 'border-teal-400 bg-teal-500/15 text-teal-200 shadow-[0_0_20px_rgba(46,196,182,0.35)] scale-[1.02]'
                                : isCurrent
                                ? 'border-teal-500/60 bg-slate-900/80 text-white shadow-[0_0_15px_rgba(46,196,182,0.2)] animate-pulse'
                                : 'border-slate-800 bg-slate-950/60 text-slate-500'
                            }`}
                          >
                            {isFilled ? (
                              <span>{pin[idx]}</span>
                            ) : (
                              <span className="w-2.5 h-2.5 rounded-full bg-slate-700/80" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center pt-1">
                    Click the boxes and type the 4 numbers from your confirmation email.
                  </p>
                </div>

                {/* Submit Unlock Button */}
                <button
                  type="submit"
                  disabled={loading || pin.length < 4}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1f6fb2] via-[#0284c7] to-[#2ec4b6] hover:brightness-110 active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-[0_10px_35px_-5px_rgba(46,196,182,0.45)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 group"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Security PIN...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-teal-200 transition-transform group-hover:scale-110" />
                      <span>Unlock My Builder Badge</span>
                      <ArrowRight className="w-4 h-4 text-teal-200 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Trust Indicators Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <span className="text-base block mb-0.5">🔒</span>
                  <span className="text-[10px] font-bold text-slate-300 block">Encrypted PIN</span>
                  <span className="text-[9px] text-slate-400">Strict Auth</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <span className="text-base block mb-0.5">🏆</span>
                  <span className="text-[10px] font-bold text-slate-300 block">Official Badge</span>
                  <span className="text-[9px] text-slate-400">Verified Award</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <span className="text-base block mb-0.5">🚀</span>
                  <span className="text-[10px] font-bold text-slate-300 block">1-Click Share</span>
                  <span className="text-[9px] text-slate-400">LinkedIn Ready</span>
                </div>
              </div>

              {/* Spam Help Notice */}
              <div className="p-3.5 bg-slate-900/70 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 text-center leading-relaxed">
                Didn&apos;t receive the PIN? Check your <strong>Spam / Updates folder</strong> for an email sent from <strong className="text-teal-300">openintelligencepibi@gmail.com</strong>.
              </div>
            </div>
          </div>
        ) : (
          /* STEP B: UNLOCKED DIGITAL BADGE & ACTIONS */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Security PIN Verified · Badge Unlocked</span>
              </div>

              <h1
                className="text-2xl sm:text-4xl font-black text-white tracking-tight"
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                {currentInnovator}&apos;s Builder Badge
              </h1>

              <p className="text-xs sm:text-sm text-slate-400">
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
                    const isLead = member.toLowerCase() === (badgeData.studentName || '').toLowerCase();
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

            {/* Official Badge Display (Rendered from public/docs/pibi.pdf) */}
            <div className="py-2">
              <DigitalBadge
                studentName={currentInnovator}
                institution={badgeData.institution}
                dept={badgeData.dept}
                year={badgeData.year}
                projectTitle={badgeData.projectTitle}
                registrationId={badgeData.registrationId}
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
                <span className="font-bold text-slate-200 truncate block">{badgeData.institution || 'Engineering College'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Department & Year</span>
                <span className="font-bold text-[#2ec4b6] truncate block">{[badgeData.year, badgeData.dept].filter(Boolean).join(' • ') || 'Engineering 2026'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration ID</span>
                <span className="font-mono font-bold text-teal-300 truncate block">{badgeData.registrationId}</span>
              </div>
            </div>

            {/* Action Buttons: Download & Share on LinkedIn Side-by-Side */}
            <div className="rounded-3xl bg-[#0b162c] border border-slate-800 p-5 sm:p-7 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Button 1: Download Badge Image */}
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

                {/* Button 2: Share on LinkedIn */}
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
                  <span>LinkedIn feed opened in new tab! Post text has been copied to your clipboard. Simply paste and attach your badge.</span>
                </div>
              )}

              {downloadError && (
                <div className="text-center text-xs text-rose-400 font-semibold">{downloadError}</div>
              )}

              {/* Secondary Actions: WhatsApp & Public Link */}
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

              {/* LinkedIn Post Text Template Preview */}
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
        )}
      </div>
    </main>
  );
}
