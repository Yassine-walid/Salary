import { ReactNode } from 'react';
import { Nav } from '@/components/Nav';
import { auth, signOut } from '@/lib/auth';
import { generateRecurring } from '@/lib/actions';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (session?.user?.id) await generateRecurring(session.user.id);
  return <div className='pb-20 md:pb-0'><Nav /><header className='p-3 bg-white border-b flex justify-between'><span className='font-semibold'>{session?.user?.email}</span><form action={async ()=>{'use server'; await signOut({redirectTo:'/'});}}><button className='px-3 py-2 border rounded'>Logout</button></form></header><main className='max-w-5xl mx-auto p-4'>{children}</main></div>;
}
