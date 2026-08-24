import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$executeRawUnsafe(`NOTIFY pgrst, 'reload schema'`)
    console.log('Successfully reloaded Supabase PostgREST schema cache.')
  } catch (err) {
    console.error('Error reloading schema:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
