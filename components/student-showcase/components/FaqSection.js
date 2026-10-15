'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/projectsData';

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const isHoveredRef = useRef(false);

  // Auto-switch / cycle through FAQ items every 4.5 seconds (pauses on hover)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isHoveredRef.current) return;
      setOpenIndex((prev) => (prev === null ? 0 : (prev + 1) % FAQ_ITEMS.length));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="pt-10 pb-16 sm:pt-12 sm:pb-20 relative overflow-hidden bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes faqCycleProgress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `,
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3.5 mb-10 sm:mb-12">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta)' }}
          >
            Frequently Asked{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Questions
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to know about student eligibility, cash prize disbursement, and how your project
            will be featured on PiBi Open Intelligence.
          </p>
        </div>

        {/* Accordion list with smooth expanding/collapsing animation & auto-switching */}
        <div
          className="space-y-4"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onTouchStart={() => {
            isHoveredRef.current = true;
          }}
          onTouchEnd={() => {
            isHoveredRef.current = false;
          }}
        >
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#1f6fb2] shadow-md shadow-[#1f6fb2]/5 ring-2 ring-[#1f6fb2]/10'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-5.5 text-left flex items-center justify-between gap-4 cursor-pointer select-none group transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 pr-2">
                    <span className="text-[10px] font-stylized text-[#1f6fb2] uppercase tracking-wider block font-bold transition-colors">
                      {item.category}
                    </span>
                    <span
                      className={`text-base font-bold block transition-colors duration-200 ${
                        isOpen ? 'text-[#1f6fb2]' : 'text-slate-900 group-hover:text-slate-800'
                      }`}
                      style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                    >
                      {item.question}
                    </span>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl transition-all duration-300 ease-in-out shrink-0 ${
                      isOpen
                        ? 'bg-[#1f6fb2]/10 text-[#1f6fb2] rotate-180'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700 rotate-0'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* Smooth CSS Grid Height & Opacity Transition */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/90">
                      {item.answer}
                    </div>
                  </div>
                </div>

                {/* Subtle progress indicator when open & auto-cycling */}
                {isOpen && (
                  <div className="h-0.5 w-full bg-slate-100 overflow-hidden">
                    <div
                      key={`progress-${idx}`}
                      className="h-full bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6]"
                      style={{
                        animation: 'faqCycleProgress 4.5s linear infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FaqSection;
