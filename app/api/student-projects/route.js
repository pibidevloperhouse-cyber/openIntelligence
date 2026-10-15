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

    const body = await request.json();
    const {
      title,
      category,
      tagline,
      leadStudent,
      institution,
      teamMembers,
      description,
      githubUrl,
      demoUrl,
      tags,
    } = body;

    if (!title || !leadStudent || !institution || !description || !demoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields. Title, Lead Student, Institution, Description, and Live Demo URL are required.' },
        { status: 400 }
      );
    }

    const membersArray = Array.isArray(teamMembers)
      ? teamMembers.map((m) => String(m).trim()).filter(Boolean)
      : [leadStudent.trim()];

    const tagsArray = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : [category || 'AI & ML', 'Prototype'];

    const insertPayload = {
      title: title.trim(),
      category: category || 'AI & ML',
      tagline: tagline ? tagline.trim() : null,
      lead_student: leadStudent.trim(),
      institution: institution.trim(),
      team_members: membersArray,
      description: description.trim(),
      github_url: githubUrl ? githubUrl.trim() : null,
      demo_url: demoUrl.trim(),
      tags: tagsArray,
      status: 'PENDING',
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
