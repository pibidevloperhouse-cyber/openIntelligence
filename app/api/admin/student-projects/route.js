import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { studentRegistrationFields } from '@/lib/student-registration-fields';
import { verifyWhatsAppAdminSession, whatsappAdminCookie } from '@/lib/whatsapp-admin-session';

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

// GET /api/admin/student-projects
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { data, error } = await supabaseAdmin
      .from('student_project_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, projects: data || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function updateRegistration(id, details) {
  const cookieStore = await cookies();
  if (!verifyWhatsAppAdminSession(
    cookieStore.get('admin_session')?.value,
    cookieStore.get(whatsappAdminCookie)?.value,
  )) {
    return NextResponse.json({ error: 'Your admin session is missing or expired. Sign out and sign in again before saving.' }, { status: 403 });
  }

  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return NextResponse.json({ error: 'Invalid registration details' }, { status: 400 });
  }

  const updates = {};
  for (const { key, label, required, type } of studentRegistrationFields) {
    if (!Object.hasOwn(details, key)) continue;
    const value = typeof details[key] === 'string' ? details[key].trim() : null;
    let valid = value !== null && (!required || Boolean(value));
    if (value && type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (value && type === 'date') {
      const date = new Date(value);
      valid = /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
    }
    if (value && type === 'url') {
      const url = URL.canParse(value) ? new URL(value) : null;
      valid = url?.protocol === 'https:' || url?.protocol === 'http:';
    }
    if (!valid) return NextResponse.json({ error: `Enter a valid value for ${label}.` }, { status: 400 });
    updates[key] = value || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No registration details provided' }, { status: 400 });
  }

  const table = supabaseAdmin.from('student_project_submissions');
  const { data: current, error: readError } = await table.select('*').eq('id', id).maybeSingle();
  if (readError) throw readError;
  if (!current) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

  if ('city' in updates) updates.state = updates.city;
  if ('domain' in updates) updates.category = updates.domain;
  if ('email' in updates) {
    updates.email = updates.email.toLowerCase();
    if (updates.email !== current.email) {
      updates.is_email_sent = false;
      updates.email_sent_at = null;
    }
  }
  if ('team_members' in updates || 'lead_student' in updates) {
    const members = 'team_members' in updates
      ? (updates.team_members || '').split('\n').map(name => name.trim()).filter(Boolean)
      : (Array.isArray(current.team_members) ? current.team_members : []);
    const lead = updates.lead_student || current.lead_student;
    const updatedMembers = members.map(name => name === current.lead_student ? lead : name);
    updates.team_members = [...new Set([lead, ...updatedMembers].filter(Boolean))];
  }

  const project = { ...current, ...updates };
  if ('pitch' in updates || 'usp' in updates) {
    updates.tagline = project.pitch || (project.usp ? `UVP: ${project.usp.slice(0, 100)}` : null);
  }
  const descriptionSections = {
    problem_statement: 'Problem Statement',
    solution: 'Proposed Solution',
    usp: 'Unique Value Proposition (UVP)',
    outcome: 'Expected Outcome',
    technical_summary: 'Technical Summary',
  };
  if (Object.keys(descriptionSections).some(key => key in updates)) {
    updates.description = Object.entries(descriptionSections)
      .filter(([key]) => project[key])
      .map(([key, label]) => `### ${label}\n${project[key]}`)
      .join('\n\n') || 'Student innovation project for 2026 National Showcase';
  }

  const { data, error } = await table.update(updates).eq('id', id).select().single();
  if (error) throw error;
  return NextResponse.json({ success: true, project: data });
}

// PATCH /api/admin/student-projects — update details, status, or Top 10 placement
export async function PATCH(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id, details, status, action, is_top_10, top_10_rank } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    if (details !== undefined) return await updateRegistration(id, details);

    const updates = {};

    if (is_top_10 !== undefined) {
      updates.is_top_10 = Boolean(is_top_10);
      // If marking as Top 10, ensure status is APPROVED so public sees it
      if (updates.is_top_10) {
        updates.status = 'APPROVED';
      }
    }

    if (top_10_rank !== undefined) {
      updates.top_10_rank = Number(top_10_rank);
    }

    let finalStatus = status;
    if (!finalStatus && action) {
      const map = {
        approve: 'APPROVED',
        reject: 'REJECTED',
        pending: 'PENDING',
      };
      if (map[action.toLowerCase()]) {
        finalStatus = map[action.toLowerCase()];
      }
    }

    if (finalStatus) {
      updates.status = finalStatus.toUpperCase();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('student_project_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/admin/student-projects — delete a submission
export async function DELETE(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    // 1. Fetch submission details first to find any files stored in Supabase Storage
    const { data: project } = await supabaseAdmin
      .from('student_project_submissions')
      .select('id, video_url, presentation_url, demo_url')
      .eq('id', id)
      .single();

    if (project) {
      const urlsToCheck = [project.video_url, project.presentation_url, project.demo_url].filter(Boolean);
      const studentFilesToDelete = [];
      const eventFilesToDelete = [];

      for (const url of urlsToCheck) {
        // Check if URL is from Supabase storage bucket 'student-projects' or 'events'
        const studentMarker = '/storage/v1/object/public/student-projects/';
        const eventsMarker = '/storage/v1/object/public/events/';

        if (url.includes(studentMarker)) {
          const rawFilename = url.substring(url.indexOf(studentMarker) + studentMarker.length).split('?')[0];
          const decoded = decodeURIComponent(rawFilename);
          if (decoded) studentFilesToDelete.push(decoded);
        } else if (url.includes(eventsMarker)) {
          const rawFilename = url.substring(url.indexOf(eventsMarker) + eventsMarker.length).split('?')[0];
          const decoded = decodeURIComponent(rawFilename);
          if (decoded) eventFilesToDelete.push(decoded);
        }
      }

      if (studentFilesToDelete.length > 0) {
        console.log(`[Admin DELETE] Deleting ${studentFilesToDelete.length} file(s) from 'student-projects' bucket:`, studentFilesToDelete);
        const { error: delStudentErr } = await supabaseAdmin
          .storage
          .from('student-projects')
          .remove(studentFilesToDelete);

        if (delStudentErr) {
          console.error('[Admin DELETE] Error removing files from student-projects storage:', delStudentErr);
        }
      }

      if (eventFilesToDelete.length > 0) {
        console.log(`[Admin DELETE] Deleting ${eventFilesToDelete.length} file(s) from 'events' bucket:`, eventFilesToDelete);
        const { error: delEventsErr } = await supabaseAdmin
          .storage
          .from('events')
          .remove(eventFilesToDelete);

        if (delEventsErr) {
          console.error('[Admin DELETE] Error removing files from events storage:', delEventsErr);
        }
      }
    }

    // 2. Delete from database
    const { error } = await supabaseAdmin
      .from('student_project_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully from database and Supabase storage' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
