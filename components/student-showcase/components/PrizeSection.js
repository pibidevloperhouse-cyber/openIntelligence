'use client';

import React from 'react';
import {
  Award,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { PRIZE_TIERS } from '../data/projectsData';

// Custom high-end Podium Emblems with metallic gradients & crisp vectors
const GoldTrophyIcon = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldCupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="goldPedestalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="goldStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
    </defs>
    {/* Left Handle */}
    <path
      d="M9 7H6C4.34315 7 3 8.34315 3 10C3 12.5 5 14.5 7.5 14.5H9"
      stroke="#D97706"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right Handle */}
    <path
      d="M23 7H26C27.6569 7 29 8.34315 29 10C29 12.5 27 14.5 24.5 14.5H23"
      stroke="#D97706"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Trophy Cup */}
    <path
      d="M8.5 4.5H23.5V13C23.5 17.1421 20.1421 20.5 16 20.5C11.8579 20.5 8.5 17.1421 8.5 13V4.5Z"
      fill="url(#goldCupGrad)"
      stroke="#B45309"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Cup Inner Rim */}
    <ellipse cx="16" cy="4.5" rx="7.5" ry="1.5" fill="#FEF08A" stroke="#D97706" strokeWidth="1" />
    {/* Stem */}
    <path
      d="M16 20.5V25"
      stroke="#D97706"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Pedestal Base */}
    <path
      d="M10 28.5C10 27.3954 10.8954 26.5 12 26.5H20C21.1046 26.5 22 27.3954 22 28.5V29.5H10V28.5Z"
      fill="url(#goldPedestalGrad)"
      stroke="#B45309"
      strokeWidth="1.5"
    />
    {/* Center Star on Trophy */}
    <path
      d="M16 9L16.9 11.2L19.5 11.5L17.6 13L18.2 15.5L16 14.2L13.8 15.5L14.4 13L12.5 11.5L15.1 11.2Z"
      fill="url(#goldStarGrad)"
      stroke="#B45309"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
  </svg>
);

const SilverMedalIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="silverRibbonL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1f6fb2" />
        <stop offset="100%" stopColor="#144a77" />
      </linearGradient>
      <linearGradient id="silverRibbonR" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2ec4b6" />
        <stop offset="100%" stopColor="#1b8278" />
      </linearGradient>
      <linearGradient id="silverDiscGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    {/* Left Ribbon with PiBi brand accent */}
    <path d="M11 2L8.5 14L13.5 16L15 2H11Z" fill="url(#silverRibbonL)" />
    {/* Right Ribbon with PiBi brand accent */}
    <path d="M21 2L23.5 14L18.5 16L17 2H21Z" fill="url(#silverRibbonR)" />
    {/* Circular Medallion */}
    <circle
      cx="16"
      cy="19"
      r="9.5"
      fill="url(#silverDiscGrad)"
      stroke="#64748B"
      strokeWidth="1.8"
    />
    {/* Inner decorative etched circle */}
    <circle
      cx="16"
      cy="19"
      r="7.5"
      stroke="#94A3B8"
      strokeWidth="1"
      strokeDasharray="2.5 1.5"
      fill="none"
    />
    {/* Numeral 2 */}
    <text
      x="16"
      y="19.5"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="11"
      fontWeight="900"
      fill="#334155"
      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
    >
      2
    </text>
  </svg>
);

const BronzeMedalIcon = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bronzeRibbonL" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="bronzeRibbonR" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="bronzeDiscGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Left Ribbon */}
    <path d="M11 2L8.5 14L13.5 16L15 2H11Z" fill="url(#bronzeRibbonL)" />
    {/* Right Ribbon */}
    <path d="M21 2L23.5 14L18.5 16L17 2H21Z" fill="url(#bronzeRibbonR)" />
    {/* Circular Medallion */}
    <circle
      cx="16"
      cy="19"
      r="9.5"
      fill="url(#bronzeDiscGrad)"
      stroke="#78350F"
      strokeWidth="1.8"
    />
    {/* Inner decorative etched circle */}
    <circle
      cx="16"
      cy="19"
      r="7.5"
      stroke="#FCD34D"
      strokeWidth="1"
      strokeDasharray="2.5 1.5"
      fill="none"
    />
    {/* Numeral 3 */}
    <text
      x="16"
      y="19.5"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="11"
      fontWeight="900"
      fill="#451A03"
      style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
    >
      3
    </text>
  </svg>
);

export const PrizeSection = ({
  currency,
  onOpenSubmitModal,
}) => {
  return (
    <section id="prizes" className="pt-6 pb-10 sm:pt-8 sm:pb-12 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-10 sm:mb-12">

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta)' }}
          >
            Top 3 Cash Prizes &{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Get Featured on PiBi Open Intelligence.
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Hard work deserves real recognition. Top 3 student projects win direct cash prizes,
            official trophies, and are permanently published and featured on{' '}
            <span className="text-[#1f6fb2] font-semibold">PiBi Open Intelligence</span>.
          </p>
        </div>

        {/* Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-6xl mx-auto">
          {/* 2nd Place (Silver) */}
          <div className="order-2 md:order-1 relative rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 font-stylized">
                  2nd Place • Runner Up
                </span>
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 p-[1.5px] shadow-sm shadow-slate-300/40 group-hover:scale-105 group-hover:shadow-slate-400/25 transition-all duration-300">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-white via-slate-50 to-slate-100/90 flex items-center justify-center">
                    <SilverMedalIcon className="w-7 h-7 sm:w-7.5 sm:h-7.5 drop-shadow-xs" />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase font-stylized text-slate-500 tracking-wider">
                  Cash Reward
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-stylized mt-1">
                  {currency === 'INR' ? PRIZE_TIERS[1].inrAmount : PRIZE_TIERS[1].usdAmount}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Direct Bank / UPI Transfer to Team
                </div>
              </div>

              {/* Media Feature Banner - Clean Editorial Highlight */}
              <div className="py-2.5 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <div className="font-bold text-slate-900 font-stylized text-xs sm:text-[13px] leading-tight">
                  Featured on Projects Hub
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Spotlight listing on curated directory
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="text-xs uppercase font-stylized text-slate-500 font-semibold">Included Rewards:</div>
                {PRIZE_TIERS[1].perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-[#1f6fb2] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1st Place (Gold Champion - Center Elevated) */}
          <div className="order-1 md:order-2 relative rounded-3xl p-7 sm:p-9 bg-white border-2 border-amber-300 shadow-xl flex flex-col justify-between md:-translate-y-6 hover:border-amber-400 transition-all group">
            {/* Top Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5 font-stylized">
              <Sparkles className="w-3.5 h-3.5" /> Grand Champion • 1st Place
            </div>

            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-stylized uppercase tracking-wider text-amber-700 font-bold">
                  The Gold Pinnacle
                </span>
                <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 p-[1.5px] shadow-lg shadow-amber-500/25 group-hover:scale-105 group-hover:shadow-amber-500/35 transition-all duration-300">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-amber-50 via-white to-amber-100/80 flex items-center justify-center">
                    <GoldTrophyIcon className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm animate-gentle-pulse" />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase font-stylized text-amber-800 tracking-wider font-semibold">
                  Grand Cash Prize
                </div>
                <div
                  className="text-4xl sm:text-5xl font-black font-stylized mt-1 tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {currency === 'INR' ? PRIZE_TIERS[0].inrAmount : PRIZE_TIERS[0].usdAmount}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Direct Immediate Bank Transfer + Gold Trophy
                </div>
              </div>

              {/* Media Feature Banner - Clean Editorial Highlight */}
              <div className="py-3 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <div className="font-bold text-slate-900 font-stylized text-xs sm:text-[13px] leading-tight">
                  Grand Homepage Cover Story
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Official launch on PiBi Open Intelligence
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="text-xs uppercase font-stylized text-slate-700 font-bold">
                  Grand Winner Benefits:
                </div>
                {PRIZE_TIERS[0].perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-[#1f6fb2] shrink-0 mt-0.5" />
                    <span className="font-medium">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="order-3 md:order-3 relative rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/90 font-stylized">
                  3rd Place • 2nd Runner Up
                </span>
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-amber-700 p-[1.5px] shadow-sm shadow-orange-500/20 group-hover:scale-105 group-hover:shadow-orange-500/25 transition-all duration-300">
                  <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-orange-50/80 via-white to-amber-100/70 flex items-center justify-center">
                    <BronzeMedalIcon className="w-7 h-7 sm:w-7.5 sm:h-7.5 drop-shadow-xs" />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase font-stylized text-slate-500 tracking-wider">
                  Cash Reward
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-stylized mt-1">
                  {currency === 'INR' ? PRIZE_TIERS[2].inrAmount : PRIZE_TIERS[2].usdAmount}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Direct Bank / UPI Transfer to Team
                </div>
              </div>

              {/* Media Feature Banner - Clean Editorial Highlight */}
              <div className="py-2.5 px-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
                <div className="font-bold text-slate-900 font-stylized text-xs sm:text-[13px] leading-tight">
                  Innovation Directory Listing
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Permanent archival on ecosystem index
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="text-xs uppercase font-stylized text-slate-500 font-semibold">Included Rewards:</div>
                {PRIZE_TIERS[2].perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-[#1f6fb2] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* General Submit Project CTA - Removed as requested */}
        {/* <div className="mt-10 text-center">
          <button
            onClick={onOpenSubmitModal}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
          >
            <span>Submit Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Open for all college & university students • Free to participate
          </p>
        </div> */}

        {/* Bonus recognition for all Top 10 Finalists - Sleek & Compact */}
        <div
          className="mt-8 relative rounded-2xl overflow-hidden py-5 px-6 sm:py-6 sm:px-8 shadow-lg border border-white/20 text-white max-w-4xl mx-auto"
          style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
        >
          {/* Subtle decorative background ambient glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-left flex-1 space-y-1.5">
              <h4
                className="text-base sm:text-lg font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                Perks for All Top 10 Finalists
              </h4>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl">
                Official Certificate of National Distinction + Free Developer Tooling Licenses + PiBi Open Intelligence Badges.
              </p>
            </div>

            <div className="shrink-0 sm:self-center">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm font-stylized shadow-md shadow-slate-900/15 whitespace-nowrap">
                <div className="w-6 h-6 rounded-full bg-blue-50 text-[#1f6fb2] flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-[#1f6fb2] stroke-[2.5]" />
                </div>
                <span>Guaranteed Certificates</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PrizeSection;
