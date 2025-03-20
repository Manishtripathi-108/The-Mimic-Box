import { $Enums } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';

import { PROFILE_IMAGE_URL } from '@/constants/client.constants';
import { TOKEN_EXPIRY_MS } from '@/constants/server.constants';
import { db } from '@/lib/db';
import { LinkedAccount } from '@/lib/types/next-auth';

// Generate Verification Token
export const generateVerificationToken = async (email: string) => {
    const token = uuidV4();
    const expires = new Date(Date.now() + TOKEN_EXPIRY_MS);

    return await db.verificationToken.upsert({
        where: { email },
        update: { token, expires },
        create: { email, token, expires },
    });
};

// Generate Forgot Password Token
export const generateForgotPasswordToken = async (email: string) => {
    const token = uuidV4();
    const expires = new Date(Date.now() + TOKEN_EXPIRY_MS);

    return await db.forgotPasswordToken.upsert({
        where: { email },
        update: { token, expires },
        create: { email, token, expires },
    });
};

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

    const transformedAccounts = linkedAccounts.reduce<Partial<Record<$Enums.LinkedAccountProvider, LinkedAccount>>>((map, account) => {
        map[account.provider] = {
            id: account.providerAccountId,
            imageUrl: account.imageUrl || PROFILE_IMAGE_URL,
            bannerUrl: account.bannerUrl ?? undefined,
            displayName: account.displayName ?? undefined,
            username: account.username ?? undefined,
            tokenType: account.token_type ?? 'Bearer',
            accessToken: account.access_token ?? '',
            refreshToken: account.refresh_token ?? '',
            expiresAt: account.expires_at ?? 0,
        };
        return map;
    }, {});

    return transformedAccounts;
};
