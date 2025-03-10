import NextAuth from 'next-auth';
import authConfig from './auth.config';

import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/auth/login',
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
        async signIn({ user, account }) {
            console.log('signIn', user.name);

            if (account?.provider === 'credentials' && !user?.emailVerified) return false;

            return true;
        },
        async jwt({ token }) {
            const linkedAccounts = await db.linkedAccount.findMany({
                where: { userId: token.sub },
            });

            token.linkedAccounts = {};
            linkedAccounts.forEach((account) => {
                token.linkedAccounts![account.provider] = {
                    id: account.providerAccountId,
                    imageUrl: account.imageUrl ?? undefined,
                    bannerUrl: account.bannerUrl ?? undefined,
                    displayName: account.displayName ?? undefined,
                    username: account.username ?? undefined,
                    tokenType: account.token_type ?? 'Bearer',
                    accessToken: account.access_token ?? '',
                    refreshToken: account.refresh_token ?? '',
                    expiresAt: account.expires_at ?? 0,
                };
            });

            return token;
        },
        async session({ token, session }) {
            console.log('🌟 Session called 🌟');

            if (session.user) {
                session.user.id = token.sub as string;
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
