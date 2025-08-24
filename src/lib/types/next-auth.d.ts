import { LinkedAccount, LinkedAccountProvider } from '@prisma/client';
import 'next-auth';
import 'next-auth/jwt';

import { Prettify } from '@/lib/types/helper.type';

export type LinkedAccountData = Prettify<
    Omit<LinkedAccount, 'providerAccountId' | 'userId' | 'type' | 'scope' | 'provider' | 'createdAt' | 'updatedAt'> & {
        id: string;
    }
>;

export type LinkedAccountsByProvider = Partial<Record<LinkedAccountProvider, LinkedAccountData>>;

// Extend NextAuth types to support only the allowed linked account providers
declare module 'next-auth' {
    interface User {
        provider?: string;
        linkedAccounts?: LinkedAccountsByProvider;
        emailVerified?: Date;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        provider?: string;
        linkedAccounts?: LinkedAccountsByProvider;
    }
}
