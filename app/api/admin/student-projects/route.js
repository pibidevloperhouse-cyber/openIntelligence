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

    const { error } = await supabaseAdmin
      .from('student_project_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
