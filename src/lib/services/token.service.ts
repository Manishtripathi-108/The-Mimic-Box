import { v4 as uuidV4 } from 'uuid';

import { TOKEN_EXPIRY_MS } from '@/constants/time.constants';
import { db } from '@/lib/db';

/**
 * Utility function to generate a random token and expiry date.
 * Centralized so logic is reused across all token-generators.
 */
const generateTokenData = () => ({
    token: uuidV4(),
    expires: new Date(Date.now() + TOKEN_EXPIRY_MS),
});

/**
 * Generate or update a verification token for a given user.
 * - Ensures only one token exists per user.
 * - If token already exists → update with new token & expiry.
 * - Else → create a new token.
 */
export const generateVerificationToken = async (userId: string) => {
    const { token, expires } = generateTokenData();

    return db.verificationToken.upsert({
        where: { userId },
        update: { token, expires },
        create: { token, expires, user: { connect: { id: userId } } },
    });
};

/**
 * Generate or update a "change email" token for a user.
 * - Stores both the new email and token for confirmation.
 */
export const generateChangeEmailToken = async (userId: string, newEmail: string) => {
    const { token, expires } = generateTokenData();

    return db.changeEmailToken.upsert({
        where: { userId },
        update: { newEmail, token, expires },
        create: { newEmail, token, expires, user: { connect: { id: userId } } },
    });
};

/**
 * Generate or update a "forgot password" token for a user.
 * - Ensures old tokens are invalidated by replacing with the new one.
 */
export const generateForgotPasswordToken = async (userId: string) => {
    const { token, expires } = generateTokenData();

    return db.forgotPasswordToken.upsert({
        where: { userId },
        update: { token, expires },
        create: { token, expires, user: { connect: { id: userId } } },
    });
};
