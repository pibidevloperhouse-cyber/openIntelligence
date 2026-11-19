'use client';

import { useState } from 'react';
import { CheckCircle2, ThumbsUp } from 'lucide-react';
import ProjectVoteDialog from '@/components/student-showcase/components/ProjectVoteDialog';

export default function ProjectVoteCard({ project, token, votingEnabled }) {
  const [showVote, setShowVote] = useState(false);
  const [voted, setVoted] = useState(false);

  return (
    <div className="mx-auto grid min-h-[65vh] max-w-2xl place-items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold text-[#185989]">National Innovation Showcase 2026</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">{project.title}</h1>
        <p className="mt-2 text-slate-600">{project.institution}</p>
        <p className="mt-6 text-sm text-slate-600">Voting runs 11–30 November 2026 (IST) and contributes 5% of the final evaluation score.</p>
        {voted ? (
          <p role="status" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-3 font-bold text-emerald-800">
            <CheckCircle2 aria-hidden="true" className="size-5" /> Vote submitted
          </p>
        ) : votingEnabled ? (
          <button type="button" onClick={() => setShowVote(true)} className="mt-6 inline-flex cursor-pointer items-center gap-3 rounded-full border border-orange-600 bg-linear-to-br from-amber-400 to-orange-500 px-5 py-3 font-bold text-orange-950 shadow-sm hover:from-amber-300 hover:to-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
            <ThumbsUp aria-hidden="true" className="size-5" /> Vote for this project
          </button>
        ) : (
          <p className="mt-6 font-semibold text-slate-800">Voting is currently closed.</p>
        )}
      </section>
      {showVote && <ProjectVoteDialog project={project} voteToken={token} votingEnabled={votingEnabled} onVoted={() => setVoted(true)} onClose={() => setShowVote(false)} />}
    </div>
  );
}
