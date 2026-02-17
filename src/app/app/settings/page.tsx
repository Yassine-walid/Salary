import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parse } from 'csv-parse/sync';

export default async function SettingsPage(){
  const userId=(await auth())!.user!.id;
  const categories=await prisma.category.findMany({where:{userId}});
  async function importCsv(formData: FormData){'use server'; const raw=String(formData.get('csv')); const rows=parse(raw,{columns:true,skip_empty_lines:true}); for (const row of rows){await prisma.transaction.create({data:{userId,type:row.type,amount:Number(row.amount),date:new Date(row.date),notes:row.notes,categoryId:categories.find(c=>c.name===row.category)?.id}});} }
  return <div className='space-y-3'><h1 className='text-2xl font-bold'>Settings</h1><a href='/api/transactions/import-template' className='underline'>Download import template</a><form action={importCsv} className='space-y-2'><label htmlFor='csv' className='block'>Paste CSV here</label><textarea id='csv' name='csv' className='w-full min-h-48 p-3 border rounded' placeholder='date,amount,type,category,notes'/><button className='px-4 py-2 bg-blue-600 text-white rounded'>Import CSV</button></form></div>
}
