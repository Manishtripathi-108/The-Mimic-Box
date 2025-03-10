'use server';

import { signIn } from '@/auth';
import { db } from '@/lib/db';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '@/lib/schema/auth.validations';
import { generateForgotPasswordToken, generateVerificationToken } from '@/lib/services/auth.service';
import { DEFAULT_AUTH_REDIRECT } from '@/constants/routes.constants';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import { generateEmailVerificationEmail, generatePasswordResetEmail } from '@/components/emails/AuthEmailTemplate';

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) return { success: false, errors: parsed.error.errors };

    const { email, password } = parsed.data;

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return { success: false, message: 'No account found with this email.' };

        if (!user?.emailVerified) {
            const token = await generateVerificationToken(email);
            const response = await sendEmail(email, 'Verify Your Email', generateEmailVerificationEmail(token.token));

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
        const response = await sendEmail(email, 'Verify Your Email', generateEmailVerificationEmail(token.token));

        return response.success
            ? { success: true, message: 'Account created! To verify your email, check your inbox.' }
            : { success: false, message: 'Failed to send verification email.' };
    } catch {
        return { success: false, message: 'Registration failed. Try again later.' };
    }
};

export const verifyEmailToken = async (token: string) => {
    try {
        const response = await db.verificationToken.findUnique({ where: { token } });

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

export const forgotPasswordAction = async (data: z.infer<typeof forgotPasswordSchema>) => {
    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) return { success: false, errors: parsed.error.errors };

    const { email } = parsed.data;

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return { success: false, message: 'No account found with this email.' };

        if (!user?.emailVerified) {
            return { success: false, message: 'Email not verified. Verify your email first.' };
        }

        if (!user?.password) {
            return { success: false, message: 'No password set for this account.' };
        }

        const token = await generateForgotPasswordToken(email);
        const response = await sendEmail(email, 'Reset Your Password', generatePasswordResetEmail(token.token));

        return response.success
            ? { success: true, message: 'Check your inbox to reset your password.' }
            : { success: false, message: 'Failed to send reset token email.' };
    } catch {
        return { success: false, message: 'Failed to reset password. Try again later.' };
    }
};

export const resetPasswordAction = async (data: z.infer<typeof resetPasswordSchema>) => {
    const parsed = resetPasswordSchema.safeParse(data);
    if (!parsed.success) return { success: false, errors: parsed.error.errors };

    const { token, password } = parsed.data;

    try {
        const response = await db.forgotPasswordToken.findUnique({ where: { token } });

        if (!response || response.expires < new Date()) {
            return { success: false, message: 'Invalid or expired reset token.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where: { email: response.email },
            data: { password: hashedPassword },
        });

        await db.forgotPasswordToken.delete({ where: { token } });

        return { success: true, message: 'Password reset successfully!' };
    } catch {
        return { success: false, message: 'Failed to reset password. Try again later.' };
    }
};
