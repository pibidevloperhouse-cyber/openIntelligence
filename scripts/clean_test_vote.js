const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function clean() {
  await prisma.$executeRawUnsafe("DELETE FROM project_votes WHERE voter_email = 'testvoter_check@example.com'");
  await prisma.$executeRawUnsafe("UPDATE student_project_submissions SET votes_count = votes_count - 1 WHERE title = 'NeuroPulse AI'");
  console.log('Cleaned test vote');
}
clean().catch(console.error).finally(() => prisma.$disconnect());
