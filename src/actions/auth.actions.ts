'use server';

import { loginSchema, registerSchema } from '@/lib/schema/auth.validations';
import { z } from 'zod';

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isValid = loginSchema.safeParse(data);
    console.log('Sign In Data:', data);

    if (!isValid.success) {
        console.error(isValid.error.errors);
        return;
    }
};

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isValid = registerSchema.safeParse(data);
    console.log('Register Data:', data);

    if (!isValid.success) {
        console.error(isValid.error.errors);
        return;
    }
};
