import { db } from '../db';
import { v4 as uuidV4 } from 'uuid';

const TOKEN_EXPIRY_MS = 15 * 60 * 1000;

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
