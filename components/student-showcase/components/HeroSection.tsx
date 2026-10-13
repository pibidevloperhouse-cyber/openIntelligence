'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Globe,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenSubmitModal: () => void;
  currency: 'INR' | 'USD';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenSubmitModal,
  currency,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white">
      {/* Subtle soft backdrop accent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none -z-10 opacity-30"
        style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Main Headline in Plus Jakarta Sans */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]"
              style={{ fontFamily: 'var(--font-plus-jakarta)' }}
            >
              Showcase Student Projects.{' '}
              <span
                className="block mt-1.5"
                style={{
                  background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Win Top 3 Cash Rewards.
              </span>
              <span className="block mt-1 text-slate-800 text-3xl sm:text-4xl lg:text-5xl font-bold">
                Get Featured on Open Intelligence.
              </span>
            </h1>

            {/* Sub-headline in Inter */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
              Showcase outstanding student engineering innovations. Compete for{' '}
              <strong className="text-slate-900 font-semibold font-stylized">
                {currency === 'INR' ? '₹xxx' : '$xxx'} in Top 3 cash prizes
              </strong>
              . The winning projects will be officially launched and published on{' '}
              <strong className="text-[#1f6fb2] font-semibold underline decoration-[#2ec4b6] underline-offset-4">
                Open Intelligence
              </strong>{' '}
              with global reach to tech founders, recruiters, and developers.
            </p>

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

            {/* Key trust bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0" />
                <span>100% Student IP Retained</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1f6fb2] shrink-0" />
                <span>Direct Bank Transfer</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Open Intelligence Feature</span>
              </div>
            </div>

            {/* Clean Countdown Box */}
            <div className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-xs max-w-xl">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-stylized text-[#1f6fb2] font-semibold">
                  <Clock className="w-4 h-4 text-[#1f6fb2]" />
                  <span className="uppercase tracking-wider">Submissions Countdown</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold font-stylized">
                  Entries Open
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl sm:text-2xl font-bold text-slate-900 font-stylized">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-stylized">Days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl sm:text-2xl font-bold text-slate-900 font-stylized">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-stylized">Hours</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl sm:text-2xl font-bold text-slate-900 font-stylized">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-stylized">Minutes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="block text-xl sm:text-2xl font-bold text-[#1f6fb2] font-stylized">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-stylized">Seconds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Visual Graphic Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer clean border card */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
                <div className="relative aspect-[16/10] w-full bg-slate-100">
                  <Image
                    src="/images/hero_showcase_real.jpg"
                    alt="Student Tech Innovation Showcase 2026"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                </div>

                {/* Card Content Overlay */}
                <div className="p-5.5 space-y-3 relative bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-stylized uppercase tracking-wider text-[#1f6fb2] font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Top 3 Grand Prize Tier
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#2ec4b6]/15 text-[#0e8579] border border-[#2ec4b6]/30 font-stylized">
                      {currency === 'INR' ? '₹xxx Pool' : '$xxx Pool'}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold text-slate-900"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    National Student Project Awards
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Winning projects are published as featured case studies on{' '}
                    <span className="text-[#1f6fb2] font-semibold">Open Intelligence</span>,
                    reaching top engineering leads and investors.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#2ec4b6]" />
                      Verified Open Intelligence Showcase
                    </span>
                    <span className="font-stylized text-[#1f6fb2] font-semibold">Edition 2026</span>
                  </div>
                </div>
              </div>

              {/* Floating Chip 1: 1st Place */}
              <div className="absolute -top-3 left-2 sm:-left-5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white border border-amber-200 shadow-md flex items-center gap-2 sm:gap-2.5 animate-soft-float z-10">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-stylized">1st Prize</div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 font-stylized whitespace-nowrap">
                    {currency === 'INR' ? '₹xxx Cash' : '$xxx Cash'}
                  </div>
                </div>
              </div>

              {/* Floating Chip 2: Open Intelligence Launch */}
              <div className="absolute -bottom-3 right-2 sm:-right-5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white border border-[#2ec4b6]/40 shadow-md flex items-center gap-2 sm:gap-2.5 z-10">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#2ec4b6]/15 flex items-center justify-center text-[#0e8579] shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-stylized">Publishing</div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 font-stylized whitespace-nowrap">
                    Open Intelligence
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Highlight Stats Ribbon */}
        <div className="mt-14 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:border-slate-300 transition-colors">
            <span
              className="block text-2xl sm:text-3xl font-extrabold font-stylized"
              style={{
                background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {currency === 'INR' ? '₹xxx' : '$xxx'}
            </span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
              Total Cash Prize Pool
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:border-slate-300 transition-colors">
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#1f6fb2] font-stylized">
              Top 3
            </span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
              Winners Rewarded
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:border-slate-300 transition-colors">
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#2ec4b6] font-stylized">
              100%
            </span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
              Open Intelligence Featured
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs text-center hover:border-slate-300 transition-colors">
            <span className="block text-2xl sm:text-3xl font-extrabold text-slate-800 font-stylized">
              150K+
            </span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1 block">
              Global Platform Readership
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
