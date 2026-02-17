import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createTransaction } from '@/lib/actions';

export default async function TransactionsPage(){
  const userId=(await auth())!.user!.id;
  const [tx,categories]=await Promise.all([
    prisma.transaction.findMany({ where:{userId}, include:{category:true}, orderBy:{date:'desc'} }),
    prisma.category.findMany({ where:{userId} })
  ]);
  return <div className='space-y-4'><h1 className='text-2xl font-bold'>Transactions</h1>
    <form action={createTransaction} className='grid md:grid-cols-5 gap-2 bg-white border p-3 rounded'>
      <select name='type' className='p-2 border rounded'><option value='expense'>Expense</option><option value='income'>Income</option></select>
      <input name='amount' type='number' step='0.01' placeholder='Amount' required className='p-2 border rounded'/>
      <input name='date' type='date' required className='p-2 border rounded'/>
      <select name='categoryId' className='p-2 border rounded'><option value=''>No category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <button className='p-2 bg-blue-600 text-white rounded'>Add</button>
    </form>
    <a className='underline' href='/api/transactions/export'>Export CSV</a>
    <ul className='space-y-2'>{tx.map(t=><li key={t.id} className='bg-white border rounded p-3 flex justify-between'><div><p className='font-semibold'>{t.type} {t.amount}</p><p className='text-sm'>{t.category?.name ?? 'Uncategorized'}</p></div><Link href={`/app/transactions/${t.id}`} className='underline'>Edit</Link></li>)}</ul>
  </div>;
}
