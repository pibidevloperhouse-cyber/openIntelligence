import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET /api/top-10-projects — Fetch curated Top 10 student projects for public showcase & voting
export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from('student_project_submissions')
      .select(`
        id,
        title,
        tagline,
        description,
        category,
        domain,
        lead_student,
        institution,
        dept,
        year,
        team_members,
        problem_statement,
        solution,
        usp,
        outcome,
        technical_summary,
        pitch,
        github_url,
        demo_url,
        presentation_url,
        video_url,
        tags,
        is_top_10,
        top_10_rank,
        votes_count,
        status,
        created_at
      `)
      .eq('is_top_10', true)
      .order('votes_count', { ascending: false })
      .order('top_10_rank', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/top-10-projects error]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Total votes across all projects
    const totalVotes = (projects || []).reduce((acc, p) => acc + (p.votes_count || 0), 0);

    return NextResponse.json({
      success: true,
      projects: projects || [],
      totalProjects: (projects || []).length,
      totalVotes,
    });
  } catch (err) {
    console.error('[GET /api/top-10-projects]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
