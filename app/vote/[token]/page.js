import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { readProjectVoteToken, votingWindowOpen } from '@/lib/project-vote-links';
import ProjectVoteCard from './ProjectVoteCard';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Project Voting | National Innovation Showcase 2026',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function VotePage({ params }) {
  const { token } = await params;
  const id = readProjectVoteToken(token);
  if (!id) notFound();

  const projectResult = await supabaseAdmin.from('student_project_submissions')
    .select('id, title, institution').eq('id', id).maybeSingle();
  if (projectResult.error) throw new Error('Could not load project');
  if (!projectResult.data) notFound();

  return (
    <ProjectVoteCard
      project={projectResult.data}
      token={token}
      votingEnabled={votingWindowOpen()}
    />
  );
}
