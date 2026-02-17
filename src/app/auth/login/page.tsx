import { signIn } from '@/lib/auth';
export default function Login(){
  async function login(formData: FormData){'use server'; await signIn('credentials',{ email: formData.get('email'), password: formData.get('password'), redirectTo: '/app' });}
  return <form action={login} className='max-w-md mx-auto p-6 space-y-3'><h1 className='text-2xl font-bold'>Login</h1><input aria-label='Email' name='email' type='email' required className='w-full p-3 border rounded'/><input aria-label='Password' name='password' type='password' required className='w-full p-3 border rounded'/><button className='w-full p-3 bg-blue-600 text-white rounded'>Login</button></form>
}
