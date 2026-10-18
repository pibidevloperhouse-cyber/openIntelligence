const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const submissions = await prisma.$queryRawUnsafe("SELECT id, title, lead_student, status, video_url, demo_url, github_url FROM student_project_submissions");
  console.log('Submissions in DB:', JSON.stringify(submissions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
