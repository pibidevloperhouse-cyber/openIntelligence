const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@gmail.com' },
  });

  if (existingAdmin) {
    console.log('Admin already exists.');
    return;
  }

  // Hash the password
  const password_hash = await bcrypt.hash('root123', 10);

  // Create the admin
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@gmail.com',
      password_hash: password_hash,
      name: 'Super Admin',
    },
  });

  console.log('Admin created successfully!', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
