import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { loginSchema } from './lib/schema/auth.validations';
import { db } from './lib/db';
import bcrypt from 'bcryptjs';

export default {
    providers: [
        Google,
        Github,
        Credentials({
            async authorize(Credentials) {
                // Validate input
                const parsed = loginSchema.safeParse(Credentials);
                if (parsed.success) {
                    const { email, password } = parsed.data;

                    // Check if user exists
                    const user = await db.user.findUnique({ where: { email } });
                    console.log('🔐 User:', user);

                    if (!user || !user.password) return null;

                    // Verify password
                    const isValidPassword = await bcrypt.compare(password, user.password);
                    if (isValidPassword) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            emailVerified: user.emailVerified || undefined,
                            image: user.image,
                        };
                    }
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
