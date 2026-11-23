// purge-test-users.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function purgeTestUsers() {
  try {
    const deleted = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: '@test.com' } },
          { name: { startsWith: 'Test ' } }
        ]
      }
    });
    console.log(`✅ Succès : ${deleted.count} comptes de test supprimés.`);
  } catch (error) {
    console.error('❌ Erreur lors de la purge :', error);
  } finally {
    await prisma.$disconnect();
  }
}
purgeTestUsers();