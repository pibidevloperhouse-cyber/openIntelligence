const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  console.log('Running safe migration for student_project_submissions registration columns...');
  
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE student_project_submissions 
      ADD COLUMN IF NOT EXISTS registration_id TEXT;
    `);
    console.log('Added registration_id column (if not exists)');
  } catch (err) {
    console.error('Error adding registration_id:', err.message);
  }

  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE student_project_submissions 
      ADD COLUMN IF NOT EXISTS share_token TEXT;
    `);
    console.log('Added share_token column (if not exists)');
  } catch (err) {
    console.error('Error adding share_token:', err.message);
  }

  // Create unique index on registration_id if not exists
  try {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_student_submissions_registration_id 
      ON student_project_submissions (registration_id) 
      WHERE registration_id IS NOT NULL;
    `);
    console.log('Created index on registration_id');
  } catch (err) {
    console.log('Note on registration_id index:', err.message);
  }

  // Create unique index on share_token if not exists
  try {
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_student_submissions_share_token 
      ON student_project_submissions (share_token) 
      WHERE share_token IS NOT NULL;
    `);
    console.log('Created index on share_token');
  } catch (err) {
    console.log('Note on share_token index:', err.message);
  }

  // Backfill existing rows that have NULL registration_id or share_token
  const rows = await prisma.$queryRawUnsafe(`
    SELECT id, lead_student, title, created_at, registration_id, share_token 
    FROM student_project_submissions 
    ORDER BY created_at ASC
  `);

  console.log(`Found ${rows.length} existing student submissions.`);

  let counter = 1001;
  for (const row of rows) {
    const regId = row.registration_id || `PIBI-2026-BDR-${counter}`;
    const token = row.share_token || crypto.randomBytes(12).toString('hex');
    
    if (!row.registration_id || !row.share_token) {
      await prisma.$executeRawUnsafe(`
        UPDATE student_project_submissions 
        SET registration_id = $1, share_token = $2 
        WHERE id = $3::uuid
      `, regId, token, row.id);
      console.log(`Backfilled ${row.lead_student} -> Registration ID: ${regId}, Token: ${token}`);
    } else {
      console.log(`Row already has registration_id: ${row.registration_id}`);
    }
    counter++;
  }

  console.log('Migration completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
