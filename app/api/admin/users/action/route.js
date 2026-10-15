import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Check admin via cookie
async function isAdmin() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get('admin_session')?.value;
    if (!raw) return false;
    const session = JSON.parse(raw);
    return session?.role === 'ADMIN';
  } catch { return false; }
}

export async function PATCH(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { userId, action } = await req.json();
    if (!userId || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (action === 'ban') {
      // 1. Mark user as BANNED
      await supabaseAdmin.from('users').update({ bio: '__BANNED__' }).eq('id', userId);
      // 2. Hide all resources contributed by this user immediately
      await supabaseAdmin.from('resources').update({ status: 'REJECTED' }).eq('contributor_id', userId);
      // 3. Hide any student projects submitted by this user
      const { data: userRec } = await supabaseAdmin.from('users').select('username, email').eq('id', userId).single();
      if (userRec?.username) {
        await supabaseAdmin.from('student_project_submissions')
          .update({ status: 'REJECTED' })
          .or(`lead_student.ilike.%${userRec.username}%,github_url.ilike.%${userRec.username}%`);
      }
    } else if (action === 'unban') {
      // 1. Unban user
      await supabaseAdmin.from('users').update({ bio: null }).eq('id', userId);
      // 2. Restore their resources
      await supabaseAdmin.from('resources').update({ status: 'APPROVED' }).eq('contributor_id', userId);
      // 3. Restore student projects
      const { data: userRec } = await supabaseAdmin.from('users').select('username, email').eq('id', userId).single();
      if (userRec?.username) {
        await supabaseAdmin.from('student_project_submissions')
          .update({ status: 'APPROVED' })
          .or(`lead_student.ilike.%${userRec.username}%,github_url.ilike.%${userRec.username}%`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/admin/users/action]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
