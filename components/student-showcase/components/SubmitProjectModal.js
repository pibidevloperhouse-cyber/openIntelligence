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
  Users,
  UserPlus,
  Plus,
  Globe,
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
    teamMembers: [],

    // 2) Project Information
    projectTitle: '',
    domain: '',
    problemStatement: '',
    solution: '',
    usp: '',
    outcome: '',

    // 3) Working Demo (3 Mandatory Links + Optional Live Demo)
    githubLink: '',
    presentation: '',
    video: '',
    liveDemo: '',
    technicalSummary: '',
    pitch: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Team Member input state & handlers
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    const raw = newMemberName.trim();
    if (!raw) return;

    const namesToAdd = raw
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    setFormData((prev) => {
      const existing = new Set((prev.teamMembers || []).map((m) => m.toLowerCase()));
      const leadName = (prev.name || '').trim().toLowerCase();

      const newUnique = namesToAdd.filter(
        (n) => !existing.has(n.toLowerCase()) && n.toLowerCase() !== leadName
      );

      if ((prev.teamMembers || []).length + newUnique.length > 5) {
        setError('Maximum 5 co-members allowed per project.');
        return prev;
      }

      return {
        ...prev,
        teamMembers: [...(prev.teamMembers || []), ...newUnique],
      };
    });

    setNewMemberName('');
  };

  const handleRemoveMember = (idxToRemove) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: (prev.teamMembers || []).filter((_, idx) => idx !== idxToRemove),
    }));
  };

  // Registration lock state
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);
  const [showClosedNotification, setShowClosedNotification] = useState(false);

  // Upload states for Presentation (PDF) & Video (Strict <= 5MB)
  const [presentationMode, setPresentationMode] = useState('link'); // 'link' | 'upload'
  const [videoMode, setVideoMode] = useState('link'); // 'link' | 'upload'

  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');

  const [videoUploading, setVideoUploading] = useState(false);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoFileSize, setVideoFileSize] = useState('');
  const [videoError, setVideoError] = useState('');

  // Handle PDF upload for Slides / Presentation
  const handleUploadPDF = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('PDF file size exceeds 15MB limit. Please compress or link via Google Drive.');
      return;
    }

    setPdfUploading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.url) {
        throw new Error(json.error || 'Failed to upload PDF');
      }

      updateField('presentation', json.url);
      setPdfFileName(file.name);
      setPdfFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    } catch (err) {
      console.error('PDF upload error:', err);
      setError(err.message || 'Failed to upload PDF. Please enter a presentation link.');
    } finally {
      setPdfUploading(false);
      e.target.value = '';
    }
  };

  // Handle Video upload strictly <= 5MB
  const handleUploadVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError('');

    // Strictly enforce 5MB maximum limit as requested
    const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_VIDEO_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const errMsg = `Video file is ${sizeMb} MB. Direct video upload must be 5 MB or less! Please compress your video, or paste a YouTube / Loom / Google Drive link instead.`;
      setVideoError(errMsg);
      setError(errMsg);
      e.target.value = '';
      return;
    }

    setVideoUploading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.url) {
        throw new Error(json.error || 'Failed to upload video');
      }

      updateField('video', json.url);
      setVideoFileName(file.name);
      setVideoFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    } catch (err) {
      console.error('Video upload error:', err);
      setError(err.message || 'Failed to upload video. Please provide a YouTube/Drive link.');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  // Fetch registration settings on modal open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/student-projects/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.isRegistrationClosed === 'boolean') {
            setIsRegistrationClosed(data.isRegistrationClosed);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

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

  // Step 3 Validation (3 Mandatory Links / Uploads)
  const validateStep3 = () => {
    if (!formData.githubLink.trim()) {
      return 'Please enter your Project GitHub Repository Link.';
    }
    if (!formData.presentation.trim()) {
      return 'Please provide your Presentation / Slides (either paste a link or upload a PDF).';
    }
    if (!formData.video.trim()) {
      return 'Please provide your Project Explanation Video (either paste a link or upload a video up to 5MB).';
    }
    return '';
  };

  const handleNext = () => {
    // Check if registration is closed
    if (isRegistrationClosed) {
      setShowClosedNotification(true);
      setError('Registration is Closed! Submissions for National Student Innovation Showcase 2026 are currently closed.');
      return;
    }

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

    // Check if registration is closed
    if (isRegistrationClosed) {
      setShowClosedNotification(true);
      setError('Registration is Closed! Submissions for National Student Innovation Showcase 2026 are currently closed.');
      return;
    }

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

    const s3Err = validateStep3();
    if (s3Err) {
      setCurrentStep(3);
      setError(s3Err);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const coMembers = Array.isArray(formData.teamMembers) ? formData.teamMembers : [];
      const allTeamMembers = formData.name.trim()
        ? [formData.name.trim(), ...coMembers]
        : coMembers;

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: formData.college.trim(),
        dept: formData.dept.trim(),
        year: formData.year,
        dob: formData.dob,
        teamMembers: allTeamMembers,

        projectTitle: formData.projectTitle.trim(),
        domain: formData.domain.trim() || 'AI & Machine Learning',
        category: formData.domain.trim() || 'AI & Machine Learning',
        problemStatement: formData.problemStatement.trim(),
        solution: formData.solution.trim(),
        usp: formData.usp.trim(),
        outcome: formData.outcome.trim(),

        // Step 3 Deliverables
        githubLink: formData.githubLink.trim(),
        presentation: formData.presentation.trim(),
        video: formData.video.trim(),
        liveDemo: formData.liveDemo?.trim() || '',
        technicalSummary: formData.technicalSummary.trim(),
        pitch: formData.pitch.trim(),

        // Backward compatibility mappings
        title: formData.projectTitle.trim(),
        leadStudent: formData.name.trim(),
        institution: formData.college.trim(),
        githubUrl: formData.githubLink.trim(),
        presentationUrl: formData.presentation.trim(),
        videoUrl: formData.video.trim(),
        demoUrl: formData.liveDemo?.trim() || null,
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
          teamMembers: [],
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
              {isRegistrationClosed && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🚫</span>
                    <span>Notice: Student project registrations are currently <strong>CLOSED</strong>.</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 font-extrabold text-[10px] uppercase">Closed</span>
                </div>
              )}

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

                  {/* Team Members Section */}
                  <div className="pt-2 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#1f6fb2]" />
                        <span>Team Members <span className="text-slate-400 font-normal text-[11px]">(Optional • Max 5 co-members)</span></span>
                      </label>
                      {formData.teamMembers?.length > 0 && (
                        <span className="text-[11px] font-semibold text-[#1f6fb2] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
                          {formData.teamMembers.length + 1} Total Members
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 leading-normal">
                      Working as a team? Add your co-members' names below. The Full Name above is registered as Team Lead.
                    </p>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <UserPlus className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddMember();
                            }
                          }}
                          placeholder="Enter team member name (or comma-separated) and click Add"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6] hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Member</span>
                      </button>
                    </div>

                    {/* Member Badges / Chips */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {/* Team Lead Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#1f6fb2]" />
                        <span>{formData.name.trim() || 'You'}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1f6fb2]/10 text-[#1f6fb2]">
                          Lead
                        </span>
                      </div>

                      {/* Added Co-Members */}
                      {formData.teamMembers?.map((member, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs font-semibold animate-in fade-in zoom-in-95 duration-150"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{member}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            className="w-4 h-4 rounded-full hover:bg-emerald-200/70 flex items-center justify-center text-emerald-700 hover:text-emerald-950 transition-colors cursor-pointer ml-1"
                            title={`Remove ${member}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
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
                      <input
                        type="text"
                        list="domainList"
                        value={formData.domain}
                        onChange={(e) => updateField('domain', e.target.value)}
                        placeholder="e.g. AI & Machine Learning / Web3 / IoT"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                      />
                      <datalist id="domainList">
                        <option value="AI & Machine Learning" />
                        <option value="Generative AI & LLMs" />
                        <option value="Robotics & GreenTech" />
                        <option value="Cybersecurity & Web3" />
                        <option value="IoT & Hardware" />
                        <option value="Healthcare & Assistive Tech" />
                        <option value="FinTech & NextGen Web" />
                        <option value="Cloud, DevOps & Agents" />
                        <option value="Mobile App & Cross-Platform" />
                        <option value="AR / VR & Spatial Computing" />
                      </datalist>
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
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#1f6fb2]" />
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Step 3: Working Demo & Submission
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      * Required Deliverables
                    </span>
                  </div>

                  {/* GitHub Link (Mandatory) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <GithubIcon className="w-3.5 h-3.5 text-slate-700" />
                        <span>Project GitHub Link <span className="text-red-500 font-bold">*</span></span>
                      </span>
                      <span className="text-[10px] text-rose-500 font-semibold">Mandatory</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.githubLink}
                      onChange={(e) => updateField('githubLink', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Presentation / Slides (Link or Upload PDF) */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Presentation className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Presentation / Slides <span className="text-red-500 font-bold">*</span></span>
                      </label>

                      {/* Mode Toggle Pills */}
                      <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setPresentationMode('link')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            presentationMode === 'link'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          🔗 Enter Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresentationMode('upload')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            presentationMode === 'upload'
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          📄 Upload PDF
                        </button>
                      </div>
                    </div>

                    {presentationMode === 'link' ? (
                      <div>
                        <input
                          type="url"
                          value={formData.presentation}
                          onChange={(e) => updateField('presentation', e.target.value)}
                          placeholder="https://docs.google.com/presentation/... or Canva Link"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Paste your Google Slides (set to "Anyone with link can view") or Canva deck URL.
                        </p>
                      </div>
                    ) : (
                      <div>
                        {formData.presentation && pdfFileName ? (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-indigo-200 text-xs">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold">PDF</span>
                              <div className="truncate">
                                <div className="font-bold text-slate-900 truncate">{pdfFileName}</div>
                                <div className="text-[10px] text-emerald-600 font-semibold">{pdfFileSize} • ✓ Uploaded successfully</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                updateField('presentation', '');
                                setPdfFileName('');
                                setPdfFileSize('');
                              }}
                              className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-2 shrink-0 p-1 cursor-pointer"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-xl bg-white cursor-pointer transition-colors text-center group">
                            <input
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleUploadPDF}
                              disabled={pdfUploading}
                              className="hidden"
                            />
                            {pdfUploading ? (
                              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold py-1">
                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <span>Uploading PDF to cloud storage...</span>
                              </div>
                            ) : (
                              <>
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                                  📄
                                </div>
                                <span className="text-xs font-bold text-indigo-700">Click to upload Presentation PDF</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">Supports .pdf format (Max 15 MB)</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Project Explanation Video (Link or Direct Upload <= 5MB) */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <PlayCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>Project Explanation Video <span className="text-red-500 font-bold">*</span></span>
                      </label>

                      {/* Mode Toggle Pills */}
                      <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoMode('link');
                            setVideoError('');
                          }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            videoMode === 'link'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          🔗 Video Link (YouTube/Loom)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoMode('upload');
                            setVideoError('');
                          }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                            videoMode === 'upload'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          🎥 Upload Video (Max 5MB)
                        </button>
                      </div>
                    </div>

                    {videoMode === 'link' ? (
                      <div>
                        <input
                          type="url"
                          value={formData.video}
                          onChange={(e) => updateField('video', e.target.value)}
                          placeholder="https://youtube.com/watch?v=... or Loom / Drive Link"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all placeholder:text-slate-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Recommended for HD videos: Paste a YouTube, Loom, or public Google Drive video link.
                        </p>
                      </div>
                    ) : (
                      <div>
                        {formData.video && videoFileName ? (
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-rose-200 text-xs">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 font-bold">VIDEO</span>
                              <div className="truncate">
                                <div className="font-bold text-slate-900 truncate">{videoFileName}</div>
                                <div className="text-[10px] text-emerald-600 font-semibold">{videoFileSize} • ✓ Uploaded (under 5MB limit)</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                updateField('video', '');
                                setVideoFileName('');
                                setVideoFileSize('');
                                setVideoError('');
                              }}
                              className="text-xs text-rose-600 hover:text-rose-800 font-bold ml-2 shrink-0 p-1 cursor-pointer"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        ) : (
                          <div>
                            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-xl bg-white cursor-pointer transition-colors text-center group">
                              <input
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                                onChange={handleUploadVideo}
                                disabled={videoUploading}
                                className="hidden"
                              />
                              {videoUploading ? (
                                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold py-1">
                                  <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                                  <span>Uploading video to cloud storage...</span>
                                </div>
                              ) : (
                                <>
                                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                                    🎥
                                  </div>
                                  <span className="text-xs font-bold text-rose-700">Click to upload video file</span>
                                  <span className="text-[10px] font-semibold text-rose-500 mt-0.5">
                                    Strict limit: 5 MB or less (.mp4, .webm)
                                  </span>
                                </>
                              )}
                            </label>

                            {videoError && (
                              <div className="p-2.5 mt-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-1.5">
                                <span>⚠️</span>
                                <span>{videoError}</span>
                              </div>
                            )}

                            <p className="text-[10px] text-slate-500 mt-1.5">
                              💡 Tip: If your video is longer or &gt; 5MB, upload to YouTube or Google Drive and use the "Video Link" option above.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Live Hosted Demo / Web App Link (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Live Prototype / Hosted Web App Link</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <input
                      type="url"
                      value={formData.liveDemo}
                      onChange={(e) => updateField('liveDemo', e.target.value)}
                      placeholder="https://yourproject.vercel.app (if deployed online)"
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

      {/* ── REGISTRATION CLOSED NOTIFICATION POPUP ────────────────────────── */}
      {showClosedNotification && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setShowClosedNotification(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-7 text-center shadow-2xl border border-rose-200 relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
              🚫
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-700 mb-2">
              Registration Closed
            </span>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Registration Is Currently Closed
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              New project registrations for the <strong>National Student Innovation Showcase 2026</strong> are currently closed by the administrator. Submissions are temporarily paused.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowClosedNotification(false);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-lg"
              >
                Understood / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitProjectModal;
