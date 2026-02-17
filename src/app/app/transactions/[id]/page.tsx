import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function TransactionDetail({ params }: { params: { id: string } }) {
  const userId=(await auth())!.user!.id;
  const tx = await prisma.transaction.findFirstOrThrow({ where: { id: params.id, userId } });
  async function updateTx(formData: FormData){'use server'; await prisma.transaction.update({ where:{id:params.id}, data:{ amount:Number(formData.get('amount')), notes:String(formData.get('notes')??'') }}); redirect('/app/transactions'); }
  async function deleteTx(){'use server'; await prisma.transaction.delete({ where:{id:params.id}}); redirect('/app/transactions'); }
  return <div className='space-y-3'><h1 className='text-xl font-bold'>Edit transaction</h1><form action={updateTx} className='space-y-2 max-w-md'><input name='amount' defaultValue={tx.amount} type='number' step='0.01' className='w-full p-3 border rounded'/><textarea name='notes' defaultValue={tx.notes ?? ''} className='w-full p-3 border rounded'/><button className='w-full p-3 bg-blue-600 text-white rounded'>Save</button></form><form action={deleteTx}><button className='p-2 border rounded'>Delete</button></form></div>;
}
