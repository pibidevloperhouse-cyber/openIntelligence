import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

async function isAdmin() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get('admin_session')?.value;
    if (!raw) return false;
    const session = JSON.parse(raw);
    return session?.role === 'ADMIN';
  } catch {
    return false;
  }
}

// GET /api/admin/student-projects/votes?projectId=...
export async function GET(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (projectId) {
      // Get project details
      const { data: project } = await supabaseAdmin
        .from('student_project_submissions')
        .select('id, title, lead_student, institution, domain, votes_count')
        .eq('id', projectId)
        .maybeSingle();

      // Get voters for this project
      const { data: voters, error } = await supabaseAdmin
        .from('project_votes')
        .select('id, project_id, voter_name, voter_email, ip_address, user_agent, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[GET /api/admin/student-projects/votes error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        project: project || null,
        voters: voters || [],
        totalVotes: voters?.length || 0,
      });
    }

    // Otherwise return all votes across all projects
    const { data: allVotes, error: allErr } = await supabaseAdmin
      .from('project_votes')
      .select('id, project_id, voter_name, voter_email, ip_address, user_agent, created_at, student_project_submissions ( id, title, lead_student, institution, domain )')
      .order('created_at', { ascending: false });

    if (allErr) {
      console.error('[GET /api/admin/student-projects/votes all error]', allErr);
      return NextResponse.json({ error: allErr.message }, { status: 500 });
    }

    const formatted = (allVotes || []).map((v) => ({
      id: v.id,
      project_id: v.project_id,
      project_title: v.student_project_submissions?.title || 'Unknown Project',
      lead_student: v.student_project_submissions?.lead_student || 'Unknown Student',
      institution: v.student_project_submissions?.institution || '',
      voter_name: v.voter_name,
      voter_email: v.voter_email,
      ip_address: v.ip_address,
      user_agent: v.user_agent,
      created_at: v.created_at,
    }));

    return NextResponse.json({
      success: true,
      voters: formatted,
      totalVotes: formatted.length,
    });
  } catch (err) {
    console.error('[GET /api/admin/student-projects/votes]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/student-projects/votes — delete a vote (Admin only)
export async function DELETE(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { voteId } = await request.json();
    if (!voteId) {
      return NextResponse.json({ error: 'Vote ID is required' }, { status: 400 });
    }

    // Find vote first
    const { data: vote } = await supabaseAdmin
      .from('project_votes')
      .select('id, project_id')
      .eq('id', voteId)
      .maybeSingle();

    if (!vote) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 });
    }

    // Delete vote
    const { error: delErr } = await supabaseAdmin
      .from('project_votes')
      .delete()
      .eq('id', voteId);

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    // Recalculate votes_count
    const { count } = await supabaseAdmin
      .from('project_votes')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', vote.project_id);

    await supabaseAdmin
      .from('student_project_submissions')
      .update({ votes_count: count || 0 })
      .eq('id', vote.project_id);

    return NextResponse.json({
      success: true,
      message: 'Vote deleted successfully',
      newCount: count || 0,
      projectId: vote.project_id,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
