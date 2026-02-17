import Link from 'next/link';
const items=[['/app','Home'],['/app/transactions','Transactions'],['/app/budgets','Budgets'],['/app/reports','Reports'],['/app/settings','Settings']];
export function Nav(){
  return <>
    <nav className='hidden md:flex gap-3 p-3 bg-white border-b'>{items.map(([href,label])=><Link key={href} href={href} className='px-3 py-2 rounded bg-slate-100'>{label}</Link>)}</nav>
    <nav className='fixed md:hidden bottom-0 left-0 right-0 bg-white border-t grid grid-cols-5 text-xs'>{items.map(([href,label])=><Link key={href} href={href} className='p-3 text-center'>{label}</Link>)}</nav>
  </>
}
