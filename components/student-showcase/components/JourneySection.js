'use client';

import React from 'react';
import {
  Rocket,
  Sparkles,
  Trophy,
  CheckCircle2,
  Users,
} from 'lucide-react';

const ROADMAP_STEPS = [
  {
    stepNumber: '01',
    phaseLabel: 'Phase 1',
    phasePrefix: 'Phase 1',
    phaseDate: 'Phase 1',
    shortTitle: 'Registration',
    subtitle: 'Deadline Nov 14',
    title: 'Phase 1 : Project Registration & Submissions - Deadline Nov 14',
    description:
      'Register your team and submit your working AI/ML prototypes, code repository, and demo links before November 14.',
    status: 'active',
    icon: Rocket,
    highlights: [
      'Deadline: November 14',
      'Working Prototype Demo',
      'GitHub / Code Repository',
    ],
  },
  {
    stepNumber: '02',
    phaseLabel: 'Phase 2',
    phasePrefix: 'Phase 2',
    phaseDate: 'Phase 2',
    shortTitle: 'Shortlist',
    subtitle: 'Announced Nov 30',
    title: 'Phase 2 : Shortlisted Teams Announcement - Nov 30',
    description:
      'Evaluation jury reviews submitted code, architecture, and impact metrics to announce the shortlisted teams on November 30.',
    status: 'upcoming',
    icon: Users,
    highlights: [
      'Shortlist Out: November 30',
      'Code & Architecture Review',
      'Shortlisted Teams Announcement',
    ],
  },
  {
    stepNumber: '03',
    phaseLabel: 'Phase 3: Dec 12 • Grand Finale',
    phasePrefix: 'Phase 3',
    phaseDate: 'Phase 3: Dec 12 • Grand Finale',
    shortTitle: 'Finale & Awards',
    subtitle: 'Live Demos & Prizes',
    title: 'Phase 3 : Grand Finale & Prize Distribution - Dec 12',
    description:
      'Shortlisted candidates will present their projects live at our office on December 12.Participants will demonstrate their working projects before the grand jury.The jury will evaluate each project based on innovation, functionality, and real-world impact.The Top 3 outstanding projects will be selected as winners.Winners will receive cash prizes of ₹30,000, awarded on the spot!',
    status: 'upcoming',
    icon: Trophy,
    highlights: [
      'offline Evaluation: December 12',
      'Top 3 Winners Selection',
      '₹30,000 Cash Prize Awards',
    ],
  },
];

export const JourneySection = () => {
  return (
    <section id="timeline" className="pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Timeline Roadmap - Connected Process Pipeline */}
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header row for Roadmap */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
              style={{ fontFamily: 'var(--font-plus-jakarta)' }}
            >
              3-Stage Journey to the Top 3
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Follow the clear, milestone-driven evaluation track from prototype submission to the live finale and prize distribution on December 12.
            </p>
          </div>

          {/* 3 Clean, Aligned Milestone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {ROADMAP_STEPS.map((step, idx) => {
              const isActive = step.status === 'active';
              const StepIcon = step.icon;

              return (
                <div
                  key={idx}
                  className={`group relative rounded-3xl bg-white flex flex-col justify-between transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden ${
                    isActive
                      ? 'border-2 border-[#1f6fb2] shadow-xl shadow-[#1f6fb2]/10 ring-4 ring-[#1f6fb2]/5 hover:shadow-2xl hover:shadow-[#1f6fb2]/20'
                      : 'border border-slate-200/90 shadow-xs hover:border-[#1f6fb2]/60 hover:shadow-2xl hover:shadow-[#1f6fb2]/15'
                  }`}
                >
                  {/* Top Accent Strip with smooth reveal on hover */}
                  <div
                    className={`h-1.5 w-full transition-all duration-500 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    style={{ background: 'linear-gradient(90deg, #1f6fb2, #2ec4b6)' }}
                  />

                  {/* Soft Radiant Ambient Glow on Hover */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-[#1f6fb2]/12 to-[#2ec4b6]/12 blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Inner Content */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between relative z-10">
                    {/* Subtle Watermark Number in Background with dynamic hover */}
                    <span className="absolute top-3 right-5 text-4xl sm:text-5xl font-black font-mono select-none pointer-events-none text-slate-100 group-hover:text-slate-200/80 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                      0{idx + 1}
                    </span>

                    <div>
                      {/* Header: Icon & Live/Step Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md ${
                            isActive
                              ? 'text-white shadow-md shadow-[#1f6fb2]/25 group-hover:shadow-[#1f6fb2]/40'
                              : 'bg-[#1f6fb2]/10 border border-[#1f6fb2]/20 text-[#1f6fb2] group-hover:bg-[#1f6fb2]/15 group-hover:border-[#1f6fb2]/40 group-hover:shadow-[#1f6fb2]/20'
                          }`}
                          style={
                            isActive
                              ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                              : {}
                          }
                        >
                          <StepIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-xs font-bold font-stylized shadow-2xs">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live Now
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full font-stylized bg-slate-100 text-slate-600 border border-slate-200 transition-colors group-hover:border-slate-300 group-hover:bg-slate-200/60">
                            Step 0{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4
                        className="text-lg font-bold text-slate-900 mb-3.5 leading-snug group-hover:text-[#1f6fb2] transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                      >
                        {step.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        {step.description}
                      </p>
                    </div>

                    {/* Key Highlights Micro-Chips */}
                    <div className="pt-4 mt-auto border-t border-slate-100">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 block mb-2.5 font-stylized">
                        Key Deliverables
                      </span>
                      <div className="space-y-1.5">
                        {step.highlights.map((item, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100/90 text-xs text-slate-700 font-medium transition-all duration-200 hover:bg-white hover:border-[#1f6fb2]/30 hover:shadow-xs hover:translate-x-1"
                          >
                            <div
                              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                              style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                            </div>
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
