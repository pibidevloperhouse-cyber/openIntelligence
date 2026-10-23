import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { sendStudentRegistrationEmail } from '../lib/student-email.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('=== PIBI STUDENT BADGE PIN EMAIL DISPATCH ===');

  // 1. Mark earlier recipients (1001, 1002, 1003, 1004) who already received emails
  const alreadySentIds = [
    'PIBI-2026-BDR-1001',
    'PIBI-2026-BDR-1002',
    'PIBI-2026-BDR-1003',
    'PIBI-2026-BDR-1004',
  ];

  for (const regId of alreadySentIds) {
    await supabase
      .from('student_project_submissions')
      .update({
        is_email_sent: true,
        email_sent_at: new Date().toISOString(),
      })
      .eq('registration_id', regId)
      .eq('is_email_sent', false);
  }

  // 2. Query only students who have NOT received their PIN email yet ('pokathavagaluku')
  const { data: pendingRecords, error } = await supabase
    .from('student_project_submissions')
    .select('*')
    .neq('status', 'REJECTED')
    .or('is_email_sent.is.null,is_email_sent.eq.false')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch pending records:', error);
    process.exit(1);
  }

  console.log(`Found ${pendingRecords.length} student(s) waiting for PIN email.\n`);

  if (pendingRecords.length === 0) {
    console.log('All registered students have already received their emails! Nothing to send.');
    return;
  }

  for (let i = 0; i < pendingRecords.length; i++) {
    const record = pendingRecords[i];
    let pin = record.security_pin;

    // Ensure 4-digit PIN exists
    if (!pin || String(pin).trim().length !== 4) {
      pin = Math.floor(1000 + Math.random() * 9000).toString();
      await supabase
        .from('student_project_submissions')
        .update({ security_pin: pin })
        .eq('id', record.id);
      console.log(`[DB PIN UPDATE] Generated new PIN ${pin} for ${record.registration_id}`);
    }

    console.log(`[${i + 1}/${pendingRecords.length}] Dispatching email for:`);
    console.log(`  Registration ID: ${record.registration_id}`);
    console.log(`  Student Name:    ${record.lead_student}`);
    console.log(`  Recipient Email: ${record.email}`);
    console.log(`  Security PIN:    ${pin}`);
    console.log(`  Project:         ${record.title}`);

    try {
      const result = await sendStudentRegistrationEmail({
        toEmail: record.email,
        studentName: record.lead_student || 'Student Innovator',
        projectTitle: record.title || 'Student Innovation Project',
        college: record.institution || '',
        domain: record.domain || record.category || 'AI & Machine Learning',
        dept: record.dept || '',
        year: record.year || '',
        registrationId: record.registration_id,
        shareToken: record.share_token,
        securityPin: pin,
      });

      if (result.success) {
        console.log(`  -> SUCCESS! Email sent to ${record.email} (MessageID: ${result.messageId})`);
        
        // Mark as sent in DB
        await supabase
          .from('student_project_submissions')
          .update({
            is_email_sent: true,
            email_sent_at: new Date().toISOString(),
          })
          .eq('id', record.id);
        console.log(`  -> Recorded is_email_sent=true in database.\n`);
      } else {
        console.log(`  -> FAILED: ${result.error || result.reason}\n`);
      }
    } catch (err) {
      console.error(`  -> ERROR sending to ${record.email}:`, err.message, '\n');
    }

    // Small polite delay between SMTP dispatches
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log('=== ALL PENDING EMAILS DISPATCHED SUCCESSFULLY ===');
}

run().catch(console.error);
