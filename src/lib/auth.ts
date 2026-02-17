import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { compareSync } from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [Credentials({
    credentials: { email: {}, password: {} },
    authorize: async (credentials) => {
      const email = String(credentials.email);
      const password = String(credentials.password);
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !compareSync(password, user.passwordHash)) return null;
      return { id: user.id, email: user.email };
    }
  })],
  pages: { signIn: '/auth/login' },
  callbacks: {
    async jwt({ token, user }) { if (user) token.sub = user.id; return token; },
    async session({ session, token }) { if (session.user) session.user.id = token.sub as string; return session; }
  }
});
