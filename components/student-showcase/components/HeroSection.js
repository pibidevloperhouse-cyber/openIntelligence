'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Timer,
} from 'lucide-react';

export const HeroSection = ({
  onOpenSubmitModal,
  currency,
}) => {
  const calculateTimeLeft = () => {
    const now = Date.now();
    // Target: November 14, 2026 23:59:59 IST (Night 12:00 Midnight)
    const targetDate = new Date('2026-11-14T23:59:59+05:30').getTime();
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

            {/* Semantic Headings: h1, h2, h3 - Balanced 2-line layout, scaled up prominently */}
            <div className="space-y-4 sm:space-y-5">
              {/* Level 1: h1 */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 tracking-tight leading-[1.1]"
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                Don&apos;t Waste Your <span className="block">College Project.</span>
              </h1>

              {/* Level 2: h2 */}
              <h2
                className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-800 tracking-tight leading-[1.14]"
                style={{ fontFamily: 'var(--font-plus-jakarta)' }}
              >
                Turn your AI/ML project <span className="block">into real opportunities.</span>
              </h2>

              {/* Level 3: h3 */}
              <h3
                className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight leading-[1.18]"
                style={{
                  fontFamily: 'var(--font-plus-jakarta)',
                  background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Get Featured on <span className="block">PiBi Open Intelligence.</span>
              </h3>
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

                {/* Bottom: Text Content cleanly housed below the image */}
                <div className="p-5 sm:p-6 lg:p-7 space-y-3 bg-white border-t border-slate-100 relative z-10">
                  <h3
                    className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    National Student Project Awards
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Winning engineering & AI/ML projects get published as flagship innovations on{' '}
                    <strong className="text-[#1f6fb2] font-semibold">PiBi Open Intelligence</strong>,
                    reaching top engineering leads and investors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Horizontal Submissions Countdown Banner (Left-Right Split) */}
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto px-2">
          <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-md shadow-slate-200/50 p-5 sm:p-6 sm:px-8 overflow-hidden">
            {/* Top Accent Gradient Edge */}
            <div
              className="h-1 w-full absolute top-0 left-0"
              style={{ background: 'linear-gradient(90deg, #1f6fb2, #2ec4b6, #1f6fb2)' }}
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">
              {/* Left Side: Context & Live Status */}
              <div className="space-y-1 text-left">
                <h3
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  Submissions Countdown
                </h3>

                <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                  Deadline: <strong className="text-slate-800 font-bold">November 14, 2026 • 11:59 PM IST</strong>. Submit your working project before the timer expires to qualify for Top 3 evaluations.
                </p>
              </div>

              {/* Right Side: Compact 4 Time Blocks */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 shrink-0 w-full lg:w-auto">
                {/* Days */}
                <div className="py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs text-center min-w-[65px] sm:min-w-[80px] hover:border-[#1f6fb2]/40 transition-all">
                  <span
                    className="block text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums"
                    style={{
                      background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1f6fb2] block mt-0.5 font-stylized">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs text-center min-w-[65px] sm:min-w-[80px] hover:border-[#1f6fb2]/40 transition-all">
                  <span
                    className="block text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums"
                    style={{
                      background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1f6fb2] block mt-0.5 font-stylized">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs text-center min-w-[65px] sm:min-w-[80px] hover:border-[#1f6fb2]/40 transition-all">
                  <span
                    className="block text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums"
                    style={{
                      background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1f6fb2] block mt-0.5 font-stylized">
                    Minutes
                  </span>
                </div>

                {/* Seconds */}
                <div className="py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs text-center min-w-[65px] sm:min-w-[80px] hover:border-[#1f6fb2]/40 transition-all">
                  <span
                    className="block text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums"
                    style={{
                      background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1f6fb2] block mt-0.5 font-stylized">
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
