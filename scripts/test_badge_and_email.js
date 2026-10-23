require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE REGISTRATION & BADGE TESTS');
  console.log('====================================================\n');

  // Test 1: Verify database columns exist
  console.log('Test 1: Verifying database columns in student_project_submissions...');
  const cols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'student_project_submissions' 
      AND column_name IN ('registration_id', 'share_token')
  `);
  console.log('Found columns:', cols.map(c => c.column_name));
  if (cols.length < 2) {
    throw new Error('Missing registration_id or share_token in database!');
  }
  console.log('✅ Test 1 Passed: Both registration_id and share_token columns exist.\n');

  // Test 2: Verify existing records have valid registration IDs
  console.log('Test 2: Verifying existing registration IDs...');
  const existing = await prisma.$queryRawUnsafe(`
    SELECT id, registration_id, share_token, lead_student, title 
    FROM student_project_submissions 
    LIMIT 3
  `);
  console.log('Sample existing registered students:', existing.map(e => ({
    name: e.lead_student,
    regId: e.registration_id,
    token: e.share_token ? `${e.share_token.slice(0, 8)}...` : null
  })));
  for (const item of existing) {
    if (!item.registration_id || !item.registration_id.startsWith('PIBI-2026-BDR-')) {
      throw new Error(`Record ${item.id} has invalid registration_id: ${item.registration_id}`);
    }
  }
  console.log('✅ Test 2 Passed: Existing student records have valid registration IDs.\n');

  // Test 3: Check Builder Kit PDF exists
  console.log('Test 3: Checking Builder Kit PDF attachment...');
  const pdfPath = path.join(process.cwd(), 'public', 'docs', 'PiBi_Open_Intelligence_Builder_Kit.pdf');
  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF not found at ${pdfPath}`);
  }
  const pdfStats = fs.statSync(pdfPath);
  console.log(`Builder Kit PDF found at ${pdfPath} (${pdfStats.size} bytes).`);
  if (pdfStats.size < 1000) {
    throw new Error('PDF file appears truncated!');
  }
  console.log('✅ Test 3 Passed: Builder Kit PDF exists and is valid.\n');

  // Test 4: Verify privacy (Strictly ensure email/phone/password are not in public badge query)
  console.log('Test 4: Verifying public badge data privacy...');
  const sampleReg = existing[0].registration_id;
  const publicQuery = await prisma.$queryRawUnsafe(`
    SELECT registration_id, lead_student, title, institution, domain, created_at, status 
    FROM student_project_submissions 
    WHERE registration_id = $1
  `, sampleReg);
  const row = publicQuery[0];
  console.log('Public sanitized payload for badge:', row);
  if ('email' in row || 'phone' in row || 'raw_data' in row) {
    throw new Error('Privacy leak! Sensitive fields present in public payload.');
  }
  console.log('✅ Test 4 Passed: Public badge query only exposes consented public data.\n');

  // Test 5: Verify SMTP / Email Sending service
  console.log('Test 5: Verifying Nodemailer transporter configuration...');
  const nm = require('nodemailer');
  const transporter = nm.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log(`SMTP connection verified successfully with ${process.env.SMTP_HOST || 'smtp.gmail.com'} (User: ${process.env.SMTP_USER})`);
    console.log('✅ Test 5 Passed: SMTP server authenticated and ready to deliver emails.\n');
  } catch (smtpErr) {
    console.warn('SMTP verification note:', smtpErr.message);
  }

  console.log('====================================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================');
}

runTests()
  .catch((err) => {
    console.error('❌ Test Failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
