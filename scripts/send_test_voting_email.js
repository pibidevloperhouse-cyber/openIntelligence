import dotenv from 'dotenv';
import { sendVotingAnnouncementEmail } from '../lib/voting-announcement-email.js';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function main() {
  console.log('Sending test voting announcement email to ssvnklvignesh@gmail.com...');

  // Try to pick a real sample project from database if available
  let sampleData = {
    toEmail: 'ssvnklvignesh@gmail.com',
    studentName: 'Vignesh K.S (Team Lead)',
    projectTitle: 'AI Multi-Agent Automated Code & Security Reviewer',
    institution: 'College of Engineering & Technology',
    registrationId: 'PIBI-2026-BDR-8842',
    projectId: null,
  };

  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data } = await supabase
      .from('student_project_submissions')
      .select('id, lead_student, title, institution, registration_id')
      .limit(1)
      .maybeSingle();

    if (data) {
      console.log('Using real database sample project for realistic token/link:', data.title);
      sampleData.projectId = data.id;
      sampleData.projectTitle = data.title;
      sampleData.institution = data.institution;
      sampleData.registrationId = data.registration_id;
    }
  } catch (err) {
    console.log('Using fallback sample data:', err.message);
  }

  const result = await sendVotingAnnouncementEmail(sampleData);

  if (result.success) {
    console.log('====================================================');
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY TO ssvnklvignesh@gmail.com!');
    console.log('Message ID:', result.messageId);
    console.log('Generated Voting Link:', result.voteUrl);
    console.log('====================================================');
  } else {
    console.error('❌ FAILED TO SEND EMAIL:', result.error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
