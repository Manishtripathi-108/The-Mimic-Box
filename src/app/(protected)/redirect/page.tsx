'use client';

import React, { useEffect } from 'react';

import { redirect, useSearchParams } from 'next/navigation';

import { useSession } from 'next-auth/react';

import { DEFAULT_AUTH_REDIRECT } from '@/constants/routes.constants';

const callBackUrlLocal = localStorage.getItem('callbackUrl');

if (callBackUrlLocal) {
    localStorage.removeItem('callbackUrl');
}

let redirected = false;

const RedirectComponent = () => {
    const { data: session, update, status } = useSession();
    const params = useSearchParams();

    useEffect(() => {
        const performRedirect = async () => {
            if (status !== 'authenticated') return;
            redirected = true;
            const callbackUrl = params?.get('callbackUrl') || callBackUrlLocal || DEFAULT_AUTH_REDIRECT;
            console.log('Redirecting to:', callbackUrl, session);

            await update(session);
            redirect(callbackUrl);
        };

        if (!redirected) {
            console.log('Redirecting...', status);
            performRedirect();
        }
    }, [status]);

    return (
        <div className="h-calc-full-height grid place-items-center">
            <h1 className="text-accent font-alegreya text-center text-4xl">Redirecting...</h1>
        </div>
    );
};

export default RedirectComponent;
