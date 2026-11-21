'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Code2, ThumbsUp, CheckCircle2, Building2 } from 'lucide-react';
import ProjectVoteDialog from './ProjectVoteDialog';

export default function TopProjectCard({ project, votingEnabled, onInspect }) {
  const [showVote, setShowVote] = useState(false);
  const [voted, setVoted] = useState(false);
  const members = [...new Set([project.lead_student, ...(Array.isArray(project.team_members) ? project.team_members : [])].filter(Boolean))];

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="max-w-[65%] truncate rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-[#1f6fb2]">{project.domain || project.category}</span>
          <time className="shrink-0 text-xs text-slate-400">{project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</time>
        </div>
        {votingEnabled && (
          <div className="my-3 flex justify-end">
            {voted ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800"><CheckCircle2 className="size-4" /> Voted</span>
            ) : (
              <button type="button" onClick={() => setShowVote(true)} aria-label={`Vote for ${project.title}`} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-orange-600 bg-linear-to-br from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-orange-950 shadow-sm hover:from-amber-300 hover:to-orange-400">
                <ThumbsUp className="size-4" aria-hidden="true" /> Vote
              </button>
            )}
          </div>
        )}
        <h2 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-950">{project.title}</h2>
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#1f6fb2] to-[#2ec4b6] text-white">{project.lead_student?.[0]}</span>
            {project.lead_student}
            <span className="rounded border border-sky-200 bg-sky-50 px-1 text-[10px] text-[#1f6fb2]">Lead</span>
          </div>
          <p className="flex items-start gap-1.5 text-xs text-slate-500"><Building2 className="size-3.5 shrink-0" aria-hidden="true" />{project.institution}{project.city && ` • ${project.city}`}</p>
          <p className="text-xs text-slate-400">{[project.dept, project.year].filter(Boolean).join(' • ')}</p>
        </div>
        <div className="mt-4 border-t border-dashed border-slate-200 pt-3">
          <p className="text-[10px] font-bold uppercase text-slate-500">Team Members ({members.length})</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {members.map(member => <span key={member} className="rounded-md border border-sky-100 bg-sky-50 px-2 py-1 text-[10px] text-[#1f6fb2]">{member}{member === project.lead_student ? ' (Lead)' : ''}</span>)}
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{project.usp || project.tagline || project.problem_statement || project.solution}</p>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
        <div className="flex items-center gap-2">
          {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700"><Code2 className="size-4" /></a>}
          {project.registration_id && <Link href={`/registered-students?regId=${encodeURIComponent(project.registration_id)}`} className="rounded-lg bg-[#070e1e] px-3 py-2 text-xs font-bold text-[#2ec4b6]">🎖️ Badge</Link>}
        </div>
        <button type="button" onClick={onInspect} className="cursor-pointer rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-[#1f6fb2] hover:bg-sky-100">Full Details →</button>
      </div>
      {showVote && <ProjectVoteDialog project={project} votingEnabled={votingEnabled} onVoted={() => setVoted(true)} onClose={() => setShowVote(false)} />}
    </article>
  );
}
