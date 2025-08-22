import 'next-auth';
import 'next-auth/jwt';

import { LinkedAccountProvider } from '@/lib/generated/prisma';

export interface LinkedAccount {
    id: string;
    imageUrl: string;
    bannerUrl: string;
    displayName?: string;
    username?: string;
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

// Extend NextAuth types to support only the allowed linked account providers
declare module 'next-auth' {
    interface User {
        provider?: string;
        linkedAccounts?: Partial<Record<LinkedAccountProvider, LinkedAccount>>;
        emailVerified?: Date;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        provider?: string;
        linkedAccounts?: Partial<Record<LinkedAccountProvider, LinkedAccount>>;
    }
}
