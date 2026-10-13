'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUp, Sparkles, Mail } from 'lucide-react';

interface FooterProps {
  onOpenSubmitModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSubmitModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs shrink-0">
                <Image
                  src="/pii.webp"
                  alt="Pibi Tech Logo"
                  width={34}
                  height={34}
                  className="object-contain"
                />
              </div>
              <div>
                <span
                  className="font-extrabold text-xl tracking-tight text-slate-900 block"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  PIBI TECH
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
              PIBI TECH is dedicated to empowering student creators and engineers.
              Rewarding Top 3 student projects with direct cash prizes and launching their innovations
              globally on the Open Intelligence ecosystem.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-slate-600">
              <Mail className="w-4 h-4 text-[#1f6fb2]" />
              <span className="font-stylized">Contact: hello@pibitech.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-stylized uppercase tracking-wider text-slate-700 font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#showcase" className="hover:text-[#1f6fb2] transition-colors">
                  Project Gallery
                </a>
              </li>
              <li>
                <a href="#prizes" className="hover:text-[#1f6fb2] transition-colors">
                  Top 3 Cash Prizes
                </a>
              </li>
              <li>
                <a href="#open-intelligence" className="hover:text-[#0e8579] transition-colors">
                  Open Intelligence Publishing
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-[#1f6fb2] transition-colors">
                  Key Milestones
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#1f6fb2] transition-colors">
                  FAQ & Rules
                </a>
              </li>
            </ul>
          </div>

          {/* Open Intelligence Callout */}
          <div className="space-y-3">
            <h4 className="text-xs font-stylized uppercase tracking-wider text-slate-700 font-bold">
              Pibi Tech Innovation Hub
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official student project showcase and open technology accelerator.
            </p>
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Submit Project</span>
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 PIBI TECH Student Showcase. In official partnership with{' '}
            <strong className="text-slate-700">Open Intelligence</strong>.
          </div>

          <div className="flex items-center gap-4">
            <span className="font-stylized">Built with Next.js & Tailwind CSS</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
