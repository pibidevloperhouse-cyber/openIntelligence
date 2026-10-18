const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables:', tables.map(x => x.table_name));

  const columns = await prisma.$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='student_project_submissions'");
  console.log('student_project_submissions columns:', columns);
}

main().catch(console.error).finally(() => prisma.$disconnect());
