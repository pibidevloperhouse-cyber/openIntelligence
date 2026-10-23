require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding security_pin column to student_project_submissions...');
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE student_project_submissions 
      ADD COLUMN IF NOT EXISTS security_pin TEXT;
    `);
    console.log('Column security_pin created (if not exists)');
  } catch (err) {
    console.error('Error adding security_pin:', err.message);
  }

  // Backfill existing rows with random 4-digit PIN if null
  const rows = await prisma.$queryRawUnsafe(`
    SELECT id, registration_id, lead_student, security_pin 
    FROM student_project_submissions
  `);

  console.log(`Checking ${rows.length} rows for security_pin...`);
  for (const row of rows) {
    if (!row.security_pin) {
      // Generate a 4-digit PIN
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      await prisma.$executeRawUnsafe(`
        UPDATE student_project_submissions 
        SET security_pin = $1 
        WHERE id = $2::uuid
      `, pin, row.id);
      console.log(`Assigned PIN ${pin} to ${row.lead_student} (${row.registration_id})`);
    } else {
      console.log(`Row ${row.registration_id} already has PIN: ${row.security_pin}`);
    }
  }

  console.log('Migration completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
