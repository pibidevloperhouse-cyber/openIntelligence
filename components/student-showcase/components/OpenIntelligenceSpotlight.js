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
} from 'lucide-react';

export const OpenIntelligenceSpotlight = ({
  onOpenSubmitModal,
}) => {
  const [activeTab, setActiveTab] = useState('publishing');

  return (
    <section
      id="open-intelligence"
      className="py-24 relative overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">

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
            <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setActiveTab('publishing')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'publishing'
                    ? 'text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={
                  activeTab === 'publishing'
                    ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                    : {}
                }
              >
                1. Publication
              </button>
              <button
                onClick={() => setActiveTab('reach')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'reach'
                    ? 'text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={
                  activeTab === 'reach'
                    ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                    : {}
                }
              >
                2. Global Reach
              </button>
              <button
                onClick={() => setActiveTab('career')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'career'
                    ? 'text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={
                  activeTab === 'career'
                    ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                    : {}
                }
              >
                3. Career & VC
              </button>
            </div>

            {/* Tab 1 Content */}
            {activeTab === 'publishing' && (
              <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3
                  className="text-lg font-bold text-slate-900 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  <Code2 className="w-5 h-5 text-[#1f6fb2]" />
                  <span>Dedicated Showcase on PiBi Open Intelligence</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every winning project gets an interactive feature article and dedicated profile page
                  on PiBi Open Intelligence. We showcase your problem statement, system architecture,
                  source code, and live demo.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Permanent URL: www.pibiopenintelligence.com/showcase/your-project</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Video demo and interactive sandbox embed</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Verified Author Badge on student profiles</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 Content */}
            {activeTab === 'reach' && (
              <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3
                  className="text-lg font-bold text-slate-900 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  <TrendingUp className="w-5 h-5 text-[#1f6fb2]" />
                  <span>150,000+ Worldwide Readership</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  PiBi Open Intelligence is visited by engineering managers, AI researchers, and
                  open-source contributors worldwide. Your project will be read and applauded
                  internationally.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Featured in PiBi Open Intelligence Weekly Tech Dispatch</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Social syndication across LinkedIn, X, and Dev communities</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Direct GitHub stars and open-source contributor traffic</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3 Content */}
            {activeTab === 'career' && (
              <div className="space-y-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h3
                  className="text-lg font-bold text-slate-900 flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  <Users className="w-5 h-5 text-[#1f6fb2]" />
                  <span>VC & High-Tier Recruitment Access</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Founders and venture scouts actively look for exceptional student engineers on
                  PiBi Open Intelligence. Past featured students have secured pre-seed funding and
                  interviews at top tier companies.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Direct intro to angels & seed accelerators</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Fast-tracked engineering internship interviews</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2ec4b6] shrink-0 mt-0.5" />
                    <span>Letters of Recommendation from PiBi Open Intelligence leadership</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Card */}
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Ready to get featured?</span>
                <span className="text-sm font-bold text-slate-900 font-stylized">
                  Join the 2026 Showcase
                </span>
              </div>
              <button
                onClick={onOpenSubmitModal}
                className="px-4 py-2 rounded-xl font-semibold text-xs text-white shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
              >
                Submit Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OpenIntelligenceSpotlight;
