'use client';

import React, { useCallback, useTransition } from 'react';

import { LinkedAccountProvider } from '@prisma/client';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { removeLinkedAccount } from '@/actions/linkedAccount.actions';
import { API_ROUTES } from '@/constants/routes.constants';
import useSafeAwaitClient from '@/hooks/useSafeAwaitClient';
import cn from '@/lib/utils/cn';

export const ConnectAccount = ({
    className,
    children,
    account,
    callBackUrl = '/',
}: {
    className?: string;
    children?: React.ReactNode;
    account: LinkedAccountProvider;
    callBackUrl: string;
}) => {
    const { isPending, makeApiCall } = useSafeAwaitClient<{ provider: LinkedAccountProvider }, string>();

    const handleConnect = async () => {
        await makeApiCall({
            url: `${(API_ROUTES.AUTH_LINK_ACCOUNT[account.toUpperCase() as keyof typeof API_ROUTES.AUTH_LINK_ACCOUNT] as { ROOT: string }).ROOT}?callbackUrl=${callBackUrl}`,
            data: { provider: account },
            onStart() {
                localStorage.setItem('callbackUrl', callBackUrl);
            },
            onError() {
                toast.error(`Failed to connect ${account}`);
            },
            onSuccess(data) {
                window.location.href = data;
            },
        });
    };

    return (
        <button onClick={handleConnect} className={cn(className)}>
            {isPending ? 'Connecting...' : children || `Connect ${account}`}
        </button>
    );
};

export const DisconnectAccount = ({
    className,
    children,
    account,
}: {
    className?: string;
    children?: React.ReactNode;
    account: LinkedAccountProvider;
}) => {
    const [isPending, startTransition] = useTransition();
    const { data: session, update } = useSession();

    const handleDisconnect = useCallback(() => {
        startTransition(async () => {
            const res = await removeLinkedAccount(account);
            if (res.success) {
                toast.success(res.message);
                await update(session);
                window.location.reload();
            } else {
                toast.error(res.message);
            }
        });
    }, [account, update, session]);

    return (
        <button type="button" onClick={handleDisconnect} disabled={isPending} className={cn(className)}>
            {isPending ? 'Disconnecting...' : children || `Disconnect ${account}`}
        </button>
    );
};
