import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { CashflowChart } from '@/components/Charts';

export default async function Dashboard(){
  const userId = (await auth())!.user!.id;
  const start = startOfMonth(new Date()); const end = endOfMonth(new Date());
  const tx = await prisma.transaction.findMany({ where: { userId, date: { gte: start, lte: end } }, orderBy: { date: 'asc' } });
  const income = tx.filter(t=>t.type==='income').reduce((a,b)=>a+b.amount,0);
  const expenses = tx.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0);
  const grouped = tx.reduce((acc,t)=>{ const day = format(t.date,'MM-dd'); acc[day] ??= { day, income:0, expense:0}; acc[day][t.type]+=t.amount; return acc;},{} as Record<string, any>);
  return <div className='space-y-4'><h1 className='text-2xl font-bold'>Dashboard</h1><div className='grid grid-cols-3 gap-3 text-center'><div className='bg-white p-3 rounded border'>Income {income.toFixed(2)}</div><div className='bg-white p-3 rounded border'>Expenses {expenses.toFixed(2)}</div><div className='bg-white p-3 rounded border'>Net {(income-expenses).toFixed(2)}</div></div><CashflowChart data={Object.values(grouped)}/></div>;
}
