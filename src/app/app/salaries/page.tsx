import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Frequency, RecurringKind } from '@prisma/client';

export default async function SalariesPage(){
  const userId=(await auth())!.user!.id;
  const salaries=await prisma.salarySource.findMany({where:{userId}});
  async function add(formData: FormData){'use server'; const salary=await prisma.salarySource.create({data:{userId,title:String(formData.get('title')),amount:Number(formData.get('amount')),frequency:formData.get('frequency') as Frequency,startDate:new Date(String(formData.get('startDate'))),paydayRule:Number(formData.get('paydayRule'))||null}}); await prisma.recurringRule.create({data:{userId,kind:RecurringKind.salary,referenceId:salary.id,frequency:salary.frequency,nextRunDate:salary.startDate}}); }
  return <div className='space-y-3'><h1 className='text-2xl font-bold'>Salary Sources</h1><form action={add} className='grid md:grid-cols-5 gap-2 bg-white border p-3 rounded'><input name='title' placeholder='Title' className='p-2 border rounded' required/><input name='amount' type='number' step='0.01' className='p-2 border rounded' required/><select name='frequency' className='p-2 border rounded'><option value='monthly'>Monthly</option><option value='biweekly'>Biweekly</option><option value='weekly'>Weekly</option><option value='one_time'>One-time</option></select><input name='paydayRule' type='number' placeholder='Day of month' className='p-2 border rounded'/><input name='startDate' type='date' className='p-2 border rounded' required/><button className='p-2 bg-blue-600 text-white rounded md:col-span-5'>Add Salary</button></form><ul>{salaries.map(s=><li key={s.id} className='p-3 bg-white border rounded'>{s.title} - {s.amount}</li>)}</ul></div>
}
