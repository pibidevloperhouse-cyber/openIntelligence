'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { PrizeSection } from '../components/PrizeSection';
import { OpenIntelligenceSpotlight } from '../components/OpenIntelligenceSpotlight';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { EvaluationSection } from '../components/EvaluationSection';
import { FaqSection } from '../components/FaqSection';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { SubmitProjectModal } from '../components/SubmitProjectModal';
import { INITIAL_PROJECTS } from '../data/projectsData';

export default function Home() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const [currency, setCurrency] = useState('INR');

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  useEffect(() => {
    setProjects(INITIAL_PROJECTS);
  }, []);

  const handleUpvote = (id) => {
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyUpvoted = next.has(id);

      if (isCurrentlyUpvoted) {
        next.delete(id);
      } else {
        next.add(id);
      }

      setProjects((currentProjects) =>
        currentProjects.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              upvotes: isCurrentlyUpvoted ? p.upvotes - 1 : p.upvotes + 1,
            };
          }
          return p;
        })
      );

      // Also update selectedProject if open
      if (selectedProject && selectedProject.id === id) {
        setSelectedProject((curr) =>
          curr
            ? {
                ...curr,
                upvotes: isCurrentlyUpvoted ? curr.upvotes - 1 : curr.upvotes + 1,
              }
            : null
        );
      }

      return next;
    });
  };

  const handleNewProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-800 flex flex-col selection:bg-[#2ec4b6]/20 selection:text-[#1f6fb2]">
      {/* Main Page Flow */}
      <main className="flex-1">
        <HeroSection
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          currency={currency}
        />

        <PrizeSection
          currency={currency}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        />

        <OpenIntelligenceSpotlight
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        />

        {/* Student Project Showcase Gallery section - Un-comment when ready */}
        {/* <ProjectShowcase
          projects={projects}
          onSelectProject={setSelectedProject}
          onUpvote={handleUpvote}
          upvotedIds={upvotedIds}
          currency={currency}
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        /> */}


        <EvaluationSection />

        <FaqSection />
      </main>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onUpvote={handleUpvote}
        hasUpvoted={selectedProject ? upvotedIds.has(selectedProject.id) : false}
        currency={currency}
      />

      <SubmitProjectModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={handleNewProject}
      />
    </div>
  );
}
