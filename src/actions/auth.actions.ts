'use server';

import { signIn } from '@/auth';
import { db } from '@/lib/db';
import { loginSchema, registerSchema } from '@/lib/schema/auth.validations';
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
        console.error('🔐 Sign in error:', error);
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

        return { success: true };
    } catch (error) {
        console.error('🔐 Registration error:', error);
        return { success: false, message: 'Something went wrong. Please try again later.' };
    }
};
