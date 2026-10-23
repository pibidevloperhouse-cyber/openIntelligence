'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

/**
 * RegistrationSuccessScreen
 * Clean, lightweight registration confirmation screen.
 * Displays confirmed submission details and notifies student
 * that their individual 4-digit PIN and access instructions
 * have been sent directly to their email.
 */
export default function RegistrationSuccessScreen({
  studentData,
  onClose,
}) {
  const [copiedId, setCopiedId] = useState(false);

  const studentName = studentData?.lead_student || studentData?.name || 'Student Innovator';
  const projectTitle = studentData?.title || studentData?.projectTitle || 'AI Innovation Project';
  const registrationId = studentData?.registration_id || studentData?.registrationId || 'PIBI-2026-BDR-CONFIRMED';
  const institution = studentData?.institution || studentData?.college || '';
  const domain = studentData?.domain || studentData?.category || 'AI & Machine Learning';
  const dept = studentData?.dept || '';
  const year = studentData?.year || '';
  const studentEmail = studentData?.email || '';

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.pibiopenintelligence.com';
  const collectPageUrl = `${siteOrigin}/registered-students?regId=${encodeURIComponent(registrationId)}`;

  const handleCopyId = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(registrationId);
      }
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } catch (err) {
      console.error('Failed to copy ID', err);
    }
  };

  return (
    <div className="w-full space-y-6 py-3 max-w-lg mx-auto animate-in fade-in duration-300">
      {/* Top Banner Celebration */}
      <div className="text-center space-y-2.5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1f6fb2] to-[#2ec4b6] p-[2px] mx-auto shadow-lg mb-1">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-9 h-9 text-emerald-500" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
          <span>Registration Confirmed 🎉</span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
          style={{ fontFamily: 'var(--font-plus-jakarta)' }}
        >
          Application Submitted!
        </h2>

        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Thank you for submitting your project to the <strong>PiBi Open Intelligence Student Project Awards 2026</strong>.
        </p>
      </div>

      {/* Confirmation Details Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Registration ID
            </span>
            <span className="font-mono font-black text-base text-[#1f6fb2]">
              {registrationId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Student Innovator
            </span>
            <span className="font-bold text-slate-900 truncate block">
              {studentName}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Institution / College
            </span>
            <span className="font-medium text-slate-700 truncate block">
              {institution || 'Engineering College'}
            </span>
          </div>

          <div className="sm:col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Project Title
            </span>
            <span className="font-bold text-slate-900 leading-snug block">
              &ldquo;{projectTitle}&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* Email Notification Notice */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-teal-50/50 to-sky-50 border border-sky-200/90 space-y-3 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1f6fb2] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Mail className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Confirmation Email Dispatched!</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                Sent
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We have sent an email from <strong>openintelligencepibi@gmail.com</strong> to {studentEmail ? <strong className="text-slate-900">{studentEmail}</strong> : 'your registered email address'}.
            </p>
          </div>
        </div>

        <div className="p-3 bg-white/90 rounded-xl border border-sky-200/80 text-xs text-slate-700 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Your secret 4-Digit Security PIN is in your email!</span>
          </div>
          <p className="text-[11.5px] text-slate-600">
            Please check your inbox to view your PIN and follow the link to access, customize, and download your official <strong>Builder Badge</strong>.
          </p>
        </div>
      </div>

      {/* Done Button */}
      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
        >
          <span>Done / Close Window</span>
        </button>

        <div className="text-center">
          <Link
            href={collectPageUrl}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f6fb2] hover:text-[#0e8579] transition hover:underline"
          >
            <span>Already have your PIN? Collect your badge here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
