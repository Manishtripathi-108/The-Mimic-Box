'use server';

import { signIn } from '@/auth';
import { db } from '@/lib/db';
import { loginSchema, registerSchema } from '@/lib/schema/auth.validations';
import { sendVerificationEmail } from '@/lib/services/auth.service';
import { DEFAULT_AUTH_REDIRECT } from '@/routes';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    // Validate input
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.errors };
    }

    const { email, password } = parsed.data;

    try {
        const response = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (response?.error) {
            return { success: false, message: 'Incorrect email or password.' };
        }

        return { success: true, redirect: DEFAULT_AUTH_REDIRECT };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { success: false, message: 'Incorrect email or password.' };

                default:
                    return { success: false, message: 'Something went wrong.' };
            }
        }
    }
};

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    // Validate input
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.errors };
    }

    const { email, fullName, password } = parsed.data;

    try {
        // Check if email is already taken
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, message: 'This email is already registered.' };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        await db.user.create({
            data: {
                email,
                name: fullName,
                password: hashedPassword,
            },
        });

        // Create new verification token
        const token = await db.verificationToken.create({
            data: {
                email,
                token: crypto.randomUUID(),
                expires: new Date(Date.now() + 15 * 60 * 1000),
            },
        });

        // Send verification email
        const response = await sendVerificationEmail(email, token.token);

        return response;
    } catch (error) {
        return { success: false, message: 'Something went wrong. Please try again later.', error };
    }
};

export const verifyEmailToken = async (token: string) => {
    try {
        const response = await db.verificationToken.findFirst({
            where: { token },
        });

        if (!response || response.expires < new Date()) {
            return { success: false, message: 'Verification token is invalid or has expired.' };
        }

        await db.verificationToken.delete({
            where: { token },
        });

        await db.user.update({
            where: { email: response.email },
            data: { emailVerified: new Date() },
        });

        return { success: true };
    } catch (error) {
        console.error('🔐 Verify email error:', error);
        return { success: false, message: 'Something went wrong. Please try again later.' };
    }
};
