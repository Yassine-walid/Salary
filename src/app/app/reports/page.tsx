import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CategoryChart } from '@/components/Charts';

export default async function ReportsPage(){
  const userId=(await auth())!.user!.id;
  const tx=await prisma.transaction.findMany({where:{userId},include:{category:true}});
  const byCat: Record<string, number>={}; let income=0,expense=0;
  tx.forEach(t=>{if(t.type==='income') income+=t.amount; else {expense+=t.amount; byCat[t.category?.name ?? 'Other']=(byCat[t.category?.name ?? 'Other'] ?? 0)+t.amount;}});
  const savingsRate = income===0?0:((income-expense)/income)*100;
  return <div className='space-y-4'><h1 className='text-2xl font-bold'>Reports</h1><p>Savings rate: {savingsRate.toFixed(2)}%</p><CategoryChart data={Object.entries(byCat).map(([name,amount])=>({name,amount}))}/></div>
}
