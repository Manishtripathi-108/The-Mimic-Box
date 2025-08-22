'use client';

import React, { useCallback, useTransition } from 'react';

import { usePathname } from 'next/navigation';

import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { removeLinkedAccount } from '@/actions/linkedAccount.actions';
import API_ROUTES from '@/constants/routes/api.routes';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import { LinkedAccountProvider } from '@/lib/generated/prisma';
import cn from '@/lib/utils/cn';

export const ConnectAccount = ({
    className,
    children,
    account,
    callBackUrl,
}: {
    className?: string;
    children?: React.ReactNode;
    account: LinkedAccountProvider;
    callBackUrl?: string;
}) => {
    const pathName = usePathname();
    const { isPending, makeApiCall } = useSafeApiCall<{ provider: LinkedAccountProvider }, string>();

    const handleConnect = async () => {
        await makeApiCall({
            url: `${API_ROUTES[`AUTH_LA_${account.toUpperCase()}_ROOT` as keyof typeof API_ROUTES]}?callbackUrl=${callBackUrl || pathName}`,
            data: { provider: account },
            onStart() {
                localStorage.setItem('callbackUrl', callBackUrl || pathName);
            },
            onError() {
                toast.error(`Failed to connect ${account}`);
            },
            onSuccess(data) {
                if (data) window.location.href = data;
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
