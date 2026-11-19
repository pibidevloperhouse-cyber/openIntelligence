'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ProjectVoteDialog({ project, voteToken, votingEnabled, onVoted, onClose }) {
  const dialog = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  async function submitVote(event) {
    event.preventDefault();
    if (submitting || !votingEnabled) return;

    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/top-10-projects/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          voteToken,
          voterName: form.get('name'),
          voterEmail: form.get('email'),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Could not submit your vote. Try again.');
        return;
      }
      setSuccess(true);
      onVoted(project.id);
    } catch {
      setError('Could not reach the voting server. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-vote-title"
      onCancel={(event) => {
        if (submitting) event.preventDefault();
      }}
      onClose={onClose}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/50"
    >
      <h2 id="project-vote-title" className="text-xl font-bold">{success ? 'Vote submitted' : 'Cast your vote'}</h2>
      {success ? (
        <div role="status" className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <CheckCircle2 className="size-6 shrink-0 text-emerald-700" aria-hidden="true" />
          <div>
            <p className="font-bold">Your vote was recorded.</p>
            <p className="mt-1 text-sm">You voted for <strong>{project.title}</strong>.</p>
          </div>
        </div>
      ) : !votingEnabled && !submitting ? (
        <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Public voting is currently closed.</p>
      ) : (
        <form id="project-vote-form" onSubmit={submitVote} className="mt-4 space-y-4">
          <p className="rounded-lg bg-sky-50 p-3 text-sm font-semibold text-[#185989]">{project.title}</p>
          <p className="text-sm text-slate-600">Each email can vote once across all projects.</p>
          <label className="block text-sm font-semibold">
            Name
            <input name="name" autoComplete="name" required minLength={2} maxLength={120} disabled={submitting} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input name="email" type="email" autoComplete="email" required maxLength={254} disabled={submitting} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        </form>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" disabled={submitting} onClick={() => dialog.current.close()} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-50">
          {success || !votingEnabled ? 'Done' : 'Cancel'}
        </button>
        {!success && (votingEnabled || submitting) && (
          <button type="submit" form="project-vote-form" disabled={submitting} className="rounded-lg bg-[#1f6fb2] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {submitting ? 'Submitting…' : 'Submit Vote'}
          </button>
        )}
      </div>
    </dialog>
  );
}
