import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

// PATCH /api/admin/student-projects — update submission status (APPROVED, REJECTED, PENDING) or toggle is_top_10
export async function PATCH(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id, status, action, is_top_10, top_10_rank } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

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
      const filesToDelete = [];

      for (const url of urlsToCheck) {
        // Check if URL is from Supabase storage bucket 'events'
        // Format: .../storage/v1/object/public/events/<filename>
        const bucketMarker = '/storage/v1/object/public/events/';
        const markerIdx = url.indexOf(bucketMarker);
        if (markerIdx !== -1) {
          const rawFilename = url.substring(markerIdx + bucketMarker.length).split('?')[0];
          const decoded = decodeURIComponent(rawFilename);
          if (decoded) filesToDelete.push(decoded);
        }
      }

      if (filesToDelete.length > 0) {
        console.log(`[Admin DELETE] Deleting ${filesToDelete.length} file(s) from Supabase Storage 'events' bucket:`, filesToDelete);
        const { error: delStorageErr } = await supabaseAdmin
          .storage
          .from('events')
          .remove(filesToDelete);

        if (delStorageErr) {
          console.error('[Admin DELETE] Error removing files from storage:', delStorageErr);
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
