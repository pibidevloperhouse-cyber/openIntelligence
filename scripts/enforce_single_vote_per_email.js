const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('1. Checking existing project_votes...');
  const votes = await prisma.$queryRawUnsafe(`
    SELECT id, project_id, voter_name, voter_email, created_at
    FROM project_votes
    ORDER BY created_at ASC
  `);
  console.log('Total votes recorded currently:', votes.length);
  console.log('Votes:', votes);

  // If there are duplicate emails across projects, keep only the earliest vote
  const seen = new Set();
  const toDelete = [];
  for (const v of votes) {
    const email = (v.voter_email || '').toLowerCase().trim();
    if (seen.has(email)) {
      toDelete.push(v.id);
    } else {
      seen.add(email);
    }
  }

  if (toDelete.length > 0) {
    console.log('Removing duplicate votes for same email:', toDelete);
    await prisma.$executeRawUnsafe(`
      DELETE FROM project_votes WHERE id::text IN (${toDelete.map(id => `'${id}'`).join(',')})
    `);
  }

  console.log('2. Creating strict UNIQUE index on LOWER(voter_email) on project_votes...');
  // Drop any old non-unique or composite index if needed
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_votes_email 
    ON project_votes (LOWER(voter_email))
  `);

  console.log('3. Recalculating votes_count on student_project_submissions to ensure complete consistency...');
  await prisma.$executeRawUnsafe(`
    UPDATE student_project_submissions
    SET votes_count = (
      SELECT COUNT(*) FROM project_votes WHERE project_votes.project_id = student_project_submissions.id
    )
  `);

  console.log('Done! 1 vote per email strictly enforced at database level.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
