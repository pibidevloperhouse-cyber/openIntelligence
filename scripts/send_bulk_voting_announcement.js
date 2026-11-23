import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { sendVotingAnnouncementEmail } from '../lib/voting-announcement-email.js';
import { cleanRecipientEmail } from '../lib/student-email.js';

dotenv.config();

const isDryRun = process.argv.includes('--dry-run');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('====================================================');
  console.log(`🚀 PiBi Open Intelligence – Bulk Voting Email Dispatcher`);
  console.log(`Mode: ${isDryRun ? '🔍 DRY RUN (Preview only, no emails will be sent)' : '📤 LIVE SENDING'}`);
  console.log('====================================================\n');

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Fetch all registered student projects
  const { data: students, error } = await supabase
    .from('student_project_submissions')
    .select('id, lead_student, email, title, institution, registration_id, status')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }

  // Validate email for all 47 project submissions
  const validStudents = [];

  for (const s of students || []) {
    const cleaned = cleanRecipientEmail(s.email);
    if (!cleaned) {
      console.warn(`⚠️ Skipping project "${s.title}" due to invalid email: ${s.email}`);
      continue;
    }

    validStudents.push({
      ...s,
      cleanEmail: cleaned,
    });
  }

  console.log(`Found ${students?.length || 0} total submissions.`);
  console.log(`Prepared ${validStudents.length} project submissions for dispatch.\n`);

  if (validStudents.length === 0) {
    console.log('No recipients found to email.');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < validStudents.length; i++) {
    const student = validStudents[i];
    const indexStr = `[${i + 1}/${validStudents.length}]`;

    console.log(`${indexStr} Processing: ${student.lead_student} <${student.cleanEmail}>`);
    console.log(`     Project: "${student.title}" (${student.institution})`);

    if (isDryRun) {
      console.log(`     👉 [DRY RUN] Would send personalized email with voting link.\n`);
      successCount++;
      continue;
    }

    try {
      const result = await sendVotingAnnouncementEmail({
        toEmail: student.cleanEmail,
        studentName: student.lead_student,
        projectTitle: student.title,
        institution: student.institution,
        registrationId: student.registration_id,
        projectId: student.id,
      });

      if (result.success) {
        console.log(`     ✅ Sent! Voting Link: ${result.voteUrl}\n`);
        successCount++;
      } else {
        console.error(`     ❌ Failed: ${result.error}\n`);
        failCount++;
      }

      // 1.5 second throttle to avoid Gmail SMTP rate limit
      await sleep(1500);
    } catch (err) {
      console.error(`     ❌ Error sending:`, err.message, '\n');
      failCount++;
    }
  }

  console.log('====================================================');
  console.log(`📊 DISPATCH SUMMARY:`);
  console.log(`   Total Processed: ${validStudents.length}`);
  console.log(`   Successful:      ${successCount}`);
  console.log(`   Failed:          ${failCount}`);
  console.log('====================================================');
}

main().catch(err => {
  console.error('Fatal dispatch error:', err);
  process.exit(1);
});
