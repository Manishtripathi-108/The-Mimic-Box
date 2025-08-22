import { PrismaAdapter } from '@auth/prisma-adapter';
import { LinkedAccountProvider } from '@prisma/client';
import NextAuth from 'next-auth';

import { refreshToken } from '@/actions/linkedAccount.actions';
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
            return !(account?.provider === 'credentials' && !user?.emailVerified);
        },

        async jwt({ token, trigger, session, account }) {
            if (account) token.provider = account.provider;

            if (trigger === 'signIn' || trigger === 'update') {
                token.linkedAccounts = await getLinkedAccounts(token.sub);
            }

            if (trigger === 'update' && session) {
                Object.assign(token, {
                    name: session.user.name,
                    email: session.user.email,
                    picture: session.user.image,
                });
            }

            if (token.linkedAccounts && token.sub) {
                for (const [provider, account] of Object.entries(token.linkedAccounts)) {
                    if (!account) continue;

                    if (account.expiresAt.getTime() < Date.now()) {
                        const tokens = await refreshToken(token.sub!, account.refreshToken, provider as LinkedAccountProvider);

                        if (tokens.success) {
                            token.linkedAccounts[provider as LinkedAccountProvider] = {
                                ...account,
                                ...tokens.payload,
                            };
                        } else {
                            delete token.linkedAccounts[provider as LinkedAccountProvider];
                        }
                    }
                }
            }

            return token;
        },

        async session({ token, session }) {
            if (session.user) {
                Object.assign(session.user, {
                    id: token.sub as string,
                    provider: token.provider,
                    linkedAccounts: token.linkedAccounts,
                });
            }
            return session;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    ...authConfig,
});
