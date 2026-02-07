import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing data
  await prisma.transaction.deleteMany();
  await prisma.loanRepayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.creditScore.deleteMany();
  await prisma.farmer.deleteMany();

  console.log('🧹 Cleaned database');

  // 2. Create Farmers
  const farmers = [
    {
      id: uuidv4(),
      userId: 'user-001',
      name: 'Moussa Diop',
      email: 'moussa.diop@example.com',
      phone: '+221770000001',
      location: 'Dakar',
      farmSize: 15.5,
      cropTypes: ['mango', 'onions'],
      yearsExperience: 12,
    },
    {
      id: uuidv4(),
      userId: 'user-002',
      name: 'Fatou Sow',
      email: 'fatou.sow@example.com',
      phone: '+221770000002',
      location: 'Thiès',
      farmSize: 5.0,
      cropTypes: ['rice'],
      yearsExperience: 5,
    },
    {
      id: uuidv4(),
      userId: 'user-003',
      name: 'Jean Fall',
      email: 'jean.fall@example.com',
      phone: '+221770000003',
      location: 'Saint-Louis',
      farmSize: 25.0,
      cropTypes: ['tomatoes', 'rice', 'corn'],
      yearsExperience: 20,
    },
  ];

  for (const farmer of farmers) {
    await prisma.farmer.create({ data: farmer });
    console.log(`👨‍🌾 Created farmer: ${farmer.name}`);

    // 3. Create Transactions for each farmer
    const txCount = Math.floor(Math.random() * 20) + 5; // 5-25 transactions
    
    for (let i = 0; i < txCount; i++) {
        const type = Math.random() > 0.3 ? 'sale' : 'purchase';
        const amount = Math.floor(Math.random() * 500000) + 10000;
        
        await prisma.transaction.create({
            data: {
                farmerId: farmer.id,
                type,
                amount: amount,
                status: 'completed',
                description: `${type === 'sale' ? 'Vente récolte' : 'Achat intrants'} #${i+1}`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000))
            }
        });
    }
    console.log(`   💸 Created ${txCount} transactions`);

    // 4. Create Previous Loans (if experienced)
    if (farmer.yearsExperience > 8) {
        const loan = await prisma.loan.create({
            data: {
                farmerId: farmer.id,
                amount: 1500000,
                interestRate: 12.5,
                duration: 12,
                purpose: 'equipment',
                status: 'completed',
                monthlyPayment: 135000,
                totalRepaid: 1620000,
                remainingBalance: 0,
                appliedAt: new Date('2024-01-15'),
                approvedAt: new Date('2024-01-20'),
                disbursedAt: new Date('2024-01-21'),
                completedAt: new Date('2025-01-21'),
            }
        });
        console.log(`   💰 Created completed loan`);
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
