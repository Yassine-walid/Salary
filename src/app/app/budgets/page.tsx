import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBudgetAlert } from '@/lib/actions';
import { budgetProgress } from '@/lib/finance';

export default async function BudgetsPage(){
  const userId=(await auth())!.user!.id;
  const month = new Date().toISOString().slice(0,7);
  const [categories,budgets]=await Promise.all([prisma.category.findMany({where:{userId}}), prisma.budget.findMany({where:{userId,month},include:{category:true}})]);
  async function add(formData: FormData){'use server'; const categoryId=String(formData.get('categoryId')); await prisma.budget.upsert({where:{userId_categoryId_month:{userId,categoryId,month}}, update:{amount:Number(formData.get('amount')),alertThreshold:Number(formData.get('alertThreshold'))}, create:{userId,categoryId,month,amount:Number(formData.get('amount')),alertThreshold:Number(formData.get('alertThreshold'))}}); await createBudgetAlert(userId, categoryId, month); }
  const rows = await Promise.all(budgets.map(async b=>{const sum=await prisma.transaction.aggregate({where:{userId,categoryId:b.categoryId,type:'expense',date:{gte:new Date(`${month}-01`),lte:new Date(`${month}-31`) }},_sum:{amount:true}}); return {b,spent:sum._sum.amount ?? 0}; }));
  return <div className='space-y-4'><h1 className='text-2xl font-bold'>Budgets ({month})</h1><form action={add} className='grid grid-cols-3 gap-2 bg-white border rounded p-3'><select name='categoryId' className='p-2 border rounded'>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input name='amount' required type='number' className='p-2 border rounded'/><input name='alertThreshold' defaultValue={80} type='number' className='p-2 border rounded'/><button className='col-span-3 p-2 rounded bg-blue-600 text-white'>Save Budget</button></form><ul className='space-y-2'>{rows.map(({b,spent})=>{const p=budgetProgress(b.amount,spent,b.alertThreshold); return <li key={b.id} className='bg-white border rounded p-3'><p>{b.category.name}: {spent}/{b.amount}</p><div className='w-full bg-slate-200 rounded h-3'><div className={`h-3 rounded ${p.overSpent?'bg-red-500':'bg-green-500'}`} style={{width:`${Math.min(100,p.percent)}%`}}/></div>{p.thresholdExceeded && <p className='text-amber-600 text-sm'>Threshold reached</p>}</li>})}</ul></div>
}
