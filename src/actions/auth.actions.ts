'use server';

import { loginSchema, registerSchema } from '@/lib/schema/auth.validations';
import { z } from 'zod';

export const loginAction = async (data: z.infer<typeof loginSchema>): Promise<{ success: boolean; errors?: z.ZodIssue[]; message?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isValid = loginSchema.safeParse(data);
    console.log('Sign In Data:', data);

    if (!isValid.success) {
        console.error(isValid.error.errors);
        return { success: false, errors: isValid.error.errors };
    }

    if (data.email !== 'admin@example.com' || data.password !== 'Pa$$w0rd!') {
        console.error('Invalid credentials');
        return { success: false, message: 'Invalid email or password' };
    }

    return { success: true };
};

export const registerAction = async (data: z.infer<typeof registerSchema>): Promise<{ success: boolean; errors?: z.ZodIssue[] }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isValid = registerSchema.safeParse(data);
    console.log('Register Data:', data);

    if (!isValid.success) {
        console.error(isValid.error.errors);
        return { success: false, errors: isValid.error.errors };
    }

    return { success: true };
};
