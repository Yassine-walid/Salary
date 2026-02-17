import { PrismaClient, Frequency, TransactionType } from '@prisma/client';
import { hashSync } from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@salary.app' },
    update: {},
    create: { email: 'demo@salary.app', passwordHash: hashSync('demo1234', 10), currency: 'MAD' }
  });
  const defaults = ['Rent','Food','Transport','Bills','Shopping','Health','Education','Entertainment','Subscriptions','Savings','Other'];
  for (const name of defaults) {
    await prisma.category.upsert({ where: { userId_name: { userId: user.id, name } }, update: {}, create: { userId: user.id, name } });
  }
  const salary = await prisma.salarySource.create({ data: { userId: user.id, title: 'Main Job', amount: 12000, frequency: Frequency.monthly, paydayRule: 1, startDate: new Date('2026-01-01') } });
  const food = await prisma.category.findFirstOrThrow({ where: { userId: user.id, name: 'Food' }});
  await prisma.transaction.createMany({ data: [
    { userId: user.id, type: TransactionType.income, amount: 12000, date: new Date(), categoryId: null, salarySourceId: salary.id },
    { userId: user.id, type: TransactionType.expense, amount: 230, date: new Date(), categoryId: food.id, notes: 'Groceries' }
  ]});
}
main().finally(() => prisma.$disconnect());
