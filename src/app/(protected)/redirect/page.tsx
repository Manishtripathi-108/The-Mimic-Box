'use client';

import React, { Suspense, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useSession } from 'next-auth/react';

import ICON_SET from '@/constants/icons';
import { DEFAULT_AUTH_REDIRECT } from '@/constants/routes.constants';

let callBackUrlLocal = null;
if (typeof window !== 'undefined') {
    callBackUrlLocal = localStorage.getItem('callbackUrl');

    if (callBackUrlLocal) {
        localStorage.removeItem('callbackUrl');
    }
}

let redirected = false;

const RedirectComponent = () => {
    return (
        <div className="grid h-screen place-items-center">
            <h1 className="text-accent font-alegreya text-center text-4xl">Redirecting...</h1>
            <Suspense fallback={<Icon icon={ICON_SET.LOADING} className="size-7" />}>
                <RedirectLogic />
            </Suspense>
        </div>
    );
};

const RedirectLogic = () => {
    const { data: session, update, status } = useSession();
    const params = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (status !== 'authenticated' || redirected) return;

        const performRedirect = async () => {
            redirected = true;
            const callbackUrl = params?.get('callbackUrl') || callBackUrlLocal || DEFAULT_AUTH_REDIRECT;

            console.log('Redirecting to:', callbackUrl);

            await update(session);
            router.replace(callbackUrl);
        };

        performRedirect();
    }, [status, params, session, update, router]);

    return null;
};

export default RedirectComponent;
