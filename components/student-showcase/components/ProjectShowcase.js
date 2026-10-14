'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  Trophy,
  Globe,
  ThumbsUp,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'AI & ML',
  'Robotics & GreenTech',
  'Cybersecurity & Web3',
  'IoT & Hardware',
  'Healthcare & Assistive',
];

export const ProjectShowcase = ({
  projects,
  onSelectProject,
  onUpvote,
  upvotedIds,
  currency,
  onOpenSubmitModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.institution.toLowerCase().includes(q) ||
        project.leadStudent.toLowerCase().includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="showcase" className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">

          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta)' }}
          >
            Student Project{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Showcase Gallery
            </span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg">
            Discover student creations across AI, Robotics, GreenTech, and Web3.
            Top 3 ranked entries win cash prizes and an exclusive feature on PiBi Open Intelligence.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-4 mb-12 max-w-5xl mx-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, tech stack (PyTorch, ROS 2, Rust...), student name, or college..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#2ec4b6] focus:ring-2 focus:ring-[#2ec4b6]/20 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-stylized text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-2 hidden sm:block" />
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-stylized ${
                    isSelected
                      ? 'text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                  }`}
                  style={
                    isSelected
                      ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }
                      : {}
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 max-w-md mx-auto">
            <p className="text-slate-500 text-sm">No student projects matched your search criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-[#1f6fb2] bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => {
              const isUpvoted = upvotedIds.has(project.id);

              return (
                <div
                  key={project.id}
                  className="clean-card rounded-3xl overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Image Preview */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                    {/* Rank Badge Header */}
                    {project.rank && (
                      <div
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-sm font-stylized ${
                          project.rank === 1
                            ? 'bg-amber-400 text-slate-950'
                            : project.rank === 2
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-amber-700 text-white'
                        }`}
                      >
                        <Trophy className="w-3 h-3" />
                        <span>
                          {project.rank === 1
                            ? '1st Place'
                            : project.rank === 2
                            ? '2nd Place'
                            : '3rd Place'}
                        </span>
                        <span className="opacity-75">•</span>
                        <span>
                          {currency === 'INR' ? project.prizeAmountINR : project.prizeAmountUSD}
                        </span>
                      </div>
                    )}

                    {/* Open Intelligence Feature Tag */}
                    {project.openIntelligenceFeatured && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#0e8579] border border-[#2ec4b6]/40 shadow-xs flex items-center gap-1 font-stylized">
                        <Globe className="w-3 h-3 text-[#2ec4b6]" />
                        <span>PiBi Open Intelligence</span>
                      </div>
                    )}

                    {/* Category pill bottom left */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs font-stylized">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3
                        className="text-xl font-bold text-slate-900 group-hover:text-[#1f6fb2] transition-colors"
                        style={{ fontFamily: 'var(--font-plus-jakarta)' }}
                      >
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Institution and Student */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <GraduationCap className="w-4 h-4 text-[#1f6fb2] shrink-0" />
                        <span className="truncate font-medium">{project.institution}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Lead: <strong className="text-slate-800">{project.leadStudent}</strong>
                      </div>
                    </div>

                    {/* Tech Tags in Space Grotesk */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-stylized bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-stylized bg-slate-50 text-slate-400">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1f6fb2] hover:text-[#0e8579] group-hover:translate-x-0.5 transition-all cursor-pointer"
                      >
                        <span>View Architecture</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onUpvote(project.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-stylized ${
                          isUpvoted
                            ? 'bg-[#2ec4b6]/15 text-[#0e8579] border border-[#2ec4b6]/40'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Upvote this project"
                      >
                        <ThumbsUp className={`w-3 h-3 ${isUpvoted ? 'fill-current text-[#2ec4b6]' : ''}`} />
                        <span className="text-[11px]">{project.upvotes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Call to Action Card */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 max-w-4xl mx-auto shadow-xs">
          <h3
            className="text-2xl font-bold text-slate-900"
            style={{ fontFamily: 'var(--font-plus-jakarta)' }}
          >
            Built an innovative project during your studies?
          </h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Submit your student project to compete for the Top 3 Cash Rewards and get officially
            featured on PiBi Open Intelligence.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenSubmitModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Submit Your Project Now</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProjectShowcase;
