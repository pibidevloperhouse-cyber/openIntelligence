const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creating app_settings table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  console.log('Inserting default student_registration_closed = false...');
  await prisma.$executeRawUnsafe(`
    INSERT INTO app_settings (key, value)
    VALUES ('student_registration_closed', 'false'::jsonb)
    ON CONFLICT (key) DO NOTHING
  `);

  const row = await prisma.$queryRawUnsafe(`SELECT * FROM app_settings WHERE key = 'student_registration_closed'`);
  console.log('app_settings row:', row);
}

main().catch(console.error).finally(() => prisma.$disconnect());
