import { PrismaClient } from './src/generated/client';

async function test() {
  const url = 'postgresql://AgriLogistic:AgriLogistic_secure_2026@localhost:5435/AgriLogistic';
  console.log('Testing connection to:', url);
  const prisma = new PrismaClient({
    datasourceUrl: url
  } as any);

  try {
    await prisma.$connect();
    console.log('✅ Connection successful!');
    const users = await (prisma as any).user.findMany({ take: 1 });
    console.log('Found users:', users.length);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
