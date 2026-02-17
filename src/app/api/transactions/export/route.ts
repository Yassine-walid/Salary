import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(){
  const userId=(await auth())?.user?.id; if(!userId) return new Response('Unauthorized',{status:401});
  const tx=await prisma.transaction.findMany({where:{userId},include:{category:true}});
  const header='date,amount,type,category,notes\n';
  const rows=tx.map(t=>`${t.date.toISOString().slice(0,10)},${t.amount},${t.type},${t.category?.name ?? ''},"${(t.notes ?? '').replace(/"/g,'""')}"`).join('\n');
  return new Response(header+rows,{headers:{'Content-Type':'text/csv','Content-Disposition':'attachment; filename=transactions.csv'}});
}
