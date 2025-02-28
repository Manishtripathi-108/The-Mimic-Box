import NextAuth from 'next-auth';
import authConfig from './auth.config';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ account, user }) {
            console.log('linkAccount', account, user);
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            });
        },
    },
    callbacks: {
        async jwt({ token }) {
            return token;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
});
