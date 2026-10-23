import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET /api/student-projects/badge/[id]
// Safely returns public badge details by registration_id, share_token, or ID.
// STRICT PRIVACY: Never returns email, phone, passwords, or confidential fields.
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid Registration ID or Share Token required' }, { status: 400 });
    }

    const trimmedId = id.trim();

    // Query by registration_id, share_token, or id
    let query = supabaseAdmin
      .from('student_project_submissions')
      .select(`
        id,
        registration_id,
        share_token,
        lead_student,
        title,
        institution,
        dept,
        year,
        domain,
        category,
        team_members,
        status,
        created_at
      `);

    if (trimmedId.toUpperCase().startsWith('PIBI-')) {
      query = query.ilike('registration_id', trimmedId);
    } else if (trimmedId.length === 24 || trimmedId.length === 32) {
      query = query.eq('share_token', trimmedId);
    } else if (trimmedId.includes('-')) {
      // Could be UUID
      query = query.eq('id', trimmedId);
    } else {
      query = query.ilike('registration_id', trimmedId);
    }

    const { data: record, error } = await query.maybeSingle();

    if (error) {
      console.error('[GET /api/student-projects/badge/[id] error]', error);
      return NextResponse.json({ error: 'Failed to retrieve badge record' }, { status: 500 });
    }

    if (!record || record.status === 'REJECTED') {
      return NextResponse.json({ error: 'Registration badge record not found' }, { status: 404 });
    }

    const safeBadgeData = {
      registrationId: record.registration_id || 'PIBI-2026-BDR-CONFIRMED',
      shareToken: record.share_token || null,
      studentName: record.lead_student || 'Student Innovator',
      projectTitle: record.title || 'AI/ML Project',
      institution: record.institution || 'Engineering College',
      dept: record.dept || '',
      year: record.year || '',
      domain: record.domain || record.category || 'AI & Machine Learning',
      teamMembers: Array.isArray(record.team_members) ? record.team_members : [],
      status: 'Registration Confirmed',
      createdAt: record.created_at,
      verified: true,
      disclaimer: 'This badge confirms registration only. It does not represent project evaluation, finalist selection, or an award.',
    };

    return NextResponse.json({ success: true, badge: safeBadgeData });
  } catch (err) {
    console.error('[GET /api/student-projects/badge/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
