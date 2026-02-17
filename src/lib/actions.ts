'use server';
import { prisma } from './prisma';
import { auth } from './auth';
import { Frequency, TransactionType, RecurringKind, RecurringStatus } from '@prisma/client';
import { z } from 'zod';
import { hashSync } from 'bcryptjs';
import { nextDate, budgetProgress } from './finance';

const txSchema = z.object({ type: z.enum(['income','expense']), amount: z.coerce.number().positive(), date: z.string(), categoryId: z.string().optional(), notes: z.string().optional() });

export async function registerUser(email: string, password: string) {
  await prisma.user.create({ data: { email, passwordHash: hashSync(password, 10) } });
}

export async function createTransaction(formData: FormData) {
  const session = await auth(); if (!session?.user?.id) throw new Error('Unauthorized');
  const parsed = txSchema.parse(Object.fromEntries(formData.entries()));
  await prisma.transaction.create({ data: { ...parsed, date: new Date(parsed.date), userId: session.user.id, type: parsed.type as TransactionType } });
}

export async function deleteTransaction(id: string) {
  const session = await auth(); if (!session?.user?.id) throw new Error('Unauthorized');
  await prisma.transaction.delete({ where: { id, userId: session.user.id } as any });
}

export async function generateRecurring(userId: string) {
  const now = new Date(); const horizon = new Date(now); horizon.setDate(horizon.getDate() + 60);
  const rules = await prisma.recurringRule.findMany({ where: { userId, status: RecurringStatus.active, nextRunDate: { lte: horizon } } });
  for (const rule of rules) {
    let cursor = rule.nextRunDate;
    while (cursor <= horizon) {
      if (rule.kind === RecurringKind.salary) {
        const s = await prisma.salarySource.findUnique({ where: { id: rule.referenceId } });
        if (s) await prisma.transaction.create({ data: { userId, type: TransactionType.income, amount: s.amount, date: cursor, salarySourceId: s.id, notes: `Recurring salary: ${s.title}` } });
      }
      cursor = nextDate(cursor, rule.frequency as Frequency);
    }
    await prisma.recurringRule.update({ where: { id: rule.id }, data: { nextRunDate: cursor } });
  }
}

export async function createBudgetAlert(userId: string, categoryId: string, month: string) {
  const budget = await prisma.budget.findUnique({ where: { userId_categoryId_month: { userId, categoryId, month } } });
  if (!budget) return;
  const [start, end] = [new Date(`${month}-01`), new Date(`${month}-31`)];
  const spent = await prisma.transaction.aggregate({ where: { userId, categoryId, type: TransactionType.expense, date: { gte: start, lte: end } }, _sum: { amount: true } });
  const state = budgetProgress(budget.amount, spent._sum.amount ?? 0, budget.alertThreshold);
  if (state.thresholdExceeded) await prisma.notification.create({ data: { userId, type: 'budget', message: `Budget threshold reached for ${month}` } });
}
