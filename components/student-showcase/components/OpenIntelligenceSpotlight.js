'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Globe,
  ExternalLink,
  Code2,
  Users,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Sparkles,
} from 'lucide-react';

export const OpenIntelligenceSpotlight = ({
  onOpenSubmitModal,
}) => {
  const [activeTab, setActiveTab] = useState('publishing');

  return (
    <section
      id="open-intelligence"
      className="pt-10 pb-10 sm:pt-12 sm:pb-12 relative overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-10 sm:mb-12">

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta)' }}
          >
            Winning Projects Go Live on{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PiBi Open Intelligence
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Winners don&apos;t just walk away with cash prizes. Your projects will be officially
            hosted, published, and featured as flagship innovations on{' '}
            <strong className="text-[#1f6fb2] font-semibold">PiBi Open Intelligence</strong>{' '}
            (www.pibiopenintelligence.com), giving you international visibility.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Open Intelligence Platform Preview */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
              {/* Browser chrome header bar */}
              <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-stylized text-slate-600">
                  <span className="text-[#1f6fb2]">https://</span>
                  <span>www.pibiopenintelligence.com/showcase/winners-2026</span>
                </div>
                <div className="text-[11px] font-stylized text-[#0e8579] flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#2ec4b6] animate-gentle-pulse" />
                  <span>LIVE PORTAL</span>
                </div>
              </div>

              {/* The Platform Screenshot */}
              <div className="relative aspect-[16/10] w-full bg-slate-50">
                <Image
                  src="/images/open_intelligence_demo.jpg"
                  alt="PiBi Open Intelligence Student Showcase Platform"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover"
                />
              </div>

              {/* Bottom Info Ribbon */}
              <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-[#2ec4b6]" />
                  <span className="font-medium">Verified PiBi Open Intelligence Publication Status</span>
                </div>
                <span className="text-[#1f6fb2] font-stylized font-semibold">
                  Official Launch Guarantee
                </span>
              </div>
            </div>
          </div>

          {/* Right: What You Get Tabs & Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Tab Selector */}
            <div className="flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/90 gap-1.5">
              <button
                onClick={() => setActiveTab('publishing')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'publishing'
                    ? 'text-white shadow-md shadow-[#1f6fb2]/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                style={
                  activeTab === 'publishing'
                    ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                    : {}
                }
              >
                <Code2 className="w-3.5 h-3.5 shrink-0" />
                <span>1. Publication</span>
              </button>
              <button
                onClick={() => setActiveTab('reach')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'reach'
                    ? 'text-white shadow-md shadow-[#1f6fb2]/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                style={
                  activeTab === 'reach'
                    ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                    : {}
                }
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span>2. Global Reach</span>
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'career'
                    ? 'text-white shadow-md shadow-[#1f6fb2]/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                style={
                  activeTab === 'career'
                    ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                    : {}
                }
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span>3. Career & VC</span>
              </button>
            </div>

            {/* Unified Showcase Card */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Tab 1 Content */}
              {activeTab === 'publishing' && (
                <div className="p-6 sm:p-7 space-y-4">
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight"
                      style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                    >
                      Dedicated Feature on PiBi Open Intelligence
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Every winning project gets an interactive feature article and dedicated profile page
                      on PiBi Open Intelligence. We showcase your problem statement, system architecture,
                      source code, and live demo.
                    </p>
                  </div>

                  {/* Curated Deliverables */}
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-[#1f6fb2] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Permanent URL:{' '}
                        <code className="font-mono text-[11px] bg-slate-200/70 text-slate-800 px-1.5 py-0.5 rounded">
                          /showcase/your-project
                        </code>
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-[#1f6fb2] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Video demo walkthrough and interactive sandbox embed
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-[#1f6fb2] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Verified Author Badge permanently assigned to your profile
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2 Content */}
              {activeTab === 'reach' && (
                <div className="p-6 sm:p-7 space-y-4">
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight"
                      style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                    >
                      150,000+ Worldwide Readership
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      PiBi Open Intelligence is visited by engineering managers, AI researchers, and
                      open-source contributors worldwide. Your project will be read and applauded
                      internationally.
                    </p>
                  </div>

                  {/* Curated Deliverables */}
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 text-[#0e8579] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Featured in PiBi Open Intelligence Weekly Tech Dispatch
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 text-[#0e8579] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Social syndication across LinkedIn, X, and Dev communities
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 text-[#0e8579] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Direct GitHub repository stars and open-source contributor traffic
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3 Content */}
              {activeTab === 'career' && (
                <div className="p-6 sm:p-7 space-y-4">
                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight"
                      style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                    >
                      VC & High-Tier Recruitment Access
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Founders and venture scouts actively look for exceptional student engineers on
                      PiBi Open Intelligence. Past featured students have secured pre-seed funding and
                      interviews at top tier companies.
                    </p>
                  </div>

                  {/* Curated Deliverables */}
                  <div className="space-y-2 pt-1">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Direct introductions to active angel investors & seed accelerators
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Fast-tracked engineering internship interviews with partner startups
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-medium leading-snug">
                        Executive Letters of Recommendation from PiBi leadership
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrated Centered Bottom Action Bar inside the card */}
              <div className="p-4 sm:py-5 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-center">
                <button
                  onClick={onOpenSubmitModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md shadow-[#1f6fb2]/15 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-[#1f6fb2]/25"
                  style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                >
                  <span>Submit Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OpenIntelligenceSpotlight;
