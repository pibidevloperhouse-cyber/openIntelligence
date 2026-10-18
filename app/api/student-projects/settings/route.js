import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// Helper to check admin session
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

// GET /api/student-projects/settings — Check registration status & countdown deadline
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('app_settings')
      .select('key, value')
      .in('key', ['student_registration_closed', 'student_countdown_deadline', 'top10_showcase_active']);

    let isRegistrationClosed = false;
    let countdownDeadline = '2026-11-14T23:59:59+05:30';
    let isTop10Active = false;

    if (!error && data) {
      data.forEach((row) => {
        if (row.key === 'student_registration_closed') {
          isRegistrationClosed = Boolean(row.value);
        }
        if (row.key === 'student_countdown_deadline') {
          if (row.value) {
            countdownDeadline = typeof row.value === 'string' ? row.value : String(row.value).replace(/^"|"$/g, '');
          }
        }
        if (row.key === 'top10_showcase_active') {
          isTop10Active = Boolean(row.value);
        }
      });
    }

    return NextResponse.json({
      isRegistrationClosed,
      countdownDeadline,
      isTop10Active,
    });
  } catch (err) {
    console.error('[GET /api/student-projects/settings]', err);
    return NextResponse.json({
      isRegistrationClosed: false,
      countdownDeadline: '2026-11-14T23:59:59+05:30',
      isTop10Active: false,
    });
  }
}

// PATCH /api/student-projects/settings — Update student registration & deadline (Admin only)
export async function PATCH(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updates = [];

    if (typeof body.isRegistrationClosed !== 'undefined') {
      const isClosed = Boolean(body.isRegistrationClosed);
      updates.push(
        supabaseAdmin.from('app_settings').upsert({
          key: 'student_registration_closed',
          value: isClosed,
          updated_at: new Date().toISOString(),
        })
      );
    }

    if (typeof body.countdownDeadline !== 'undefined') {
      const deadline = String(body.countdownDeadline).trim();
      updates.push(
        supabaseAdmin.from('app_settings').upsert({
          key: 'student_countdown_deadline',
          value: deadline,
          updated_at: new Date().toISOString(),
        })
      );
    }

    if (typeof body.isTop10Active !== 'undefined') {
      const isTop10 = Boolean(body.isTop10Active);
      updates.push(
        supabaseAdmin.from('app_settings').upsert({
          key: 'top10_showcase_active',
          value: isTop10,
          updated_at: new Date().toISOString(),
        })
      );
    }

    if (updates.length > 0) {
      const results = await Promise.all(updates);
      const hasError = results.find(r => r.error);
      if (hasError) {
        console.error('[PATCH /api/student-projects/settings error]', hasError.error);
        return NextResponse.json({ error: hasError.error.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      isRegistrationClosed: body.isRegistrationClosed,
      countdownDeadline: body.countdownDeadline,
      isTop10Active: body.isTop10Active,
      message: 'Settings updated successfully.',
    });
  } catch (err) {
    console.error('[PATCH /api/student-projects/settings]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
