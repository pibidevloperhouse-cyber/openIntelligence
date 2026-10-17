'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  CheckCircle2,
  User,
  FolderGit2,
  Video,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  FileText,
  Lightbulb,
  Check,
  Presentation,
  PlayCircle,
  Cpu,
  Flame,
} from 'lucide-react';

const GithubIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const SubmitProjectModal = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  // Step state: 1, 2, or 3
  const [currentStep, setCurrentStep] = useState(1);

  // Form State covering all requested fields
  const [formData, setFormData] = useState({
    // 1) Personal Information
    name: '',
    email: '',
    phone: '',
    college: '',
    dept: '',
    year: 'Final Year (4th)',
    dob: '',

    // 2) Project Information
    projectTitle: '',
    domain: 'AI & Machine Learning',
    
    problemStatement: '',
    solution: '',
    usp: '',
    outcome: '',

    // 3) Working Demo
    githubLink: '',
    presentation: '',
    video: '',
    technicalSummary: '',
    pitch: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return 'Please enter a valid email address.';
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      return 'Please enter a valid phone number.';
    }
    if (!formData.college.trim()) return 'Please enter your college or university name.';
    return '';
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!formData.projectTitle.trim()) return 'Please enter your project title.';
    if (!formData.problemStatement.trim()) return 'Please enter the problem statement.';
    if (!formData.solution.trim()) return 'Please describe your proposed solution.';
    return '';
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
      setError('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setError(err);
        return;
      }
      setError('');
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Final checks
    const s1Err = validateStep1();
    if (s1Err) {
      setCurrentStep(1);
      setError(s1Err);
      return;
    }

    const s2Err = validateStep2();
    if (s2Err) {
      setCurrentStep(2);
      setError(s2Err);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        dept: formData.dept.trim(),
        year: formData.year,
        dob: formData.dob,

        projectTitle: formData.projectTitle.trim(),
        domain: formData.domain,
        category: formData.domain,
        problemStatement: formData.problemStatement.trim(),
        solution: formData.solution.trim(),
        usp: formData.usp.trim(),
        outcome: formData.outcome.trim(),

        githubLink: formData.githubLink.trim(),
        presentation: formData.presentation.trim(),
        video: formData.video.trim(),
        technicalSummary: formData.technicalSummary.trim(),
        pitch: formData.pitch.trim(),

        // Backward compatibility mappings
        title: formData.projectTitle.trim(),
        leadStudent: formData.name.trim(),
        institution: formData.college.trim(),
        githubUrl: formData.githubLink.trim(),
        demoUrl: formData.video.trim() || formData.presentation.trim() || formData.githubLink.trim() || 'https://pibiopenintelligence.org',
        tagline: formData.pitch.trim() || formData.usp.trim(),
      };

      const res = await fetch('/api/student-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit project to Supabase');
      }

      // Trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#1f6fb2', '#2ec4b6', '#8b5cf6', '#10b981', '#f59e0b'],
      });

      const newProject = {
        id: data.project?.id || `proj-${Date.now()}`,
        title: formData.projectTitle,
        tagline: formData.pitch || formData.usp || 'Breakthrough student innovation for 2026 Awards',
        category: formData.domain,
        leadStudent: formData.name,
        institution: formData.college,
        description: `### Problem\n${formData.problemStatement}\n\n### Solution\n${formData.solution}`,
        image: '/images/hero_banner_real.jpg',
        tags: [formData.domain, 'Candidate 2026', 'Prototype'],
        upvotes: 1,
        openIntelligenceFeatured: false,
        githubUrl: formData.githubLink || undefined,
        demoUrl: formData.video || formData.presentation || undefined,
      };

      setSubmitted(true);
      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess(newProject);
        setSubmitted(false);
        setCurrentStep(1);
        setFormData({
          name: '',
          email: '',
          phone: '',
          college: '',
          dept: '',
          year: 'Final Year (4th)',
          dob: '',
          projectTitle: '',
          domain: 'AI & Machine Learning',
          problemStatement: '',
          solution: '',
          usp: '',
          outcome: '',
          githubLink: '',
          presentation: '',
          video: '',
          technicalSummary: '',
          pitch: '',
        });
        onClose();
      }, 2600);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsMeta = [
    { num: 1, title: 'Personal Information', sub: 'Name, email, phone, college', icon: User },
    { num: 2, title: 'Project Information', sub: 'Title, problem & solution', icon: FolderGit2 },
    { num: 3, title: 'Working Demo', sub: 'GitHub, video & pitch', icon: Video },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col transition-all">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl p-[2px] shadow-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
            >
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#1f6fb2]">
                <Sparkles className="w-5 h-5 text-[#1f6fb2]" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className="text-base sm:text-lg font-black text-slate-900 tracking-tight"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  Submit Student Project
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#2ec4b6]/15 text-[#0e8579] border border-[#2ec4b6]/30 font-stylized whitespace-nowrap">
                  Candidate 2026
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                3-Step Submission for Top 3 Cash Prizes & PiBi Spotlight
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer border border-slate-200/80 shrink-0 shadow-xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 3-Step Wizard Progress Bar */}
        {!submitted && (
          <div className="bg-slate-50/80 px-4 sm:px-6 py-3 border-b border-slate-200/80 shrink-0">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {stepsMeta.map((s) => {
                const Icon = s.icon;
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      // Allow moving backward or to current
                      if (s.num < currentStep) {
                        setCurrentStep(s.num);
                        setError('');
                      } else if (s.num === 2 && currentStep === 1) {
                        handleNext();
                      } else if (s.num === 3 && currentStep === 2) {
                        handleNext();
                      }
                    }}
                    className={`flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-white shadow-xs border border-sky-300 ring-2 ring-sky-100'
                        : isCompleted
                        ? 'bg-emerald-50/70 border border-emerald-200 cursor-pointer hover:bg-emerald-100/60'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-[#1f6fb2] text-white shadow-xs'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs sm:text-[13px] font-extrabold leading-tight truncate ${
                          isActive
                            ? 'text-slate-900 font-black'
                            : isCompleted
                            ? 'text-emerald-950 font-bold'
                            : 'text-slate-600 font-semibold'
                        }`}
                      >
                        {s.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {isCompleted ? '✓ Completed' : s.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Continuous Line Progress Indicator */}
            <div className="w-full bg-slate-200/80 h-1 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${(currentStep / 3) * 100}%`,
                  background: 'linear-gradient(90deg, #1f6fb2, #2ec4b6)',
                }}
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 md:p-7 overflow-y-auto space-y-4 modal-scroll flex-1">
          {submitted ? (
            <div className="text-center py-10 sm:py-12 space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1.5">
                <h3
                  className="text-2xl sm:text-3xl font-black text-slate-900"
                  style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                >
                  Project Recorded in Supabase! 🎉
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                  Thank you <strong className="text-slate-900">{formData.name}</strong> from{' '}
                  <strong className="text-slate-900">{formData.college}</strong>. Your project{' '}
                  <strong className="text-[#1f6fb2]">"{formData.projectTitle}"</strong> has been saved directly to the database and queued for jury evaluation!
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eligible for Top 3 Cash Rewards & Open Intelligence Publication</span>
              </div>
            </div>
          ) : (
            <div>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/90 text-red-700 text-xs font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* STEP 1: PERSONAL INFORMATION                                  */}
              {/* ───────────────────────────────────────────────────────────── */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <User className="w-4 h-4 text-[#1f6fb2]" />
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Step 1: Personal Information
                    </h3>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Full Name <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="e.g. Anand Kumar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Email Address <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="e.g. anand@college.edu"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Phone No & College */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>Phone Number <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>College / University <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => updateField('college', e.target.value)}
                        placeholder="e.g. Anna University / IIT / KLN"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Dept, Year & D.O.B */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span>Department</span>
                      </label>
                      <input
                        type="text"
                        value={formData.dept}
                        onChange={(e) => updateField('dept', e.target.value)}
                        placeholder="e.g. CSE / AI & DS / IT"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Year of Study</span>
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => updateField('year', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all cursor-pointer"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Final Year (4th)">Final Year (4th)</option>
                        <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                        <option value="Recent Graduate (2025/2026)">Recent Graduate (2025/2026)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Date of Birth (D.O.B)</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateField('dob', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* STEP 2: PROJECT INFORMATION                                   */}
              {/* ───────────────────────────────────────────────────────────── */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <FolderGit2 className="w-4 h-4 text-[#1f6fb2]" />
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Step 2: Project Information
                    </h3>
                  </div>

                  {/* Project Title & Domain */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Project Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.projectTitle}
                        onChange={(e) => updateField('projectTitle', e.target.value)}
                        placeholder="e.g. AI Autonomous Drone Navigator"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Domain / Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.domain}
                        onChange={(e) => updateField('domain', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all cursor-pointer"
                      >
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Robotics & GreenTech">Robotics & GreenTech</option>
                        <option value="Cybersecurity & Web3">Cybersecurity & Web3</option>
                        <option value="IoT & Hardware">IoT & Hardware</option>
                        <option value="Healthcare & Assistive">Healthcare & Assistive</option>
                        <option value="FinTech & NextGen Web">FinTech & NextGen Web</option>
                        <option value="Cloud, DevOps & Agents">Cloud, DevOps & Agents</option>
                      </select>
                    </div>
                  </div>

                  {/* Problem Statement */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Problem Statement <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-slate-400">What issue does this solve?</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.problemStatement}
                      onChange={(e) => updateField('problemStatement', e.target.value)}
                      placeholder="Describe the real-world friction, inefficiency, or gap your project tackles..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* Solution */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Proposed Solution <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-slate-400">How your software / hardware works</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.solution}
                      onChange={(e) => updateField('solution', e.target.value)}
                      placeholder="Explain your approach, core algorithm, system architecture, or pipeline..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* USP & Outcome */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>USP (Unique Selling Proposition)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.usp}
                        onChange={(e) => updateField('usp', e.target.value)}
                        placeholder="e.g. 10x faster inference, zero cloud dependencies"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Outcome & Expected Impact</span>
                      </label>
                      <input
                        type="text"
                        value={formData.outcome}
                        onChange={(e) => updateField('outcome', e.target.value)}
                        placeholder="e.g. 96% accuracy, tested on 500+ local patients"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────── */}
              {/* STEP 3: WORKING DEMO & SUBMISSION                             */}
              {/* ───────────────────────────────────────────────────────────── */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Video className="w-4 h-4 text-[#1f6fb2]" />
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Step 3: Working Demo & Submission
                    </h3>
                  </div>

                  {/* GitHub Link & Presentation Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                        <span>Project GitHub Link</span>
                      </label>
                      <input
                        type="url"
                        value={formData.githubLink}
                        onChange={(e) => updateField('githubLink', e.target.value)}
                        placeholder="https://github.com/username/project"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Presentation className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Presentation / Slides Link</span>
                      </label>
                      <input
                        type="url"
                        value={formData.presentation}
                        onChange={(e) => updateField('presentation', e.target.value)}
                        placeholder="https://docs.google.com/presentation/... or Canva"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Project Explanation Video Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <PlayCircle className="w-3.5 h-3.5 text-red-500" />
                      <span>Project Explanation Video (YouTube / Loom / Drive)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.video}
                      onChange={(e) => updateField('video', e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or Loom / Drive Link"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Technical Summary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#1f6fb2]" />
                      <span>Technical Summary / Architecture</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.technicalSummary}
                      onChange={(e) => updateField('technicalSummary', e.target.value)}
                      placeholder="e.g. Next.js 15, FastAPI, LangChain, PyTorch, Supabase PostgreSQL, deployed on Vercel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* Pitch / Tagline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>One-Line Elevator Pitch</span>
                    </label>
                    <input
                      type="text"
                      value={formData.pitch}
                      onChange={(e) => updateField('pitch', e.target.value)}
                      placeholder="e.g. An AI-powered assistive copilot that turns speech into live real-time Braille signals"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                    style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                  >
                    <span>Next: {currentStep === 1 ? 'Project Info' : 'Working Demo'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
                  >
                    <Sparkles className={`w-4 h-4 text-amber-200 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>{isSubmitting ? 'Saving to Supabase...' : 'Submit Project For Evaluation'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitProjectModal;
