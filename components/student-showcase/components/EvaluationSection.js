'use client';

import React from 'react';
import {
  Cpu,
  Sparkles,
  Target,
  PlayCircle,
} from 'lucide-react';

const CRITERIA = [
  {
    weight: '30%',
    title: 'Technical Execution',
    description:
      'Code quality, architectural scalability, system performance, test coverage, and prototype robustness.',
    tags: ['Architecture', 'Clean Code', 'Performance'],
    cardBg: 'bg-[#F0F9FF]',
    cardBorder: 'border-sky-200/90 hover:border-sky-300',
    iconColor: 'text-[#1f6fb2]',
    iconBg: 'bg-white/85 border-sky-200/90',
    badgeBg: 'bg-white/90 text-sky-900 border-sky-200/90',
    tagBg: 'bg-white/80 text-sky-950 border-sky-200/80',
    icon: Cpu,
  },
  {
    weight: '30%',
    title: 'Innovation & Novelty',
    description:
      'Originality of the concept, creative problem-solving, and novelty in applying technology to fresh challenges.',
    tags: ['Originality', 'Problem-Solving', 'Novel Tech'],
    cardBg: 'bg-[#FFFBEB]',
    cardBorder: 'border-amber-200/90 hover:border-amber-300',
    iconColor: 'text-amber-700',
    iconBg: 'bg-white/85 border-amber-200/90',
    badgeBg: 'bg-white/90 text-amber-950 border-amber-200/90',
    tagBg: 'bg-white/80 text-amber-950 border-amber-200/80',
    icon: Sparkles,
  },
  {
    weight: '25%',
    title: 'Real-World Impact',
    description:
      'Practical application, measurable efficiency gains or societal benefit, and production deployment viability.',
    tags: ['Practical Value', 'Measurable Metrics', 'Viability'],
    cardBg: 'bg-[#F0FDF4]',
    cardBorder: 'border-emerald-200/90 hover:border-emerald-300',
    iconColor: 'text-emerald-700',
    iconBg: 'bg-white/85 border-emerald-200/90',
    badgeBg: 'bg-white/90 text-emerald-950 border-emerald-200/90',
    tagBg: 'bg-white/80 text-emerald-950 border-emerald-200/80',
    icon: Target,
  },
  {
    weight: '15%',
    title: 'Working Demo & Documentation',
    description:
      'Live functional demonstration, clear setup guide, architectural walkthrough, and repository documentation.',
    tags: ['Working Prototype', 'Setup Guide', 'Live Walkthrough'],
    cardBg: 'bg-[#FFF7ED]',
    cardBorder: 'border-orange-200/90 hover:border-orange-300',
    iconColor: 'text-orange-700',
    iconBg: 'bg-white/85 border-orange-200/90',
    badgeBg: 'bg-white/90 text-orange-950 border-orange-200/90',
    tagBg: 'bg-white/80 text-orange-950 border-orange-200/80',
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
            <span
              style={{
                background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Top 3 Spots
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            A transparent evaluation process led by experienced engineers and PiBi Open Intelligence
            curators to evaluate innovation, execution, and real-world impact.
          </p>
        </div>

        {/* 4 Judging Criteria Cards - Project Awards Pastel Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CRITERIA.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${item.cardBg} border ${item.cardBorder} shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group`}
              >
                <div>
                  {/* Top Bar: Icon + Weight Pill */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${item.iconBg} border flex items-center justify-center ${item.iconColor} shadow-2xs transition-transform duration-200 group-hover:scale-110`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full border text-xs sm:text-[13px] font-black font-stylized ${item.badgeBg} shadow-2xs tracking-tight`}
                    >
                      {item.weight} Weight
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-base sm:text-lg font-black text-slate-900 mb-2 leading-snug tracking-tight"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Tags / Highlights */}
                <div className="pt-4 mt-4 border-t border-slate-900/10 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold ${item.tagBg} border shadow-2xs`}
                    >
                      <span className="text-emerald-600 font-black text-xs">✓</span>
                      {tag}
                    </span>
                  ))}
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
