import { z } from 'zod';

export const registerSchema = z
    .object({
        email: z.string().email({ message: 'Please enter a valid email address.' }),
        fullName: z.string().min(4, { message: 'Full name must be at least 4 characters long.' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[a-z]/, { message: 'Include at least one lowercase letter.' })
            .regex(/[A-Z]/, { message: 'Include at least one uppercase letter.' })
            .regex(/[@$#!*]/, { message: 'Include at least one special character (@, $, #, !, *).' }),
        confirmPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[a-z]/, { message: 'Include at least one lowercase letter.' })
            .regex(/[A-Z]/, { message: 'Include at least one uppercase letter.' })
            .regex(/[@$#!*]/, { message: 'Include at least one special character (@, $, #, !, *).' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .regex(/[a-z]/, { message: 'Include at least one lowercase letter.' })
        .regex(/[A-Z]/, { message: 'Include at least one uppercase letter.' })
        .regex(/[@$#!*]/, { message: 'Include at least one special character (@, $, #, !, *).' }),
    remember: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().uuid({ message: 'Invalid token.' }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[a-z]/, { message: 'Include at least one lowercase letter.' })
            .regex(/[A-Z]/, { message: 'Include at least one uppercase letter.' })
            .regex(/[@$#!*]/, { message: 'Include at least one special character (@, $, #, !, *).' }),
        confirmPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[a-z]/, { message: 'Include at least one lowercase letter.' })
            .regex(/[A-Z]/, { message: 'Include at least one uppercase letter.' })
            .regex(/[@$#!*]/, { message: 'Include at least one special character (@, $, #, !, *).' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });
