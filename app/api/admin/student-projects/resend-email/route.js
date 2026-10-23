import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendStudentRegistrationEmail } from '@/lib/student-email';
import crypto from 'crypto';

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

// POST /api/admin/student-projects/resend-email
// Admin endpoint to manually send / resend confirmation email with 4-digit PIN
export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Fetch student record
    const { data: record, error: fetchError } = await supabaseAdmin
      .from('student_project_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !record) {
      return NextResponse.json({ error: 'Student registration not found' }, { status: 404 });
    }

    if (!record.email) {
      return NextResponse.json({ error: 'No email address registered for this student' }, { status: 400 });
    }

    // Ensure PIN exists
    let pin = record.security_pin;
    if (!pin) {
      pin = Math.floor(1000 + Math.random() * 9000).toString();
      await supabaseAdmin
        .from('student_project_submissions')
        .update({ security_pin: pin })
        .eq('id', record.id);
    }

    // Ensure registration_id exists
    let regId = record.registration_id;
    if (!regId) {
      regId = `PIBI-2026-BDR-${Math.floor(1000 + Math.random() * 9000)}`;
      await supabaseAdmin
        .from('student_project_submissions')
        .update({ registration_id: regId })
        .eq('id', record.id);
    }

    const shareToken = record.share_token || crypto.randomBytes(16).toString('hex');

    // Send email
    const emailResult = await sendStudentRegistrationEmail({
      toEmail: record.email,
      studentName: record.lead_student || 'Student Innovator',
      projectTitle: record.title || 'Student Innovation Project',
      college: record.institution || '',
      domain: record.domain || record.category || 'AI & Machine Learning',
      dept: record.dept || '',
      year: record.year || '',
      registrationId: regId,
      shareToken: shareToken,
      securityPin: pin,
    });

    if (!emailResult.success) {
      return NextResponse.json({ error: emailResult.error || 'Failed to send email via SMTP' }, { status: 500 });
    }

    // Mark as sent in DB
    const nowIso = new Date().toISOString();
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('student_project_submissions')
      .update({
        is_email_sent: true,
        email_sent_at: nowIso,
        security_pin: pin,
        registration_id: regId,
        share_token: shareToken,
      })
      .eq('id', record.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      project: updated,
      message: `Email successfully sent to ${record.email} with PIN: ${pin}`,
    });
  } catch (err) {
    console.error('[POST /api/admin/student-projects/resend-email]', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
