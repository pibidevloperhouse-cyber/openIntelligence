const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe("ALTER TABLE student_project_submissions ADD COLUMN IF NOT EXISTS city text;");
    await prisma.$executeRawUnsafe("ALTER TABLE student_project_submissions ADD COLUMN IF NOT EXISTS state text;");
    console.log("Successfully added city and state columns to student_project_submissions");
  } catch (e) {
    console.error("Migration error:", e.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
