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
import { T_ErrorResponseOutput, T_SuccessResponseOutput } from '@/lib/types/response.types';
import { createError, createSuccess, createValidationError } from '@/lib/utils/createResponse.utils';

// Unified type for all possible responses
type ActionResponse = Promise<T_SuccessResponseOutput | T_ErrorResponseOutput<z.ZodIssue[]>>;

export const loginAction = async (data: z.infer<typeof loginSchema>): ActionResponse => {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) return createValidationError('Invalid data!', parsed.error.errors);

    const { email, password } = parsed.data;

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return createValidationError('No account found with this email.');

        if (!user?.emailVerified) {
            const token = await generateVerificationToken(email);
            const response = await sendEmail(email, 'Verify Your Email', generateEmailVerificationEmail(token.token));

            return response.success
                ? createValidationError('Email not verified. Verify your email first.')
                : createError('Failed to send verification email.');
        }

        const response = await signIn('credentials', { email, password, redirect: false });

        return response?.error ? createValidationError('Invalid email or password.') : createSuccess('Login successful');
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
        return createError(message);
    }
};

export const registerAction = async (data: z.infer<typeof registerSchema>): ActionResponse => {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) return createValidationError('Invalid data!', parsed.error.errors);

    const { email, fullName, password } = parsed.data;

    try {
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) return createValidationError('Email already registered.');

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({ data: { email, name: fullName, password: hashedPassword } });

        const token = await generateVerificationToken(email);
        const response = await sendEmail(email, 'Verify Your Email', generateEmailVerificationEmail(token.token));

        return response.success
            ? createSuccess('Account created! Check your inbox for verification link.')
            : createError('Failed to send verification email.');
    } catch {
        return createError('Registration failed. Try again later.');
    }
};

export const verifyEmailToken = async (token: string) => {
    try {
        const response = await db.verificationToken.findUnique({ where: { token } });

        if (!response || response.expires < new Date()) {
            return createValidationError('Invalid or expired verification link.');
        }

        await db.user.update({
            where: { email: response.email },
            data: { emailVerified: new Date() },
        });

        await db.verificationToken.delete({ where: { token } });
        return createSuccess('Email verified! You can now log in.');
    } catch {
        return createError('Verification failed. Try again later.');
    }
};

export const forgotPasswordAction = async (data: z.infer<typeof forgotPasswordSchema>): ActionResponse => {
    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) return createValidationError('Invalid data!', parsed.error.errors);

    const { email } = parsed.data;

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return createValidationError('No account found with this email.');

        if (!user?.emailVerified) {
            return createValidationError('Email not verified. Verify your email first.');
        }

        if (!user?.password) {
            return createValidationError('No password set for this account.');
        }

        const token = await generateForgotPasswordToken(email);
        const response = await sendEmail(email, 'Reset Your Password', generatePasswordResetEmail(token.token));

        return response.success ? createSuccess('Check your inbox to reset your password.') : createError('Failed to send reset token email.');
    } catch {
        return createError('Failed to reset password. Try again later.');
    }
};

export const resetPasswordAction = async (data: z.infer<typeof resetPasswordSchema>): ActionResponse => {
    const parsed = resetPasswordSchema.safeParse(data);
    if (!parsed.success) return createValidationError('Invalid data!', parsed.error.errors);

    const { token, password } = parsed.data;

    try {
        const response = await db.forgotPasswordToken.findUnique({ where: { token } });

        if (!response || response.expires < new Date()) {
            return createValidationError('Invalid or expired reset token.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where: { email: response.email },
            data: { password: hashedPassword },
        });

        await db.forgotPasswordToken.delete({ where: { token } });

        return createSuccess('Password reset successfully!');
    } catch {
        return createError('Failed to reset password. Try again later.');
    }
};
