import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { loginSchema } from './lib/schema/auth.validations';
import { db } from './lib/db';
import bcrypt from 'bcrypt';

export default {
    providers: [
        Google,
        Github,
        Credentials({
            async authorize(Credentials) {
                console.log('🔐 Authorizing...');

                // Validate input
                const parsed = loginSchema.safeParse(Credentials);
                if (parsed.success) {
                    const { email, password } = parsed.data;
                    console.log('🔐 Email:', email);

                    // Check if user exists
                    const user = await db.user.findUnique({ where: { email } });
                    console.log('🔐 User:', user);

                    if (!user || !user.password) return null;

                    // Verify password
                    const isValidPassword = await bcrypt.compare(password, user.password);
                    if (isValidPassword) return user;
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
