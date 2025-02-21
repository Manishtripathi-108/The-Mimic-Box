'use server';

import { connectDB } from '@/lib/db';
import { loginSchema, registerSchema } from '@/lib/schema/auth.validations';
import User from '@/models/User';
import { z } from 'zod';
import { verifyPassword } from '@/lib/utils/password';

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    await connectDB();

    // Validate input
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.errors };
    }

    const { email, password } = parsed.data;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: 'Incorrect email or password.' };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
        return { success: false, message: 'Incorrect email or password.' };
    }

    return { success: true };
};

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    await connectDB();

    // Validate input
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, errors: parsed.error.errors };
    }

    const { email, fullName, password } = parsed.data;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { success: false, message: 'This email is already registered.' };
    }

    // Create new user
    const user = new User({ email, fullName, password });
    await user.save();

    return { success: true };
};
