const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('1. Adding is_top_10, top_10_rank, and votes_count columns...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE student_project_submissions
    ADD COLUMN IF NOT EXISTS is_top_10 BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS top_10_rank INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS votes_count INT DEFAULT 0
  `);

  console.log('2. Creating project_votes table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS project_votes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES student_project_submissions(id) ON DELETE CASCADE,
      voter_name TEXT NOT NULL,
      voter_email TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  console.log('3. Creating indexes on project_votes...');
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_project_votes_email ON project_votes(voter_email)`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_project_votes_project_id ON project_votes(project_id)`);
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_voter ON project_votes(project_id, voter_email)`);

  console.log('4. Checking columns of student_project_submissions...');
  const cols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name='student_project_submissions' 
    AND column_name IN ('is_top_10', 'top_10_rank', 'votes_count')
  `);
  console.log('New columns verified:', cols);

  console.log('5. Checking project_votes table...');
  const voteCols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name='project_votes'
  `);
  console.log('project_votes columns:', voteCols);
}

main().catch(console.error).finally(() => prisma.$disconnect());
