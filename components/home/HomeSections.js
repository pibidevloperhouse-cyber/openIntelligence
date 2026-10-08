'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import AnimatedFadeIn from './AnimatedFadeIn';
import Link from 'next/link';
import { HeartPulse, Leaf, BookOpen, Globe, Accessibility, Building2, Briefcase, TriangleAlert, Bot, Database, Cloud, Cpu, TrendingUp, ShieldCheck } from 'lucide-react';

function TypewriterOnce({ text, typingSpeed = 75, delay = 500, className = "", style = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (!isInView) return;

    let timer;
    if (currentText.length < text.length) {
      timer = setTimeout(() => {
        setCurrentText(text.substring(0, currentText.length + 1));
      }, currentText.length === 0 ? delay : typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, text, typingSpeed, delay, isInView]);

  return (
    <span ref={ref} className={className} style={style}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function TypewriterCycle({ words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 1500, className = "", style = {} }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    let timer;
    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === currentWord) {
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className={className} style={style}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedFadeIn>
          <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12 lg:p-16">

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

              {/* Left Column */}
              <div className="lg:col-span-5 text-left">
                <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-extrabold text-[#0a192f] mb-6 tracking-tight drop-shadow-sm flex flex-col gap-2">
                  <span>Pi Bi Foundation</span>
                  <span>for</span>
                  <span className="text-transparent bg-clip-text text-3xl md:text-4xl lg:text-[2.75rem] whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>
                    Open Intelligence
                  </span>
                </h2>
                <div className="text-xl md:text-2xl font-bold text-[#1f6fb2] h-8">
                  <TypewriterCycle words={['Learn', 'Contribute', 'Empower']} typingSpeed={100} deletingSpeed={50} pauseTime={1500} />
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-7 text-left">
                <div className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
                  <p>
                    <strong className="text-[#0a192f] font-extrabold">Pi Bi Open Intelligence</strong> is a <strong className="text-[#2ec4b6] font-semibold">community-led initiative</strong> from the <strong className="text-[#2ec4b6] font-semibold">Pi Bi Foundation</strong> and <strong className="text-[#2ec4b6] font-semibold">Madurai AI Community</strong>, bringing people together to learn, explore and build with <strong className="text-[#2ec4b6] font-semibold">AI and emerging technologies</strong>.
                  </p>
                  <p>
                    We believe <strong className="text-[#2ec4b6] font-semibold">useful knowledge</strong> should be shared and technology should be <strong className="text-[#2ec4b6] font-semibold">open to everyone</strong>. Through community learning, open contributions and <strong className="text-[#2ec4b6] font-semibold">practical AI projects</strong>, we turn ideas into solutions that can be shared, built upon and put to use.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                  <a href="#learn" className="px-6 py-2.5 text-white font-bold rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>Learn Something</a>
                  <a href="#contribute" className="px-6 py-2.5 text-white font-bold rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>Contribute Something</a>
                  <a href="#apply" className="px-6 py-2.5 text-white font-bold rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>Apply AI</a>
                  <a href="#empower" className="px-6 py-2.5 text-white font-bold rounded-full shadow-sm hover:scale-105 transition-all cursor-pointer" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>Empower Someone</a>
                </div>
              </div>

            </div>

          </div>
        </AnimatedFadeIn>
      </div>
    </section>
  );
}

export function LearnSection() {
  return (
    <section id="learn" className="py-24 px-4 md:px-8 bg-[#1f6fb2] text-white relative">
      <div className="max-w-[95%] xl:max-w-[90rem] mx-auto">
        <AnimatedFadeIn>
          <div className="relative bg-[#132338] rounded-[2rem] border border-[#1f6fb2]/20 overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[500px]">

            {/* Left Content */}
            <div className="relative z-10 w-full md:w-[60%] lg:w-[50%] p-10 md:p-16 flex flex-col justify-center bg-[#132338]">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">Learn</h2>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-300">
                Learn AI. <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #1f6fb2, #2ec4b6)' }}>Explore What’s Next.</span>
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Through the Madurai AI Community, we explore AI and emerging technologies through practical sessions, discussions, demos and hands-on learning.
              </p>

              <div className="inline-block bg-[#1f6fb2] border border-[#1f6fb2]/50 text-white px-5 py-2.5 rounded-full font-medium mb-8 w-max text-sm shadow-sm">
                With 65+ weeks of community learning
              </div>

              <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed">
                Explore topics across AI, Machine Learning, Deep Learning, LLMs, SLMs, Generative AI, Agentic AI, AI Architecture, AI Infrastructure, Applied AI
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/meetings" className="px-8 py-3.5 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_4px_15px_rgba(46,196,182,0.3)] border border-transparent" style={{ background: 'linear-gradient(to right, #1f6fb2, #2ec4b6)' }}>
                  Upcoming Sessions &rarr;
                </Link>
                <Link href="/meetings?tab=past" className="px-8 py-3.5 bg-slate-700/50 hover:bg-slate-600 text-white font-bold rounded-full transition-all hover:scale-105 border border-slate-600">
                  Past Sessions &rarr;
                </Link>
              </div>
            </div>

            {/* Right Image with Diagonal Clip (Desktop) */}
            <div className="absolute top-0 right-0 w-[50%] lg:w-[55%] h-full z-0 hidden md:block overflow-hidden"
              style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)', WebkitClipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}>
              <img src="/lean.jpg" alt="Learn AI" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#132338] via-[#132338]/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Mobile Image */}
            <div className="w-full h-64 block md:hidden relative overflow-hidden">
              <img src="/lean.jpg" alt="Learn AI" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#132338] to-transparent pointer-events-none"></div>
            </div>

          </div>
        </AnimatedFadeIn>
      </div>
    </section>
  );
}

export function ContributeSection() {
  const areas = [
    { title: "AI Training Data", desc: "Datasets and evaluation resources that help AI learn better.", image: "/ai.jpeg" },
    { title: "SLM & AI Models", desc: "Small, efficient and domain-focused models for real applications.", image: "/slm.jpeg" },
    { title: "AI Assistants", desc: "Assistants that make knowledge and information easier to access.", image: "/ai ass.jpeg" },
    { title: "AI Copilots", desc: "AI that works alongside people to help with real tasks.", image: "/aico.jpeg" },
    { title: "Document Intelligence", desc: "Tools that turn documents and information into something useful.", image: "/doc.jpeg" },
    { title: "Workflow Bots & AI Agents", desc: "Agents and workflows that can understand tasks, use tools and get work done.", image: "/work.jpeg" },
  ];

  return (
    <section id="contribute" className="py-24 px-4 relative bg-white">

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedFadeIn className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#0a192f]">Contribute</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#0a192f]">
            Take What <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>You Learn Further.</span>
          </h3>
          <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            The Madurai AI Community is where we learn, explore and experiment with AI. Pi Bi Open Intelligence is where those ideas can become something others can use, learn from and build upon.
          </p>
        </AnimatedFadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 text-left">
          {areas.map((area, idx) => (
            <AnimatedFadeIn key={idx} delay={idx * 0.1} className="bg-slate-50 border border-slate-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-full h-52 overflow-hidden">
                <img src={area.image} alt={area.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-transparent bg-clip-text mb-3 inline-block" style={{ backgroundImage: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>{area.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{area.desc}</p>
              </div>
            </AnimatedFadeIn>
          ))}
        </div>

        <AnimatedFadeIn delay={0.6} className="bg-[#1f6fb2] border border-[#1f6fb2]/30 text-white rounded-[2rem] p-10 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Have an idea but not sure where it fits?</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">Start with the community. We can explore it together.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contribute" className="px-8 py-4 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_4px_15px_rgba(46,196,182,0.3)] border border-transparent" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>
                Contribute to Open Intelligence &rarr;
              </Link>
              <Link href="/contact-us" className="px-8 py-4 bg-transparent text-white font-bold rounded-full transition-all hover:bg-white/10 hover:scale-105 border border-white/50">
                Share Your Contribution &rarr;
              </Link>
            </div>
          </div>
        </AnimatedFadeIn>
      </div>
    </section>
  );
}

export function ApplySection() {
  const problems = [
    { id: 'health', title: "Health & Wellbeing", desc: "Prevention, early screening, health assistance, elderly care and public-health intelligence.", icon: <HeartPulse className="w-8 h-8" /> },
    { id: 'agriculture', title: "Food & Agriculture", desc: "Crop health, water use, pest detection, farming assistance and food security.", icon: <Leaf className="w-8 h-8" /> },
    { id: 'learning', title: "Learning & Potential", desc: "AI tutors, personalized learning, skills and knowledge access.", icon: <BookOpen className="w-8 h-8" /> },
    { id: 'climate', title: "Climate & Resources", desc: "Floods, heat, drought, water, forests, waste and biodiversity.", icon: <Globe className="w-8 h-8" /> },
    { id: 'accessibility', title: "Accessibility & Inclusion", desc: "Language, speech, vision, sign language and assistive tech.", icon: <Accessibility className="w-8 h-8" /> },
    { id: 'communities', title: "Public Services", desc: "Citizen assistance, government services, documents, and local information.", icon: <Building2 className="w-8 h-8" /> },
    { id: 'livelihoods', title: "Work & Livelihoods", desc: "Jobs, skills, small businesses, entrepreneurship and economic opportunities.", icon: <Briefcase className="w-8 h-8" /> },
    { id: 'humanitarian', title: "Disaster & Humanitarian", desc: "Early warnings, emergency response, crisis communication and relief.", icon: <TriangleAlert className="w-8 h-8" /> }
  ];

  return (
    <section id="apply" className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <AnimatedFadeIn>

            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-900">Apply</h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#0a192f]">
              Apply AI to <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>Problems That Matter.</span>
            </h3>
            
            <div className="space-y-6 mb-12">
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                AI should not only make technology smarter. It should help people live better, solve difficult problems and respond to challenges around us.
              </p>
            </div>

            <h4 className="text-xl md:text-2xl font-bold mb-8 text-[#0a192f]">
              Applied AI <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>Usecases for Humanity</span>
            </h4>

          </AnimatedFadeIn>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => (
            <AnimatedFadeIn key={idx} delay={idx * 0.1} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer flex flex-col h-full">
              <Link href={`/problems#${prob.id}`} className="flex flex-col h-full">
                <div className="w-full h-48 overflow-hidden bg-slate-100">
                  <img src={`/${(idx + 1) * 111}.jpeg`} alt={prob.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col flex-grow bg-white relative">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text mb-3 inline-block" style={{ backgroundImage: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>{prob.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mt-auto">{prob.desc}</p>
                </div>
              </Link>
            </AnimatedFadeIn>
          ))}
        </div>

        {/* Action Buttons Below Grid */}
        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          <Link href="/problems" className="px-8 py-4 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_8px_20px_rgba(46,196,182,0.3)] border border-transparent" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>
            Explore Problems We Can Solve &rarr;
          </Link>
          <Link href="/contact-us" className="px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 font-bold rounded-full transition-all hover:border-[#2ec4b6] hover:text-[#1f6fb2] shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
            Propose an AI Use Case
          </Link>
        </div>
      </div>
    </section>
  );
}

export function EmpowerSection() {
  const [activeTab, setActiveTab] = useState('article');
  const topics = [
    { title: "AI & Machine Learning", desc: "Explore practical knowledge, research, tools and emerging developments across modern AI and machine learning.", icon: <img src="/11.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="AI logo" /> },
    { title: "Data Engineering", desc: "Discover resources on building reliable data systems, analytics platforms and data foundations for AI.", icon: <img src="/22.png" className="w-full h-full object-contain scale-90 grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Data logo" /> },
    { title: "Infrastructure & Cloud", desc: "Learn about AI infrastructure, cloud platforms, GPUs, edge computing and modern technology operations.", icon: <img src="/33.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Cloud logo" /> },
    { title: "Digital Transformation", desc: "Explore how AI and emerging technologies are changing businesses, processes and customer experiences.", icon: <img src="/44.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Digital logo" /> },
    { title: "Product & Growth", desc: "Find practical insights on building AI products, product strategy, customer adoption and sustainable growth.", icon: <img src="/55.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Growth logo" /> },
    { title: "Security & Governance", desc: "Explore resources covering AI security, privacy, governance, compliance and responsible technology.", icon: <img src="/66.png" className="w-full h-full object-contain scale-90 grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Security logo" /> },
  ];

  return (
    <section id="empower" className="py-24 px-4 text-white relative" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>
      
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <AnimatedFadeIn className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">Empower</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white/90">
            Find What You Need to Learn, Build and Grow.
          </h3>
          <p className="text-xl text-white/70 font-medium leading-relaxed mb-6">
            Open Intelligence is not only about building technology. It is also about making useful knowledge easier to find and easier to use.
          </p>
        </AnimatedFadeIn>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['article', 'guide', 'podcasts', 'trending topics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-bold capitalize transition-all duration-300 border ${
                activeTab === tab 
                  ? 'bg-white text-[#1f6fb2] shadow-[0_4px_15px_rgba(255,255,255,0.3)] border-transparent scale-105'
                  : 'bg-black/20 text-white border-white/20 hover:bg-black/40 hover:border-white/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {topics.map((topic, idx) => (
            <AnimatedFadeIn key={idx} delay={0.1 * idx} className="h-full bg-black/20 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] hover:bg-black/40 hover:border-[#2ec4b6]/50 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden cursor-pointer">
              
              {/* Subtle elegant glow on hover */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#2ec4b6]/0 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-[#2ec4b6]/20 transition-all duration-700"></div>

              {/* Transparent Icon Container for perfect blending */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 relative z-10">
                <div className="w-full h-full drop-shadow-sm transition-colors duration-500">{topic.icon}</div>
              </div>

              <h4 className="font-bold text-xl mb-3 text-white relative z-10 transition-transform duration-300">{topic.title}</h4>
              <p className="text-white/80 text-sm leading-relaxed relative z-10 group-hover:text-white transition-colors duration-300 mt-auto">{topic.desc}</p>
            </AnimatedFadeIn>
          ))}
        </div>

        {/* Action Banner */}
        <AnimatedFadeIn delay={0.4}>
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-12 text-center bg-black/30 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">Exclusive Member Content</h3>
                <p className="text-white/90 text-lg max-w-2xl">
                  Selected technical resources and partner content are also available exclusively to Pi Bi Open Intelligence members.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Link href="/open-intelligence" className="px-8 py-4 bg-white text-[#1f6fb2] font-bold rounded-full transition-all hover:scale-105 shadow-xl text-center">
                  Explore Resources &rarr;
                </Link>
                <Link href="/contact-us" className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-full transition-all hover:scale-105 border border-white text-center">
                  Become a Member &rarr;
                </Link>
              </div>
            </div>
          </div>
        </AnimatedFadeIn>

      </div>
    </section>
  );
}


export function LearnTabContent() {
  return (
    <div className="relative bg-[#222222] rounded-[2rem] border border-[#333] overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[500px]">

            {/* Left Content */}
            <div className="relative z-10 w-full md:w-[60%] lg:w-[50%] p-10 md:p-16 flex flex-col justify-center bg-[#222222]">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">1) Learn</h2>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-300">
                Learn AI. <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #1f6fb2, #2ec4b6)' }}>Explore What’s Next.</span>
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Through the Madurai AI Community, we explore AI and emerging technologies through practical sessions, discussions, demos and hands-on learning.
              </p>

              <div className="inline-block bg-[#1f2937] border border-slate-700 text-slate-300 px-5 py-2.5 rounded-full font-medium mb-8 w-max text-sm shadow-sm">
                With 65+ weeks of community learning
              </div>

              <p className="text-slate-400 text-sm mb-10 max-w-xl leading-relaxed">
                Explore topics across AI, Machine Learning, Deep Learning, LLMs, SLMs, Generative AI, Agentic AI, AI Architecture, AI Infrastructure, Applied AI
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/meetings" className="px-8 py-3.5 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_4px_15px_rgba(46,196,182,0.3)] border border-transparent" style={{ background: 'linear-gradient(to right, #1f6fb2, #2ec4b6)' }}>
                  Upcoming Sessions &rarr;
                </Link>
                <Link href="/meetings?tab=past" className="px-8 py-3.5 bg-slate-700/50 hover:bg-slate-600 text-white font-bold rounded-full transition-all hover:scale-105 border border-slate-600">
                  Past Sessions &rarr;
                </Link>
              </div>
            </div>

            {/* Right Image with Diagonal Clip (Desktop) */}
            <div className="absolute top-0 right-0 w-[50%] lg:w-[55%] h-full z-0 hidden md:block overflow-hidden"
              style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)', WebkitClipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}>
              <img src="/lean.jpg" alt="Learn AI" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#222222] via-[#222222]/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Mobile Image */}
            <div className="w-full h-64 block md:hidden relative overflow-hidden">
              <img src="/lean.jpg" alt="Learn AI" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#222222] to-transparent pointer-events-none"></div>
            </div>

          </div>
        
  );
}

export function ContributeTabContent() {
  
  const areas = [
    { title: "AI Training Data", desc: "Datasets and evaluation resources that help AI learn better.", image: "/ai.jpeg" },
    { title: "SLM & AI Models", desc: "Small, efficient and domain-focused models for real applications.", image: "/slm.jpeg" },
    { title: "AI Assistants", desc: "Assistants that make knowledge and information easier to access.", image: "/ai ass.jpeg" },
    { title: "AI Copilots", desc: "AI that works alongside people to help with real tasks.", image: "/aico.jpeg" },
    { title: "Document Intelligence", desc: "Tools that turn documents and information into something useful.", image: "/doc.jpeg" },
    { title: "Workflow Bots & AI Agents", desc: "Agents and workflows that can understand tasks, use tools and get work done.", image: "/work.jpeg" },
  ];

  return (
    <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedFadeIn className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">2) Contribute</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-300">Take What You Learn Further.</h3>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
            The Madurai AI Community is where we learn, explore and experiment with AI.
            <strong className="text-white block mt-2">Pi Bi Open Intelligence is where those ideas can become something others can use, learn from and build upon.</strong>
          </p>
        </AnimatedFadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 text-left">
          {areas.map((area, idx) => (
            <AnimatedFadeIn key={idx} delay={idx * 0.1} className="bg-[#363636] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-full h-52 overflow-hidden">
                <img src={area.image} alt={area.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-[#22d3ee] mb-3">{area.title}</h3>
                <p className="text-slate-300 leading-relaxed text-sm">{area.desc}</p>
              </div>
            </AnimatedFadeIn>
          ))}
        </div>

        <AnimatedFadeIn delay={0.6} className="bg-gradient-to-r from-black/40 via-black/10 to-black/40 backdrop-blur-md border border-white/10 text-white rounded-[2rem] p-10 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Have an idea but not sure where it fits?</h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">Start with the community. We can explore it together.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contribute" className="px-8 py-4 bg-white text-[#1f6fb2] font-bold rounded-full transition-all hover:scale-105 shadow-[0_4px_15px_rgba(255,255,255,0.2)]">
                Contribute to Open Intelligence &rarr;
              </Link>
              <Link href="/contact-us" className="px-8 py-4 bg-transparent text-white font-bold rounded-full transition-all hover:bg-white/10 hover:scale-105 border border-white/50">
                Share Your Contribution &rarr;
              </Link>
            </div>
          </div>
        </AnimatedFadeIn>
      </div>
    
  );
}

export function ApplyTabContent() {
  
  const problems = [
    { title: "Health & Wellbeing", desc: "Prevention, early screening, health assistance, elderly care and public-health intelligence.", icon: <HeartPulse className="w-8 h-8" /> },
    { title: "Food & Agriculture", desc: "Crop health, water use, pest detection, farming assistance and food security.", icon: <Leaf className="w-8 h-8" /> },
    { title: "Learning & Potential", desc: "AI tutors, personalized learning, skills and knowledge access.", icon: <BookOpen className="w-8 h-8" /> },
    { title: "Climate & Resources", desc: "Floods, heat, drought, water, forests, waste and biodiversity.", icon: <Globe className="w-8 h-8" /> },
    { title: "Accessibility & Inclusion", desc: "Language, speech, vision, sign language and assistive tech.", icon: <Accessibility className="w-8 h-8" /> },
    { title: "Public Services", desc: "Citizen assistance, government services, documents, and local information.", icon: <Building2 className="w-8 h-8" /> },
    { title: "Work & Livelihoods", desc: "Jobs, skills, small businesses, entrepreneurship and economic opportunities.", icon: <Briefcase className="w-8 h-8" /> },
    { title: "Disaster & Humanitarian", desc: "Early warnings, emergency response, crisis communication and relief.", icon: <TriangleAlert className="w-8 h-8" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <AnimatedFadeIn>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">3) Apply</h2>
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-300">
              Apply AI to <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>Problems That Matter.</span>
            </h3>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10">
              Pi Bi Open Intelligence brings open datasets, models, assistants and AI agents into real-world use, focusing on problems that affect people, communities and the planet.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#explore" className="px-8 py-4 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_8px_20px_rgba(46,196,182,0.3)] border border-transparent" style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}>
                Explore Problems We Can Solve &rarr;
              </Link>
              <Link href="#propose" className="px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 font-bold rounded-full transition-all hover:border-[#2ec4b6] hover:text-[#1f6fb2] shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.1)] hover:-translate-y-1">
                Propose an AI Use Case
              </Link>
            </div>
          </AnimatedFadeIn>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob, idx) => {
            return (
              <AnimatedFadeIn key={idx} delay={idx * 0.1} className="group">
                <div className="h-full bg-gradient-to-br from-[#3285a8] to-[#256c8c] p-8 rounded-[2rem] shadow-sm border border-[#4eb1d9]/30 hover:border-white/50 hover:shadow-2xl hover:shadow-[#3285a8]/50 hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 flex flex-col relative overflow-hidden group cursor-pointer">
                  
                  {/* Decorative internal glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-white/20 transition-all duration-700"></div>

                  {/* Super Icon Container */}
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 text-white group-hover:bg-white group-hover:text-[#3285a8] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] relative z-10">
                    <span className="drop-shadow-sm transition-colors duration-500">{prob.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 relative z-10 group-hover:text-teal-100 transition-colors duration-300">{prob.title}</h3>
                  <p className="text-blue-100/90 text-sm leading-relaxed mt-auto relative z-10 group-hover:text-white transition-colors duration-300">{prob.desc}</p>
                </div>
              </AnimatedFadeIn>
            )
          })}
        </div>
      </div>
    
  );
}

export function EmpowerTabContent() {
  
  const topics = [
    { title: "AI & Machine Learning", desc: "Explore practical knowledge, research, tools and emerging developments across modern AI and machine learning.", icon: <img src="/11.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="AI logo" /> },
    { title: "Data Engineering", desc: "Discover resources on building reliable data systems, analytics platforms and data foundations for AI.", icon: <img src="/22.png" className="w-full h-full object-contain scale-90 grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Data logo" /> },
    { title: "Infrastructure & Cloud", desc: "Learn about AI infrastructure, cloud platforms, GPUs, edge computing and modern technology operations.", icon: <img src="/33.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Cloud logo" /> },
    { title: "Digital Transformation", desc: "Explore how AI and emerging technologies are changing businesses, processes and customer experiences.", icon: <img src="/44.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Digital logo" /> },
    { title: "Product & Growth", desc: "Find practical insights on building AI products, product strategy, customer adoption and sustainable growth.", icon: <img src="/55.png" className="w-full h-full object-contain scale-[1.7] grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Growth logo" /> },
    { title: "Security & Governance", desc: "Explore resources covering AI security, privacy, governance, compliance and responsible technology.", icon: <img src="/66.png" className="w-full h-full object-contain scale-90 grayscale contrast-[3] invert mix-blend-screen transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" alt="Security logo" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <AnimatedFadeIn className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">4) Empower</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-300">
            Find What You Need to Learn, Build and Grow.
          </h3>
          <p className="text-xl text-white/90 font-medium leading-relaxed mb-6">
            Open Intelligence is not only about building technology. It is also about making useful knowledge easier to find and easier to use.
          </p>
        </AnimatedFadeIn>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {topics.map((topic, idx) => (
            <AnimatedFadeIn key={idx} delay={0.1 * idx} className="h-full bg-black/20 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] hover:bg-black/40 hover:border-[#2ec4b6]/50 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden cursor-pointer">
              
              {/* Subtle elegant glow on hover */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#2ec4b6]/0 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-[#2ec4b6]/20 transition-all duration-700"></div>

              {/* Transparent Icon Container for perfect blending */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 relative z-10">
                <div className="w-full h-full drop-shadow-sm transition-colors duration-500">{topic.icon}</div>
              </div>

              <h4 className="font-bold text-xl mb-3 text-white relative z-10 transition-transform duration-300">{topic.title}</h4>
              <p className="text-white/80 text-sm leading-relaxed relative z-10 group-hover:text-white transition-colors duration-300 mt-auto">{topic.desc}</p>
              
              {/* Subtle Sliding Arrow */}
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 translate-x-4 transition-all duration-500 text-[#2ec4b6] font-bold text-xl">
                &rarr;
              </div>
            </AnimatedFadeIn>
          ))}
        </div>

        {/* Action Banner */}
        <AnimatedFadeIn delay={0.4}>
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-12 text-center bg-black/30 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-left flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">Exclusive Member Content</h3>
                <p className="text-white/90 text-lg max-w-2xl">
                  Selected technical resources and partner content are also available exclusively to Pi Bi Open Intelligence members.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Link href="/explore" className="px-8 py-4 bg-white text-[#1f6fb2] font-bold rounded-full transition-all hover:scale-105 shadow-xl text-center">
                  Explore Resources &rarr;
                </Link>
                <Link href="#join" className="px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-full transition-all hover:scale-105 border border-white text-center">
                  Become a Member &rarr;
                </Link>
              </div>
            </div>
          </div>
        </AnimatedFadeIn>

      </div>
    
  );
}

export function FeatureTabsSection() {
  const [activeTab, setActiveTab] = React.useState(0);
  const tabs = ['Learn AI', 'Contribute', 'Apply AI', 'Empower'];

  return (
    <section className="py-24 px-4 bg-[#111111] text-white relative">
      <div className="max-w-[95%] xl:max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Side: Sticky Vertical Tabs */}
        <div className="lg:w-1/4 relative">
          <div className="sticky top-32 flex flex-col space-y-6">
             {tabs.map((tab, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`text-left text-3xl md:text-4xl font-extrabold pl-6 py-2 border-l-4 transition-all duration-300 ${
                    activeTab === idx 
                      ? 'border-[#ff5e00] text-white' 
                      : 'border-transparent text-slate-600 hover:text-slate-400'
                  }`}
                >
                  {tab}
                </button>
             ))}
          </div>
        </div>

        {/* Right Side: Tab Content */}
        <div className="lg:w-3/4 min-h-[600px]">
           <AnimatePresence mode="wait">
             <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
             >
                {activeTab === 0 && <LearnTabContent />}
                {activeTab === 1 && <ContributeTabContent />}
                {activeTab === 2 && <ApplyTabContent />}
                {activeTab === 3 && <EmpowerTabContent />}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
