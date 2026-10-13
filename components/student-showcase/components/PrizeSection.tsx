'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Gift,
  PartyPopper,
} from 'lucide-react';
import { PRIZE_TIERS } from '../data/projectsData';

interface PrizeSectionProps {
  currency: 'INR' | 'USD';
  onOpenSubmitModal: () => void;
}

export const PrizeSection: React.FC<PrizeSectionProps> = ({
  currency,
  onOpenSubmitModal,
}) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6, x: 0.2 },
      colors: ['#1f6fb2', '#2ec4b6', '#f59e0b', '#10b981'],
    });
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6, x: 0.8 },
      colors: ['#1f6fb2', '#2ec4b6', '#f59e0b', '#10b981'],
    });
  };

  return (
    <section id="prizes" className="py-24 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">

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
              Open Intelligence Launch
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Hard work deserves real recognition. Top 3 student projects win direct cash prizes,
            official trophies, and are permanently published and featured on{' '}
            <span className="text-[#1f6fb2] font-semibold">Open Intelligence</span>.
          </p>

          {/* Interactive Confetti Button */}
          <div className="pt-1">
            <button
              onClick={triggerConfetti}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <PartyPopper className="w-4 h-4 text-[#2ec4b6]" />
              <span>Celebrate the Winners! 🎉</span>
            </button>
          </div>
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
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Award className="w-5 h-5" />
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

              {/* Open Intelligence Feature Badge */}
              <div className="p-3.5 rounded-xl bg-[#2ec4b6]/10 border border-[#2ec4b6]/30 text-xs text-slate-800 flex items-start gap-2.5">
                <ExternalLink className="w-4 h-4 text-[#0e8579] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0e8579]">Featured on Open Intelligence</strong>: Spotlight profile on Open Intelligence Projects Hub.
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

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={onOpenSubmitModal}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Compete for 2nd Place
              </button>
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
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
                  <Trophy className="w-7 h-7 text-amber-600 animate-gentle-pulse" />
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

              {/* Major Open Intelligence Launch Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1f6fb2]/10 to-[#2ec4b6]/10 border border-[#2ec4b6]/40 text-xs text-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#1f6fb2] text-sm">
                  <ExternalLink className="w-4 h-4 text-[#2ec4b6]" />
                  <span>Grand Open Intelligence Launch</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Winning project will be <strong>officially published as a Cover Story</strong> on
                  the Open Intelligence homepage with interactive demo sandbox & global newsletter blast.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="text-xs uppercase font-stylized text-slate-700 font-bold">
                  Grand Winner Benefits:
                </div>
                {PRIZE_TIERS[0].perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={onOpenSubmitModal}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                Submit Project For 1st Place
              </button>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="order-3 md:order-3 relative rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 font-stylized">
                  3rd Place • 2nd Runner Up
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Award className="w-5 h-5" />
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

              {/* Open Intelligence Feature Badge */}
              <div className="p-3.5 rounded-xl bg-[#2ec4b6]/10 border border-[#2ec4b6]/30 text-xs text-slate-800 flex items-start gap-2.5">
                <ExternalLink className="w-4 h-4 text-[#0e8579] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0e8579]">Featured on Open Intelligence</strong>: Permanent listing in Open Intelligence Innovation Directory.
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="text-xs uppercase font-stylized text-slate-500 font-semibold">Included Rewards:</div>
                {PRIZE_TIERS[2].perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={onOpenSubmitModal}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Compete for 3rd Place
              </button>
            </div>
          </div>
        </div>

        {/* Bonus recognition for all Top 10 Finalists */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1f6fb2]/10 border border-[#1f6fb2]/20 flex items-center justify-center text-[#1f6fb2] shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4
                className="text-sm font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                Perks for All Top 10 Finalists
              </h4>
              <p className="text-xs text-slate-500">
                Official Certificate of National Distinction + Free Developer Tooling Licenses + Open Intelligence Badges.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-stylized text-[#0e8579] bg-[#2ec4b6]/10 px-3 py-1 rounded-full border border-[#2ec4b6]/30 font-semibold">
              Guaranteed Certificates
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
