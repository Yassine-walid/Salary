import { registerUser } from '@/lib/actions';
import Link from 'next/link';
export default function Register(){
  async function register(formData: FormData){'use server'; await registerUser(String(formData.get('email')),String(formData.get('password')));}
  return <form action={register} className='max-w-md mx-auto p-6 space-y-3'><h1 className='text-2xl font-bold'>Register</h1><input aria-label='Email' name='email' type='email' required className='w-full p-3 border rounded'/><input aria-label='Password' name='password' type='password' required className='w-full p-3 border rounded'/><button className='w-full p-3 bg-blue-600 text-white rounded'>Create account</button><Link href='/auth/login' className='block text-center underline'>Back to login</Link></form>
}
