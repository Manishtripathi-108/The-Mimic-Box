'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn } from '@/auth';
import { generateEmailVerificationEmail, generatePasswordResetEmail } from '@/components/emails/AuthEmailTemplate';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '@/lib/schema/auth.validations';
import { generateForgotPasswordToken, generateVerificationToken } from '@/lib/services/auth.service';
import { ErrorResponseOutput, SuccessResponseOutput } from '@/lib/types/response.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';

type ActionResponse = Promise<SuccessResponseOutput | ErrorResponseOutput<z.ZodIssue[]>>;

export const loginAction = async (data: z.infer<typeof loginSchema>): ActionResponse => {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) return createErrorReturn<z.ZodIssue[]>('Invalid data!', undefined, parsed.error.errors);

    const { email, password } = parsed.data;

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return createErrorReturn('No account found with this email.');

        if (!user?.emailVerified) {
            const token = await generateVerificationToken(email);
            const response = await sendEmail(email, 'Verify Your Email', generateEmailVerificationEmail(token.token));

            return response.success
                ? createErrorReturn('Email not verified. Verify your email first.')
                : createErrorReturn('Failed to send verification email.');
        }

        const response = await signIn('credentials', { email, password, redirect: false });

        return response?.error ? createErrorReturn(response.error) : createSuccessReturn('Login successful');
    } catch (error) {
        let message = 'Something went wrong.';
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    message = 'Invalid email or password.';
                    break;

                default:
                    message = 'Something went wrong.';
            }
        }
        return createErrorReturn(message);
    }
};

export const registerAction = async (data: z.infer<typeof registerSchema>): ActionResponse => {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) return createErrorReturn<z.ZodIssue[]>('Invalid data!', undefined, parsed.error.errors);

    const { email, fullName, password } = parsed.data;

    try {
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) return createErrorReturn('Email already registered.');

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({ data: { email, name: fullName, password: hashedPassword } });

        const token = await generateVerificationToken(email);
        const response = await sendEmail(email, 'Verify Your Email', generateEmailVerificationEmail(token.token));

        return response.success
            ? createSuccessReturn('Account created! Check your inbox for verification link.')
            : createErrorReturn('Failed to send verification email.');
    } catch {
        return createErrorReturn('Registration failed. Try again later.');
    }
};

export const verifyEmailToken = async (token: string) => {
    try {
        const response = await db.verificationToken.findUnique({ where: { token } });

        if (!response || response.expires < new Date()) {
            return createErrorReturn('Invalid or expired verification link.');
        }

        await db.user.update({
            where: { email: response.email },
            data: { emailVerified: new Date() },
        });

        await db.verificationToken.delete({ where: { token } });
        return createSuccessReturn('Email verified! You can now log in.');
    } catch {
        return createErrorReturn('Verification failed. Try again later.');
    }
};

export const forgotPasswordAction = async (data: z.infer<typeof forgotPasswordSchema>): ActionResponse => {
    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) return createErrorReturn<z.ZodIssue[]>('Invalid data!', undefined, parsed.error.errors);

    const { email } = parsed.data;

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return createErrorReturn('No account found with this email.');

        if (!user?.emailVerified) {
            return createErrorReturn('Email not verified. Verify your email first.');
        }

        if (!user?.password) {
            return createErrorReturn('No password set for this account.');
        }

        const token = await generateForgotPasswordToken(email);
        const response = await sendEmail(email, 'Reset Your Password', generatePasswordResetEmail(token.token));

        return response.success
            ? createSuccessReturn('Check your inbox to reset your password.')
            : createErrorReturn('Failed to send reset token email.');
    } catch {
        return createErrorReturn('Failed to reset password. Try again later.');
    }
};

export const resetPasswordAction = async (data: z.infer<typeof resetPasswordSchema>): ActionResponse => {
    const parsed = resetPasswordSchema.safeParse(data);
    if (!parsed.success) return createErrorReturn<z.ZodIssue[]>('Invalid data!', undefined, parsed.error.errors);

    const { token, password } = parsed.data;

    try {
        const response = await db.forgotPasswordToken.findUnique({ where: { token } });

        if (!response || response.expires < new Date()) {
            return createErrorReturn('Invalid or expired reset token.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where: { email: response.email },
            data: { password: hashedPassword },
        });

        await db.forgotPasswordToken.delete({ where: { token } });

        return createSuccessReturn('Password reset successfully!');
    } catch {
        return createErrorReturn('Failed to reset password. Try again later.');
    }
};
