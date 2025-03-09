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

        async jwt({ token, account, user }) {
            console.log('jwtUser', account, user);

            const linkedAccounts = await db.linkedAccount.findMany({
                where: {
                    userId: token.sub,
                },
            });

            console.log('linkedAccounts', linkedAccounts);

            return token;
        },

        async session({ token, session }) {
            console.log('session', token);

            if (session.user) {
                session.user.id = token.sub as string;
                session.user.spotifyAccessToken = token.spotifyAccessToken;
                session.user.spotifyRefreshToken = token.spotifyRefreshToken;
                session.user.spotifyExpiresAt = token.spotifyExpiresAt ?? Date.now();
            }
            return session;
        },
    },

    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
});
