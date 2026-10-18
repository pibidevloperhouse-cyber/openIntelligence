import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

// POST /api/top-10-projects/vote — Cast a vote for a student project
export async function POST(request) {
  try {
    const body = await request.json();
    const { projectId, voterName, voterEmail } = body;

    // 1. Validation
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const cleanName = (voterName || '').trim();
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json({ error: 'Please enter your full name (minimum 2 characters)' }, { status: 400 });
    }

    const cleanEmail = (voterEmail || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    // 2. Check if Top 10 voting is active in settings
    const { data: settingRow } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', 'top10_showcase_active')
      .maybeSingle();

    if (settingRow && settingRow.value === false) {
      return NextResponse.json(
        { error: 'Public voting is currently closed by administration.' },
        { status: 403 }
      );
    }

    // 3. Verify project exists
    const { data: project, error: projError } = await supabaseAdmin
      .from('student_project_submissions')
      .select('id, title, is_top_10, votes_count')
      .eq('id', projectId)
      .single();

    if (projError || !project) {
      return NextResponse.json({ error: 'Selected project was not found' }, { status: 404 });
    }

    // 4. DUPLICATE CHECK — Strict prevention against same email voting
    // Check if this email has voted for ANY project in Top 10 Showcase overall (1 email = 1 vote rule)
    const { data: existingVote } = await supabaseAdmin
      .from('project_votes')
      .select('id, project_id, voter_email, created_at, student_project_submissions ( title )')
      .ilike('voter_email', cleanEmail)
      .maybeSingle();

    if (existingVote) {
      const alreadyVotedTitle = existingVote?.student_project_submissions?.title;
      const isSameProject = existingVote.project_id === projectId;

      const errorMessage = isSameProject
        ? `Duplicate vote rejected! You have already cast your official vote for "${project.title}" using "${cleanEmail}".`
        : `Duplicate vote rejected! This email ("${cleanEmail}") has already voted for "${alreadyVotedTitle || 'another project'}". Each email is strictly limited to 1 vote across all projects in the competition.`;

      return NextResponse.json(
        {
          error: errorMessage,
          code: isSameProject ? 'SAME_EMAIL_SAME_PROJECT' : 'SAME_EMAIL_ANOTHER_PROJECT',
          alreadyVotedProjectId: existingVote.project_id,
          alreadyVotedTitle: alreadyVotedTitle || null,
        },
        { status: 409 }
      );
    }

    // 4. Extract IP & User Agent for auditing
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : (request.headers.get('x-real-ip') || '127.0.0.1');
    const userAgent = request.headers.get('user-agent') || '';

    // 5. Record Vote in project_votes
    const { error: insertError } = await supabaseAdmin
      .from('project_votes')
      .insert({
        project_id: projectId,
        voter_name: cleanName,
        voter_email: cleanEmail,
        ip_address: ip,
        user_agent: userAgent,
      });

    if (insertError) {
      // If database unique constraint tripped (1 vote per email)
      if (insertError.code === '23505') {
        return NextResponse.json(
          {
            error: `Duplicate vote rejected! This email "${cleanEmail}" has already been used to cast a vote. Only 1 vote per email is permitted across the entire competition.`,
            code: 'EMAIL_ALREADY_VOTED'
          },
          { status: 409 }
        );
      }
      console.error('[POST /api/top-10-projects/vote insert error]', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 6. Increment project votes_count
    const updatedCount = (project.votes_count || 0) + 1;
    await supabaseAdmin
      .from('student_project_submissions')
      .update({ votes_count: updatedCount })
      .eq('id', projectId);

    return NextResponse.json({
      success: true,
      message: `🎉 Thank you, ${cleanName}! Your vote for "${project.title}" has been recorded successfully.`,
      newVoteCount: updatedCount,
      votedProject: {
        id: project.id,
        title: project.title,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/top-10-projects/vote]', err);
    return NextResponse.json({ error: err.message || 'Failed to submit vote' }, { status: 500 });
  }
}

// GET /api/top-10-projects/vote — Check if an email has already voted
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = (searchParams.get('email') || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ hasVoted: false });
    }

    const { data: existingVote } = await supabaseAdmin
      .from('project_votes')
      .select('id, project_id, voter_name, created_at, student_project_submissions ( title )')
      .ilike('voter_email', email)
      .maybeSingle();

    if (existingVote) {
      return NextResponse.json({
        hasVoted: true,
        votedProjectId: existingVote.project_id,
        votedProjectTitle: existingVote?.student_project_submissions?.title || 'Another Project',
        votedAt: existingVote.created_at,
      });
    }

    return NextResponse.json({ hasVoted: false });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
