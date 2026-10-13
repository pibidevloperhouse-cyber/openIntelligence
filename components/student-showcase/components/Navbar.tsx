'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, Globe, Award, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenSubmitModal: () => void;
  currency: 'INR' | 'USD';
  onToggleCurrency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSubmitModal,
  currency,
  onToggleCurrency,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-[68px] left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-2.5'
          : 'bg-white/80 backdrop-blur-xs py-3 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with pii.webp */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <Image
                src="/pii.webp"
                alt="Pibi Tech Logo"
                width={34}
                height={34}
                priority
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
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-stylized">
                Student Project Innovation 2026
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="#showcase"
              className="hover:text-[#1f6fb2] transition-colors"
            >
              Projects Showcase
            </a>
            <a
              href="#prizes"
              className="hover:text-[#1f6fb2] transition-colors flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Top 3 Prizes</span>
            </a>
            <a
              href="#open-intelligence"
              className="hover:text-[#0e8579] transition-colors flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-[#2ec4b6]" />
              <span>Open Intelligence</span>
            </a>
            <a
              href="#timeline"
              className="hover:text-[#1f6fb2] transition-colors"
            >
              Timeline
            </a>
            <a
              href="#faq"
              className="hover:text-[#1f6fb2] transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Currency toggle */}
            <button
              onClick={onToggleCurrency}
              title="Toggle Currency Display"
              className="px-2.5 py-1 text-xs font-stylized font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Currency:{' '}
              <span className="text-[#1f6fb2] font-bold">
                {currency === 'INR' ? '₹ INR' : '$ USD'}
              </span>
            </button>

            {/* Submit Project Button */}
            <button
              onClick={onOpenSubmitModal}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Submit Project</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleCurrency}
              className="px-2 py-1 text-xs font-stylized rounded bg-slate-100 text-slate-700 border border-slate-200"
            >
              {currency === 'INR' ? '₹' : '$'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-3">
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#1f6fb2] font-medium"
            >
              Projects Showcase
            </a>
            <a
              href="#prizes"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#1f6fb2] font-medium"
            >
              Top 3 Prizes ({currency === 'INR' ? '₹30,000' : '$360'} Pool)
            </a>
            <a
              href="#open-intelligence"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#0e8579] font-medium"
            >
              Featured on Open Intelligence
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#1f6fb2] font-medium"
            >
              Timeline
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 hover:text-[#1f6fb2] font-medium"
            >
              FAQ
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSubmitModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              Submit Your Project
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
