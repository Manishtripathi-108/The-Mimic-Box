import { z } from 'zod';

const emailField = z.string().email({ message: 'Please enter a valid email address.' });

const passwordField = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[a-z]/, { message: 'Include at least one lowercase letter.' })
    .regex(/[A-Z]/, { message: 'Include at least one uppercase letter.' })
    .regex(/[@$#!*]/, {
        message: 'Include at least one special character (@, $, #, !, *).',
    });

const confirmPasswordField = passwordField;

export const registerSchema = z
    .object({
        email: emailField,
        fullName: z.string().min(4, { message: 'Full name must be at least 4 characters long.' }),
        password: passwordField,
        confirmPassword: confirmPasswordField,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
});

export const forgotPasswordSchema = z.object({
    email: emailField,
});

export const resetPasswordSchema = z
    .object({
        token: z.string().uuid({ message: 'Invalid token.' }),
        password: passwordField,
        confirmPassword: confirmPasswordField,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword'],
    });
