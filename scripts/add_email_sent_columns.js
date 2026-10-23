require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding email tracking columns to student_project_submissions...');
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE student_project_submissions 
      ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS is_email_sent BOOLEAN DEFAULT FALSE;
    `);
    console.log('Columns email_sent_at and is_email_sent added successfully!');
  } catch (err) {
    console.error('Error adding columns:', err.message);
  }

  const rows = await prisma.$queryRawUnsafe(`
    SELECT id, registration_id, lead_student, email, security_pin, is_email_sent, email_sent_at 
    FROM student_project_submissions 
    ORDER BY created_at DESC
  `);

  console.log('Found rows:', rows);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
