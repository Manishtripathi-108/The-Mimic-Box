'use server';

import { LinkedAccountProvider } from '@prisma/client';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { createError, createSuccess } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const removeLinkedAccount = async (provider: LinkedAccountProvider) => {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return createError('User not found');

    const [error] = await safeAwait(
        db.linkedAccount.delete({
            where: { userId_provider: { userId, provider } },
        })
    );

    return error ? createError(`Failed to disconnect ${provider}`, { error }) : createSuccess(`Successfully disconnected ${provider}`);
};
