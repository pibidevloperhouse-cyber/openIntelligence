'use client';

import React from 'react';
import {
  Cpu,
  Sparkles,
  Target,
  PlayCircle,
  Award,
} from 'lucide-react';

// Circular Score Dial Component
const CircularScoreGauge = ({ percent, strokeColor }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius; // ~125.66
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-13 h-13 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 50 50">
        {/* Background track */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke="rgba(0, 0, 0, 0.06)"
          strokeWidth="3.5"
          fill="none"
        />
        {/* Progress stroke */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs sm:text-[13px] font-black text-slate-900 font-mono tracking-tight leading-none">
          {percent}%
        </span>
      </div>
    </div>
  );
};

const CRITERIA = [
  {
    percent: 30,
    weight: '30 Pts',
    title: 'Technical Execution',
    description:
      'Code quality, architectural scalability, system performance, and prototype robustness.',
    cardBg: 'bg-[#F0F9FF]',
    cardBorder: 'border-sky-200/90 hover:border-sky-400',
    gaugeColor: '#1f6fb2',
    iconColor: 'text-[#1f6fb2]',
    iconBg: 'bg-white/90 border-sky-200/90',
    badgeBg: 'bg-sky-100/80 text-sky-900 border-sky-300/80',
    rubric: [
      { label: 'Code Quality & Clean Architecture', pts: '10 pts' },
      { label: 'System Performance & Latency', pts: '10 pts' },
      { label: 'Test Coverage & Error Handling', pts: '10 pts' },
    ],
    icon: Cpu,
  },
  {
    percent: 30,
    weight: '30 Pts',
    title: 'Innovation & Novelty',
    description:
      'Originality of concept, creative problem-solving, and novelty in applying technology.',
    cardBg: 'bg-[#FFFBEB]',
    cardBorder: 'border-amber-200/90 hover:border-amber-400',
    gaugeColor: '#d97706',
    iconColor: 'text-amber-700',
    iconBg: 'bg-white/90 border-amber-200/90',
    badgeBg: 'bg-amber-100/80 text-amber-950 border-amber-300/80',
    rubric: [
      { label: 'Originality of Core Concept', pts: '10 pts' },
      { label: 'Creative Problem-Solving', pts: '10 pts' },
      { label: 'Novel Technology Integration', pts: '10 pts' },
    ],
    icon: Sparkles,
  },
  {
    percent: 25,
    weight: '25 Pts',
    title: 'Real-World Impact',
    description:
      'Practical utility, measurable outcome metrics, and production deployment feasibility.',
    cardBg: 'bg-[#F0FDF4]',
    cardBorder: 'border-emerald-200/90 hover:border-emerald-400',
    gaugeColor: '#059669',
    iconColor: 'text-emerald-700',
    iconBg: 'bg-white/90 border-emerald-200/90',
    badgeBg: 'bg-emerald-100/80 text-emerald-950 border-emerald-300/80',
    rubric: [
      { label: 'Practical User Value & Demand', pts: '10 pts' },
      { label: 'Measurable Impact Metrics', pts: '10 pts' },
      { label: 'Deployment & Scalability', pts: '5 pts' },
    ],
    icon: Target,
  },
  {
    percent: 15,
    weight: '15 Pts',
    title: 'Working Demo & Docs',
    description:
      'Live functional demonstration, clear setup guide, and architectural documentation.',
    cardBg: 'bg-[#FFF7ED]',
    cardBorder: 'border-orange-200/90 hover:border-orange-400',
    gaugeColor: '#ea580c',
    iconColor: 'text-orange-700',
    iconBg: 'bg-white/90 border-orange-200/90',
    badgeBg: 'bg-orange-100/80 text-orange-950 border-orange-300/80',
    rubric: [
      { label: 'Working Live Prototype Link', pts: '5 pts' },
      { label: 'Comprehensive README & Docs', pts: '5 pts' },
      { label: 'Demo Video / Walkthrough', pts: '5 pts' },
    ],
    icon: PlayCircle,
  },
];

export const EvaluationSection = () => {
  return (
    <section id="evaluation" className="pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta)' }}
          >
            How Projects Are Evaluated For The{' '}
            <span className="relative inline-block">
              <span
                style={{
                  background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Top 3 Spots
              </span>
              <svg
                viewBox="0 0 160 10"
                className="w-full h-2 sm:h-2.5 max-w-[130px] sm:max-w-[150px] mx-auto block mt-1"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="evalGradUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1f6fb2" />
                    <stop offset="100%" stopColor="#2ec4b6" />
                  </linearGradient>
                </defs>
                <path
                  d="M3 3.5C38 2.2 120 2.4 157 4.2"
                  stroke="url(#evalGradUnderline)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M14 7.5C50 6.2 110 6.4 148 7.8"
                  stroke="url(#evalGradUnderline)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                />
              </svg>
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            A transparent 100-point rubric led by experienced engineers and PiBi Open Intelligence
            curators to evaluate innovation, execution, and real-world impact.
          </p>
        </div>

        {/* 4 Judging Criteria Cards - Modern Rubric Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CRITERIA.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${item.cardBg} border ${item.cardBorder} shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group`}
              >
                <div>
                  {/* Top Bar: Icon + Circular Score Gauge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${item.iconBg} border flex items-center justify-center ${item.iconColor} shadow-2xs transition-transform duration-200 group-hover:scale-110`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    {/* Circular Percentage Meter */}
                    <CircularScoreGauge percent={item.percent} strokeColor={item.gaugeColor} />
                  </div>

                  {/* Title & Description */}
                  <h3
                    className="text-base sm:text-lg font-black text-slate-900 mb-1.5 leading-snug tracking-tight"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Structured Rubric Breakdown */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-900/10">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-stylized">
                      Evaluation Breakdown
                    </div>
                    {item.rubric.map((r, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-white/75 border border-white/90 shadow-2xs group-hover:bg-white transition-colors"
                      >
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight">
                          {r.label}
                        </span>
                        <span className={`text-[10px] sm:text-[11px] font-black font-mono px-1.5 py-0.5 rounded-md shrink-0 ${item.badgeBg}`}>
                          {r.pts}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Total Points Bar */}
                <div className="mt-4 pt-3 border-t border-slate-900/10 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold uppercase tracking-wider text-slate-500 font-stylized text-[10px]">
                    Total Weight
                  </span>
                  <span className="font-black font-mono text-slate-900 px-2 py-0.5 rounded-full bg-white shadow-2xs border border-slate-200/80 text-[11px]">
                    {item.weight} of 100
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EvaluationSection;
