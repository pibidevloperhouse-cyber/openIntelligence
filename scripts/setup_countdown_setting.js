const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding student_countdown_deadline...');
  await prisma.$executeRawUnsafe(`
    INSERT INTO app_settings (key, value)
    VALUES ('student_countdown_deadline', '"2026-11-14T23:59:59+05:30"'::jsonb)
    ON CONFLICT (key) DO NOTHING
  `);

  const rows = await prisma.$queryRawUnsafe('SELECT * FROM app_settings');
  console.log('Current app_settings:', rows);
}

main().catch(console.error).finally(() => prisma.$disconnect());
