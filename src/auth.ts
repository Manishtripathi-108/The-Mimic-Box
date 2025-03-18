import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { getLinkedAccounts } from '@/lib/services/auth.service';

import authConfig from './auth.config';
import { db } from './lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'credentials' && !user?.emailVerified) return false;
            return true;
        },
        async jwt({ token, trigger, session, account }) {
            if (account) {
                token.provider = account.provider;
            }

            if (trigger === 'signIn' || trigger === 'update') {
                const linkedAccounts = await getLinkedAccounts(token.sub);
                token.linkedAccounts = linkedAccounts;
            }

            if (trigger === 'update' && session) {
                token.name = session.user.name;
                token.email = session.user.email;
                token.picture = session.user.image;
            }
            return token;
        },
        async session({ token, session }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.provider = token.provider;
                if (token.linkedAccounts) {
                    session.user.linkedAccounts = token.linkedAccounts;
                }
            }
            return session;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
});
