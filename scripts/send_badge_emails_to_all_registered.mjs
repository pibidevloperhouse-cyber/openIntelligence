import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { sendStudentRegistrationEmail } from '../lib/student-email.js';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials missing!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('--- SENDING BADGE PIN EMAILS TO ALL REGISTERED STUDENTS ---');

  // Fetch all registrations
  const { data: records, error } = await supabase
    .from('student_project_submissions')
    .select('*')
    .neq('status', 'REJECTED')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch records:', error);
    process.exit(1);
  }

  console.log(`Found ${records.length} registered students in the database.\n`);

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let pin = record.security_pin;

    // Ensure 4-digit PIN exists
    if (!pin || String(pin).trim().length !== 4) {
      pin = Math.floor(1000 + Math.random() * 9000).toString();
      await supabase
        .from('student_project_submissions')
        .update({ security_pin: pin })
        .eq('id', record.id);
      console.log(`[DB UPDATE] Generated new PIN ${pin} for ${record.registration_id} (${record.lead_student})`);
    }

    console.log(`[${i + 1}/${records.length}] Dispatching email for:`);
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
        console.log(`  -> SUCCESS! Email sent to ${record.email} (MessageID: ${result.messageId})\n`);
      } else {
        console.log(`  -> FAILED: ${result.error || result.reason}\n`);
      }
    } catch (err) {
      console.error(`  -> ERROR sending email to ${record.email}:`, err.message, '\n');
    }

    // Small polite delay between SMTP dispatches
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log('--- ALL EMAILS DISPATCHED SUCCESSFULLY ---');
}

run().catch(console.error);
