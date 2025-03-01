'use server';

import { signIn } from '@/auth';
import { db } from '@/lib/db';
import { loginSchema, registerSchema } from '@/lib/schema/auth.validations';
import { generateVerificationToken, sendVerificationEmail } from '@/lib/services/auth.service';
import { DEFAULT_AUTH_REDIRECT } from '@/routes';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) return { success: false, errors: parsed.error.errors };

    const { email, password } = parsed.data;

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user?.emailVerified) {
            const token = await generateVerificationToken(email);
            const response = await sendVerificationEmail(email, token.token);

            return response.success
                ? { success: false, message: 'Check your inbox to verify your email first.' }
                : { success: false, message: 'Failed to send verification email.' };
        }

        const response = await signIn('credentials', { email, password, redirect: false });

        return response?.error ? { success: false, message: 'Invalid email or password.' } : { success: true, redirect: DEFAULT_AUTH_REDIRECT };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { success: false, message: 'Invalid email or password.' };

                default:
                    return { success: false, message: 'Login failed. Please try again.' };
            }
        }
        return { success: false, message: 'Something went wrong.' };
    }
};

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) return { success: false, errors: parsed.error.errors };

    const { email, fullName, password } = parsed.data;

    try {
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) return { success: false, message: 'Email already registered.' };

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({ data: { email, name: fullName, password: hashedPassword } });

        const token = await generateVerificationToken(email);
        const response = await sendVerificationEmail(email, token.token);

        return response.success
            ? { success: true, message: 'Account created! To verify your email, check your inbox.' }
            : { success: false, message: 'Failed to send verification email.' };
    } catch {
        return { success: false, message: 'Registration failed. Try again later.' };
    }
};

export const verifyEmailToken = async (token: string) => {
    try {
        const response = await db.verificationToken.findFirst({ where: { token } });

        if (!response || response.expires < new Date()) {
            return { success: false, message: 'Invalid or expired verification link.' };
        }

        await db.verificationToken.delete({ where: { token } });

        await db.user.update({
            where: { email: response.email },
            data: { emailVerified: new Date() },
        });

        return { success: true, message: 'Email verified! You can now log in.' };
    } catch {
        return { success: false, message: 'Verification failed. Try again later.' };
    }
};
