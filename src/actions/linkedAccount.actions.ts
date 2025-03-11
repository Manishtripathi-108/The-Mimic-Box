'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { safeAwait } from '@/lib/utils/safeAwait.utils';
import { LinkedAccountProvider } from '@prisma/client';

export const removeLinkedAccount = async (provider: LinkedAccountProvider) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return {
            success: false,
            message: 'User not found',
        };
    }

    const [error] = await safeAwait(
        db.linkedAccount.delete({
            where: { userId_provider: { userId, provider } },
        })
    );

    if (error) {
        return {
            success: false,
            message: `Failed to disconnect ${provider}'`,
        };
    }

    return {
        success: true,
        message: `Successfully disconnected ${provider}`,
    };
};
