'use client';

import React from 'react';
import {
  Calendar,
  Award,
} from 'lucide-react';
import { TIMELINE_STEPS } from '../data/projectsData';

export const EvaluationSection: React.FC = () => {
  return (
    <section id="timeline" className="py-24 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">

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

          <p className="text-slate-600 text-base sm:text-lg">
            A transparent evaluation process led by experienced engineers and Open Intelligence
            curators to evaluate innovation, execution, and real-world impact.
          </p>
        </div>

        {/* 4 Judging Criteria Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#1f6fb2]/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#1f6fb2]/10 border border-[#1f6fb2]/20 flex items-center justify-center text-[#1f6fb2] mb-4 font-stylized font-bold text-lg">
              30%
            </div>
            <h3
              className="text-base font-bold text-slate-900 mb-2"
              style={{ fontFamily: 'var(--font-plus-jakarta)' }}
            >
              Technical Execution
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Code quality, architectural scalability, system performance, test coverage, and
              robustness of the prototype.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-400/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 font-stylized font-bold text-lg">
              30%
            </div>
            <h3
              className="text-base font-bold text-slate-900 mb-2"
              style={{ fontFamily: 'var(--font-plus-jakarta)' }}
            >
              Innovation & Novelty
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Originality of the concept, creative problem-solving, and novelty in applying technology
              to fresh problem spaces.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#2ec4b6]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2ec4b6]/15 border border-[#2ec4b6]/30 flex items-center justify-center text-[#0e8579] mb-4 font-stylized font-bold text-lg">
              25%
            </div>
            <h3
              className="text-base font-bold text-slate-900 mb-2"
              style={{ fontFamily: 'var(--font-plus-jakarta)' }}
            >
              Real-World Impact
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Practical application, measurable metrics (efficiency gains, accuracy, societal benefit),
              and feasibility in production.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-400/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4 font-stylized font-bold text-lg">
              15%
            </div>
            <h3
              className="text-base font-bold text-slate-900 mb-2"
              style={{ fontFamily: 'var(--font-plus-jakarta)' }}
            >
              UX & Live Demo
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Intuitive user experience, working demonstration links, documentation clarity, and
              visual presentation.
            </p>
          </div>
        </div>

        {/* Timeline Roadmap */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h3
              className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-plus-jakarta)' }}
            >
              <Calendar className="w-6 h-6 text-[#1f6fb2]" />
              <span>Competition Roadmap</span>
            </h3>
          </div>

          <div className="space-y-4">
            {TIMELINE_STEPS.map((step, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  step.status === 'active'
                    ? 'bg-white border-[#2ec4b6] shadow-sm'
                    : 'bg-white/80 border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-stylized font-semibold px-2.5 py-0.5 rounded-full ${
                        step.status === 'active'
                          ? 'bg-[#2ec4b6]/15 text-[#0e8579] border border-[#2ec4b6]/30'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {step.date}
                    </span>
                    {step.status === 'active' && (
                      <span className="text-xs font-stylized text-[#1f6fb2] flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#2ec4b6] animate-gentle-pulse" />
                        CURRENT PHASE
                      </span>
                    )}
                  </div>
                  <h4
                    className="text-lg font-bold text-slate-900"
                    style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600">{step.description}</p>
                </div>

                <div className="shrink-0">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl block text-center font-stylized ${
                      step.status === 'active'
                        ? 'text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                    style={
                      step.status === 'active'
                        ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                        : {}
                    }
                  >
                    Step 0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
