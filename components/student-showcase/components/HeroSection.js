'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Timer,
  Clock,
  Calendar,
} from 'lucide-react';

// Hand-drawn doodle crown matching reference mockup
const HandDrawnCrown = ({ className = 'w-6 h-5' }) => (
  <svg viewBox="0 0 30 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 20L4.5 7.5L10 13.5L15 3.5L20 13.5L25.5 7.5L27 20H3Z"
      stroke="#1e293b"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#FEF08A"
      fillOpacity="0.4"
    />
    <circle cx="4.5" cy="7.5" r="1.3" fill="#1e293b" />
    <circle cx="15" cy="3.5" r="1.5" fill="#1e293b" />
    <circle cx="25.5" cy="7.5" r="1.3" fill="#1e293b" />
  </svg>
);

// Hand-drawn double underline strokes
const HandDrawnUnderline = ({ className = 'w-24 h-2' }) => (
  <svg viewBox="0 0 100 8" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 3C28 1.8 68 2.2 98 3.5"
      stroke="#1e293b"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M12 6.5C36 5.5 65 5.8 88 6.5"
      stroke="#334155"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// Hand-drawn doodle timer / stopwatch matching reference mockup
const HandDrawnTimer = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Top button & winder */}
    <path d="M12 3.5H20M16 3.5V6" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M23.5 7L26 4.5" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
    {/* Body */}
    <circle
      cx="16"
      cy="18"
      r="10.5"
      stroke="#1e293b"
      strokeWidth="2.2"
      fill="#FEF08A"
      fillOpacity="0.45"
    />
    {/* Clock hands */}
    <path d="M16 18V12M16 18L20 20" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="16" cy="18" r="1.5" fill="#1e293b" />
    {/* Accent sketch rays */}
    <path d="M28.5 14L30.5 13M3.5 14L1.5 13" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// Custom Award Trophy with rank number (1, 2, 3), radiating sketch rays, and metallic finish
const AwardTrophy = ({ rank = 1, className = 'w-10 h-10' }) => {
  const configs = {
    1: {
      cupFill: 'url(#goldCupGradHero)',
      cupBorder: '#92400E',
      handleBorder: '#B45309',
      baseFill: 'url(#goldBaseGradHero)',
      rayColor: '#B45309',
      numColor: '#FFFFFF',
      innerRim: '#FEF3C7',
    },
    2: {
      cupFill: 'url(#silverCupGradHero)',
      cupBorder: '#334155',
      handleBorder: '#475569',
      baseFill: 'url(#silverBaseGradHero)',
      rayColor: '#475569',
      numColor: '#FFFFFF',
      innerRim: '#F1F5F9',
    },
    3: {
      cupFill: 'url(#bronzeCupGradHero)',
      cupBorder: '#7C2D12',
      handleBorder: '#9A3412',
      baseFill: 'url(#bronzeBaseGradHero)',
      rayColor: '#9A3412',
      numColor: '#FFFFFF',
      innerRim: '#FFEDD5',
    },
  };

  const cfg = configs[rank] || configs[1];

  return (
    <svg viewBox="0 0 46 42" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldCupGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="goldBaseGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="silverCupGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="40%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="silverBaseGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <linearGradient id="bronzeCupGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="40%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient id="bronzeBaseGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C2410C" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
      </defs>

      {/* Radiating Sparkle Doodle Rays (Top-Right) */}
      <line x1="33" y1="9" x2="39" y2="4" stroke={cfg.rayColor} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="36" y1="13" x2="43" y2="12" stroke={cfg.rayColor} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="34" y1="18" x2="40" y2="21" stroke={cfg.rayColor} strokeWidth="2.2" strokeLinecap="round" />

      {/* Left Handle */}
      <path
        d="M12 12C6.8 12 5 15.5 5 18C5 21.5 7.5 23 12 23"
        stroke={cfg.handleBorder}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Right Handle */}
      <path
        d="M26 12C31.2 12 33 15.5 33 18C33 21.5 30.5 23 26 23"
        stroke={cfg.handleBorder}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Trophy Body */}
      <path
        d="M11 8H27V19.5C27 24 23.5 27 19 27C14.5 27 11 24 11 19.5V8Z"
        fill={cfg.cupFill}
        stroke={cfg.cupBorder}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Rim */}
      <ellipse cx="19" cy="8" rx="8" ry="1.8" fill={cfg.innerRim} stroke={cfg.cupBorder} strokeWidth="1.2" />

      {/* Stem */}
      <path d="M19 27V32" stroke={cfg.cupBorder} strokeWidth="3" strokeLinecap="round" />

      {/* Pedestal Base */}
      <path
        d="M13 33C13 32.2 13.8 31.5 14.8 31.5H23.2C24.2 31.5 25 32.2 25 33V35.5H13V33Z"
        fill={cfg.baseFill}
        stroke={cfg.cupBorder}
        strokeWidth="1.5"
      />

      {/* Rank Number Inside Cup */}
      <text
        x="19"
        y="18.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="900"
        fill={cfg.numColor}
        style={{
          fontFamily: 'var(--font-plus-jakarta), sans-serif',
          filter: 'drop-shadow(0px 1px 1.5px rgba(0, 0, 0, 0.4))',
        }}
      >
        {rank}
      </text>
    </svg>
  );
};

export const HeroSection = ({
  onOpenSubmitModal,
  currency,
}) => {
  const [deadlineString, setDeadlineString] = useState('2026-11-14T23:59:59+05:30');

  const calculateTimeLeft = (dl = deadlineString) => {
    const now = Date.now();
    let targetDate = new Date(dl).getTime();
    if (isNaN(targetDate)) {
      targetDate = new Date('2026-11-14T23:59:59+05:30').getTime();
    }
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      isClosed: false,
    };
  };

  const [hasMounted, setHasMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isClosed: false });

  // Fetch deadline dynamically from settings API
  useEffect(() => {
    fetch('/api/student-projects/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.countdownDeadline) {
          setDeadlineString(data.countdownDeadline);
          setTimeLeft(calculateTimeLeft(data.countdownDeadline));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setHasMounted(true);
    setTimeLeft(calculateTimeLeft(deadlineString));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadlineString));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineString]);

  const formattedDeadline = useMemo(() => {
    try {
      const dt = new Date(deadlineString);
      if (isNaN(dt.getTime())) return 'November 14, 2026 • 11:59 PM IST';
      return (
        dt.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }) +
        ' • ' +
        dt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    } catch {
      return 'November 14, 2026 • 11:59 PM IST';
    }
  }, [deadlineString]);

  return (
    <section className="relative pt-12 pb-8 sm:pb-10 md:pt-16 md:pb-12 overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white">
      {/* Subtle soft backdrop accent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none -z-10 opacity-30"
        style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Semantic Headings: h1, h2, h3 - Mobile-compact layout while preserving full desktop grandeur */}
            <div className="space-y-2 sm:space-y-4 lg:space-y-5">
              {/* Level 1: h1 */}
              <h1
                className="text-[28px] sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 tracking-tight leading-[1.12] sm:leading-[1.1]"
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                Don&apos;t Waste Your <span className="block">College Project.</span>
              </h1>

              {/* Level 2: h2 */}
              <h2
                className="text-[17px] sm:text-3xl lg:text-[44px] font-bold sm:font-extrabold text-slate-800 tracking-tight leading-[1.25] sm:leading-[1.14]"
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                Turn your AI/ML project <span className="block">into real opportunities.</span>
              </h2>

              {/* Level 3: h3 */}
              <div className="relative inline-block text-center lg:text-left">
                <h3
                  className="text-[18px] sm:text-3xl lg:text-[40px] font-extrabold tracking-tight leading-[1.25] sm:leading-[1.18]"
                  style={{
                    fontFamily: 'var(--font-plus-jakarta)',
                    background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Get Cash Prizes & Featured on{' '}
                  <span className="block">PiBi Open Intelligence.</span>
                </h3>

                {/* Hand-drawn double underline in brand blue-to-teal gradient */}
                <svg
                  viewBox="0 0 320 12"
                  className="w-full h-2.5 sm:h-3.5 max-w-sm sm:max-w-md lg:max-w-lg mt-1.5 mx-auto lg:mx-0 block"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="heroLevel3Underline" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1f6fb2" />
                      <stop offset="100%" stopColor="#2ec4b6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M4 4C80 2.2 240 2.5 316 4.8"
                    stroke="url(#heroLevel3Underline)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M20 9C95 7.2 225 7.5 298 9.2"
                    stroke="url(#heroLevel3Underline)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeOpacity="0.85"
                  />
                </svg>
              </div>
            </div>
  
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenSubmitModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base text-white shadow-lg shadow-[#1f6fb2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                <span>Submit Your Project Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#prizes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs transition-all"
              >
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>View Top 3 Prizes</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card (Full Clear Photo on Top + Clean Content Below) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-[32px] overflow-hidden border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 flex flex-col group transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:border-slate-300 transform-gpu backface-hidden">
                {/* Full Photographic Canvas (Shows Students, Laptops, Code & Hardware clearly in full) */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 transform-gpu">
                  <Image
                    src="/images/hero_showcase_real.jpg"
                    alt="Student Tech Innovation Showcase 2026"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform transform-gpu"
                  />
                </div>

                {/* Bottom: Project Awards Showcase with 1st, 2nd, 3rd Prize Trophies */}
                <div className="p-4 sm:p-5 lg:p-6 space-y-3.5 bg-white border-t border-slate-100 relative z-10">
                  {/* Header Row: Doodle Crown + Project Awards Title */}
                  <div className="flex items-center gap-2">
                    <div className="pt-0.5">
                      <HandDrawnCrown className="w-6 h-5 text-slate-800 -rotate-6" />
                    </div>
                    <div>
                      <h3
                        className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none"
                        style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                      >
                        Project Awards
                      </h3>
                      <HandDrawnUnderline className="w-24 sm:w-28 h-2 text-slate-800 mt-1" />
                    </div>
                  </div>

                  {/* 3 Prize Cards Grid (1st, 2nd, 3rd) */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {/* 1st Prize */}
                    <div className="relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between bg-[#FFFBEB] border border-amber-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 group/p1">
                      <AwardTrophy rank={1} className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 group-hover/p1:scale-110" />
                      <div className="mt-1.5">
                        <span className="block text-sm sm:text-base lg:text-[17px] font-black text-slate-900 tracking-tight leading-tight">
                          {currency === 'INR' ? '₹15,000' : '$180'}
                        </span>
                        <span className="block text-[10px] sm:text-[11px] font-bold text-amber-900/80 mt-0.5 leading-tight">
                          First Prize
                        </span>
                      </div>
                    </div>

                    {/* 2nd Prize */}
                    <div className="relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between bg-[#F0F9FF] border border-sky-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all duration-200 group/p2">
                      <AwardTrophy rank={2} className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 group-hover/p2:scale-110" />
                      <div className="mt-1.5">
                        <span className="block text-sm sm:text-base lg:text-[17px] font-black text-slate-900 tracking-tight leading-tight">
                          {currency === 'INR' ? '₹10,000' : '$120'}
                        </span>
                        <span className="block text-[10px] sm:text-[11px] font-bold text-slate-600 mt-0.5 leading-tight">
                          Second Prize
                        </span>
                      </div>
                    </div>

                    {/* 3rd Prize */}
                    <div className="relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between bg-[#FFF7ED] border border-orange-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all duration-200 group/p3">
                      <AwardTrophy rank={3} className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 group-hover/p3:scale-110" />
                      <div className="mt-1.5">
                        <span className="block text-sm sm:text-base lg:text-[17px] font-black text-slate-900 tracking-tight leading-tight">
                          {currency === 'INR' ? '₹5,000' : '$60'}
                        </span>
                        <span className="block text-[10px] sm:text-[11px] font-bold text-orange-950/80 mt-0.5 leading-tight">
                          Third Prize
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Countdown Banner styled with Project Awards theme */}
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto px-2">
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-6 sm:px-8 overflow-hidden">
            {/* Top Accent Gradient Edge */}
            <div
              className="h-1 w-full absolute top-0 left-0"
              style={{ background: 'linear-gradient(90deg, #1f6fb2, #2ec4b6, #1f6fb2)' }}
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">
              {/* Left Side: Doodle Header & Submissions Deadline Info */}
              <div className="space-y-2 text-left">
                {/* Header Row: Doodle Timer + Title + HandDrawnUnderline */}
                <div className="flex items-center gap-2">
                  <div className="pt-0.5">
                    <HandDrawnTimer className="w-6 h-6 text-slate-800 -rotate-6" />
                  </div>
                  <div>
                    <h3
                      className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none"
                      style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                    >
                      Submissions Countdown
                    </h3>
                    <HandDrawnUnderline className="w-28 sm:w-36 h-2 text-slate-800 mt-1" />
                  </div>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-500 max-w-md leading-relaxed pt-1">
                  Deadline: <strong className="text-slate-900 font-bold">{formattedDeadline}</strong>. Submit your working project before the timer expires to qualify for Top 3 evaluations.
                </p>
              </div>

              {/* Right Side: 4 Themed Prize-Style Time Cards */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5 shrink-0 w-full lg:w-auto">
                {/* Days - Sky Blue Theme */}
                <div className="relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between bg-[#F0F9FF] border border-sky-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 transition-all duration-200 group/day min-w-[65px] sm:min-w-[80px]">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 transition-transform duration-200 group-hover/day:scale-110" />
                  <div className="my-1">
                    <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight tabular-nums font-mono leading-tight">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="block text-[10px] sm:text-[11px] font-bold text-sky-900/80 uppercase tracking-wider leading-tight">
                    Days
                  </span>
                </div>

                {/* Hours - Amber Yellow Theme */}
                <div className="relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between bg-[#FFFBEB] border border-amber-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 group/hour min-w-[65px] sm:min-w-[80px]">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 transition-transform duration-200 group-hover/hour:scale-110" />
                  <div className="my-1">
                    <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight tabular-nums font-mono leading-tight">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="block text-[10px] sm:text-[11px] font-bold text-amber-900/80 uppercase tracking-wider leading-tight">
                    Hours
                  </span>
                </div>

                {/* Minutes - Emerald Green Theme */}
                <div className="relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between bg-[#F0FDF4] border border-emerald-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 group/min min-w-[65px] sm:min-w-[80px]">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 transition-transform duration-200 group-hover/min:scale-110" />
                  <div className="my-1">
                    <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight tabular-nums font-mono leading-tight">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="block text-[10px] sm:text-[11px] font-bold text-emerald-900/80 uppercase tracking-wider leading-tight">
                    Minutes
                  </span>
                </div>

                {/* Seconds - Orange Peach Theme */}
                <div className="relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between bg-[#FFF7ED] border border-orange-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all duration-200 group/sec min-w-[65px] sm:min-w-[80px]">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 transition-transform duration-200 group-hover/sec:scale-110 animate-pulse" />
                  <div className="my-1">
                    <span className="block text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight tabular-nums font-mono leading-tight">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="block text-[10px] sm:text-[11px] font-bold text-orange-950/80 uppercase tracking-wider leading-tight">
                    Seconds
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
