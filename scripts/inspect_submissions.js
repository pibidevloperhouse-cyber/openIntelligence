const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe("ALTER TABLE student_project_submissions ALTER COLUMN demo_url DROP NOT NULL;");
    console.log("Successfully dropped NOT NULL from demo_url");
  } catch (e) {
    console.log("Note on alter table:", e.message);
  }
  await prisma.$executeRawUnsafe("UPDATE student_project_submissions SET demo_url = NULL WHERE demo_url = presentation_url OR demo_url = 'https://pibiopenintelligence.org'");
  const submissions = await prisma.$queryRawUnsafe("SELECT id, title, lead_student, status, presentation_url, video_url, demo_url, github_url FROM student_project_submissions");
  console.log('Cleaned submissions in DB:', JSON.stringify(submissions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
