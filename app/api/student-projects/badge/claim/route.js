import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST /api/student-projects/badge/claim
// Securely verifies the 4-digit security PIN sent to student's email
// and unlocks their official Builder Badge.
export async function POST(request) {
  try {
    const { identifier, pin } = await request.json();

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json(
        { error: 'Registration ID or Email Address is required' },
        { status: 400 }
      );
    }

    if (!pin || String(pin).trim().length === 0) {
      return NextResponse.json(
        { error: '4-Digit Security PIN is required' },
        { status: 400 }
      );
    }

    const trimmedIdentifier = identifier.trim();
    const cleanPin = String(pin).replace(/\D/g, '').trim();

    console.log(`[POST /api/student-projects/badge/claim] Claim request: identifier="${trimmedIdentifier}", pin="${cleanPin}"`);

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
        security_pin,
        created_at
      `)
      .neq('status', 'REJECTED')
      .order('created_at', { ascending: false });

    if (trimmedIdentifier.toUpperCase().startsWith('PIBI-')) {
      query = query.ilike('registration_id', trimmedIdentifier);
    } else if (trimmedIdentifier.includes('@')) {
      query = query.ilike('email', trimmedIdentifier.toLowerCase());
    } else if (/^\d{3,5}$/.test(trimmedIdentifier)) {
      // Just the suffix number entered (e.g. 1715 or 1001)
      query = query.ilike('registration_id', `%${trimmedIdentifier}%`);
    } else {
      query = query.or(`registration_id.ilike.%${trimmedIdentifier}%,share_token.eq.${trimmedIdentifier}`);
    }

    const { data: records, error } = await query;

    if (error) {
      console.error('[POST /api/student-projects/badge/claim error]', error);
      return NextResponse.json({ error: 'Database query error' }, { status: 500 });
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: 'No confirmed registration found for this Registration ID or Email.' },
        { status: 404 }
      );
    }

    // If multiple records exist for this email/identifier, try to match by PIN first
    let record = records.find(
      (r) => String(r.security_pin || '2026').replace(/\D/g, '').trim() === cleanPin
    );

    // If no record directly matches the PIN, pick the most recent one for comparison
    if (!record) {
      record = records[0];
    }

    // Validate PIN
    const expectedPin = String(record.security_pin || '2026').replace(/\D/g, '').trim();
    if (expectedPin !== cleanPin) {
      console.warn(`[POST /api/student-projects/badge/claim] PIN mismatch for ${record.registration_id}: expected="${expectedPin}", entered="${cleanPin}"`);
      return NextResponse.json(
        { 
          error: `Incorrect 4-digit Security PIN for Registration ID ${record.registration_id}. Please check the PIN sent in your confirmation email.` 
        },
        { status: 401 }
      );
    }

    console.log(`[POST /api/student-projects/badge/claim] PIN verified successfully for ${record.registration_id} (${record.lead_student})`);

    // Sanitized public badge data
    const safeBadgeData = {
      registrationId: record.registration_id || 'PIBI-2026-BDR-CONFIRMED',
      shareToken: record.share_token,
      studentName: record.lead_student || 'Student Innovator',
      projectTitle: record.title || 'AI Project',
      institution: record.institution || 'Engineering College',
      dept: record.dept || '',
      year: record.year || '',
      domain: record.domain || record.category || 'AI & Machine Learning',
      teamMembers: Array.isArray(record.team_members) ? record.team_members : [],
      status: 'Registration Confirmed',
      createdAt: record.created_at,
      verified: true,
      unlocked: true,
    };

    return NextResponse.json({
      success: true,
      badge: safeBadgeData,
    });
  } catch (err) {
    console.error('[POST /api/student-projects/badge/claim]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
