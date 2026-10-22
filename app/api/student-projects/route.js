import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Helper to check if current user is banned
async function getIsBanned() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabaseAdmin.from('users').select('bio').eq('id', user.id).single();
    return profile?.bio === '__BANNED__';
  } catch {
    return false;
  }
}

// POST /api/student-projects — submit a student project for review
export async function POST(request) {
  try {
    if (await getIsBanned()) {
      return NextResponse.json(
        { error: 'Your account has been banned. You cannot submit projects.' },
        { status: 403 }
      );
    }

    // Check if student registration is closed
    const { data: settingRow } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', 'student_registration_closed')
      .maybeSingle();

    if (settingRow && settingRow.value === true) {
      return NextResponse.json(
        { error: 'Registration is currently closed! New student submissions are not being accepted at this time.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      // Step 1: Personal Information
      name,
      leadStudent,
      email,
      phone,
      phoneNo,
      college,
      institution,
      dept,
      year,
      dob,

      // Step 2: Project Information
      projectTitle,
      title,
      domain,
      category,
      problemStatement,
      solution,
      usp,
      outcome,

      // Step 3: Working Demo
      githubLink,
      githubUrl,
      presentation,
      presentationUrl,
      video,
      videoUrl,
      technicalSummary,
      pitch,
      tagline,
      demoUrl,
      teamMembers,
      tags,
    } = body;

    const finalName = (name || leadStudent || '').trim();
    const finalCollege = (college || institution || '').trim();
    const finalEmail = (email || '').trim();
    const finalPhone = (phone || phoneNo || '').trim();
    const finalTitle = (projectTitle || title || '').trim();
    const finalDomain = (domain || category || 'AI & ML').trim();
    const finalProblem = (problemStatement || '').trim();
    const finalSolution = (solution || '').trim();
    const finalUsp = (usp || '').trim();
    const finalOutcome = (outcome || '').trim();
    const finalGithub = (githubLink || githubUrl || '').trim();
    const finalPresentation = (presentation || presentationUrl || '').trim();
    const finalVideo = (video || videoUrl || '').trim();
    const finalTechSummary = (technicalSummary || '').trim();
    const finalPitch = (pitch || tagline || '').trim();
    
    // Clean demo_url: only keep if explicitly provided and not a duplicate of slides/video/github
    const rawDemo = (body.liveDemo || body.liveDemoUrl || demoUrl || '').trim();
    const finalDemoUrl = (rawDemo && rawDemo !== finalPresentation && rawDemo !== finalVideo && rawDemo !== finalGithub && rawDemo !== 'https://pibiopenintelligence.org') ? rawDemo : null;

    const finalCity = (body.city || body.district || body.location || body.state || '').trim();

    if (!finalName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!finalEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!finalPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    if (!finalCity) {
      return NextResponse.json({ error: 'City / District is required (e.g. Madurai, Chennai)' }, { status: 400 });
    }
    if (!finalCollege) {
      return NextResponse.json({ error: 'College / University is required' }, { status: 400 });
    }
    if (!finalTitle) {
      return NextResponse.json({ error: 'Project Title is required' }, { status: 400 });
    }
    if (!finalProblem) {
      return NextResponse.json({ error: 'Problem Statement is required' }, { status: 400 });
    }
    if (!finalSolution) {
      return NextResponse.json({ error: 'Solution is required' }, { status: 400 });
    }
    if (!finalGithub) {
      return NextResponse.json({ error: 'Project GitHub Repository link is required' }, { status: 400 });
    }
    if (!finalPresentation) {
      return NextResponse.json({ error: 'Presentation / Slides (link or PDF upload) is required' }, { status: 400 });
    }
    if (!finalVideo) {
      return NextResponse.json({ error: 'Project Explanation Video (link or video upload) is required' }, { status: 400 });
    }

    let membersArray = [];
    if (Array.isArray(teamMembers) && teamMembers.length > 0) {
      membersArray = teamMembers.map((m) => String(m).trim()).filter(Boolean);
    } else if (typeof teamMembers === 'string' && teamMembers.trim()) {
      membersArray = teamMembers.split(',').map((m) => m.trim()).filter(Boolean);
    }
    if (finalName && !membersArray.includes(finalName)) {
      membersArray = [finalName, ...membersArray];
    }
    if (membersArray.length === 0 && finalName) {
      membersArray = [finalName];
    }

    const tagsArray = Array.isArray(tags) && tags.length > 0
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : [finalDomain, '2026 Candidate', 'Prototype'];

    const fullDescription = [
      finalProblem ? `### Problem Statement\n${finalProblem}` : '',
      finalSolution ? `### Proposed Solution\n${finalSolution}` : '',
      finalUsp ? `### Unique Selling Proposition (USP)\n${finalUsp}` : '',
      finalOutcome ? `### Expected Outcome\n${finalOutcome}` : '',
      finalTechSummary ? `### Technical Summary\n${finalTechSummary}` : '',
    ].filter(Boolean).join('\n\n');

    const insertPayload = {
      title: finalTitle,
      category: finalDomain,
      domain: finalDomain,
      tagline: finalPitch || (finalUsp ? `USP: ${finalUsp.slice(0, 100)}` : null),
      lead_student: finalName,
      institution: finalCollege,
      city: finalCity,
      state: finalCity,
      email: finalEmail,
      phone: finalPhone,
      dept: (dept || '').trim() || null,
      year: (year || '').trim() || null,
      dob: (dob || '').trim() || null,
      problem_statement: finalProblem || null,
      solution: finalSolution || null,
      usp: finalUsp || null,
      outcome: finalOutcome || null,
      technical_summary: finalTechSummary || null,
      pitch: finalPitch || null,
      github_url: finalGithub || null,
      presentation_url: finalPresentation || null,
      video_url: finalVideo || null,
      demo_url: finalDemoUrl,
      team_members: membersArray,
      description: fullDescription || 'Student innovation project for 2026 National Showcase',
      tags: tagsArray,
      status: 'PENDING',
      raw_data: body,
    };

    const { data, error } = await supabaseAdmin
      .from('student_project_submissions')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      console.error('[POST /api/student-projects error]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/student-projects]', err);
    return NextResponse.json({ error: err.message || 'Failed to submit student project' }, { status: 500 });
  }
}

// GET /api/student-projects — public listing of approved student projects
export async function GET() {
  try {
    if (await getIsBanned()) {
      return NextResponse.json({ projects: [], banned: true, error: 'Your account has been banned.' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('student_project_submissions')
      .select('*')
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
