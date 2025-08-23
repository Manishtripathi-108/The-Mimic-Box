import { $Enums } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';

import { TOKEN_EXPIRY_MS } from '@/constants/time.constants';
import { db } from '@/lib/db';
import { LinkedAccount } from '@/lib/types/next-auth';

/**
 * Utility function to generate a random token and expiry date.
 * Centralized so logic is reused across all token-generators.
 */
const generateTokenData = () => ({
    token: uuidV4(),
    expires_at: new Date(Date.now() + TOKEN_EXPIRY_MS),
});

/**
 * Generate or update a verification token for a given user.
 * - Ensures only one token exists per user.
 * - If token already exists → update with new token & expiry.
 * - Else → create a new token.
 */
export const generateVerificationToken = async (userId: string) => {
    const { token, expires_at } = generateTokenData();

    return db.verificationToken.upsert({
        where: { userId },
        update: { token, expires_at },
        create: { token, expires_at, user: { connect: { id: userId } } },
    });
};

/**
 * Generate or update a "change email" token for a user.
 * - Stores both the new email and token for confirmation.
 */
export const generateChangeEmailToken = async (userId: string, newEmail: string) => {
    const { token, expires_at } = generateTokenData();

    return db.changeEmailToken.upsert({
        where: { userId },
        update: { newEmail, token, expires_at },
        create: { newEmail, token, expires_at, user: { connect: { id: userId } } },
    });
};

/**
 * Generate or update a "forgot password" token for a user.
 * - Ensures old tokens are invalidated by replacing with the new one.
 */
export const generateForgotPasswordToken = async (userId: string) => {
    const { token, expires_at } = generateTokenData();

    return db.forgotPasswordToken.upsert({
        where: { userId },
        update: { token, expires_at },
        create: { token, expires_at, user: { connect: { id: userId } } },
    });
};

/**
 * Fetch all linked accounts for a user and normalize into a provider→account map.
 * - Returns `{}` if userId is undefined (saves unnecessary DB query).
 * - Maps Prisma DB fields → app-friendly object format.
 */
export const getLinkedAccounts = async (userId: string | undefined) => {
    if (!userId) return {};

    const linkedAccounts = await db.linkedAccount.findMany({
        where: { userId },
        select: {
            provider: true,
            providerAccountId: true,
            imageUrl: true,
            bannerUrl: true,
            displayName: true,
            username: true,
            token_type: true,
            access_token: true,
            refresh_token: true,
            expires_at: true,
        },
    });

    return linkedAccounts.reduce<Partial<Record<$Enums.LinkedAccountProvider, LinkedAccount>>>((map, account) => {
        map[account.provider] = {
            id: account.providerAccountId,
            imageUrl: account.imageUrl,
            bannerUrl: account.bannerUrl,
            displayName: account.displayName ?? undefined,
            username: account.username ?? undefined,
            tokenType: account.token_type ?? 'Bearer',
            accessToken: account.access_token ?? '',
            refreshToken: account.refresh_token ?? '',
            expiresAt: account.expires_at ?? new Date(0),
        };
        return map;
    }, {});
};
