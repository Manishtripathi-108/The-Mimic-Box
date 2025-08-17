import { z } from 'zod';

import { emailValidation, passwordValidation } from '@/lib/schema/common.validations';

const confirmPasswordField = passwordValidation;

export const registerSchema = z
    .object({
        email: emailValidation,
        fullName: z.string().min(4, 'Full name must be at least 4 characters long.'),
        password: passwordValidation,
        confirmPassword: confirmPasswordField,
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
});

export const forgotPasswordSchema = z.object({
    email: emailValidation,
});

export const resetPasswordSchema = z
    .object({
        token: z.uuidv4('Invalid token.'),
        password: passwordValidation,
        confirmPassword: confirmPasswordField,
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: 'Passwords do not match.',
        path: ['confirmPassword'],
    });
