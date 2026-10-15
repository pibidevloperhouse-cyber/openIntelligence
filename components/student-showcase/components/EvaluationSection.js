'use client';

import React from 'react';

export const EvaluationSection = () => {
  return (
    <section id="evaluation" className="pt-10 pb-12 sm:pt-12 sm:pb-16 relative overflow-hidden bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-10 sm:mb-12">
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
            A transparent evaluation process led by experienced engineers and PiBi Open Intelligence
            curators to evaluate innovation, execution, and real-world impact.
          </p>
        </div>

        {/* 4 Judging Criteria Cards - Clean Brand Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#1f6fb2]/40 hover:shadow-md transition-all">
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

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#2ec4b6]/50 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2ec4b6]/15 border border-[#2ec4b6]/30 flex items-center justify-center text-[#0e8579] mb-4 font-stylized font-bold text-lg">
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

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#1f6fb2]/40 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#1f6fb2]/10 border border-[#1f6fb2]/20 flex items-center justify-center text-[#1f6fb2] mb-4 font-stylized font-bold text-lg">
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

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#2ec4b6]/50 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#2ec4b6]/15 border border-[#2ec4b6]/30 flex items-center justify-center text-[#0e8579] mb-4 font-stylized font-bold text-lg">
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
      </div>
    </section>
  );
};

export default EvaluationSection;
