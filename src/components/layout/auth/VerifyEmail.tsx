'use client';

import { useActionState } from 'react';

import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';

import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

import { verifyEmailToken } from '@/actions/auth.actions';
import { verifyEmailChangeToken } from '@/actions/user.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES, DEFAULT_AUTH_ROUTE } from '@/constants/routes.constants';

export default function VerifyEmail({ type }: { type: 'verify' | 'change' }) {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Define the action function
    async function handleVerify() {
        if (!token) return { success: false, message: 'Token missing' };

        try {
            const actionFn = type === 'verify' ? verifyEmailToken : verifyEmailChangeToken;
            const response = await actionFn(token);
            if (response.success) {
                toast.success(response.message || 'Email verified successfully');
                if (type === 'verify') {
                    redirect(DEFAULT_AUTH_ROUTE);
                }
            }

            return response;
        } catch {
            return { success: false, message: 'Verification failed. Please try again.' };
        }
    }

    // Use useActionState to handle async state
    const [state, verifyAction, isPending] = useActionState(handleVerify, undefined);

    return (
        <main className="bg-primary h-calc-full-height flex items-center justify-center">
            <article className="shadow-floating-sm from-secondary to-tertiary w-full max-w-md overflow-hidden rounded-2xl bg-linear-150 from-15% to-85% text-center">
                <header className="shadow-raised-xs text-highlight flex items-center justify-center gap-2 border-b p-4">
                    <div className="shadow-floating-xs flex size-12 items-center justify-center rounded-full border">
                        <Icon icon={ICON_SET.AppLogo} className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold">The Mimic Box</h2>
                </header>

                {token && (!state || state?.success) ? (
                    <div className="p-6">
                        <Icon icon={isPending ? ICON_SET.LOADING : ICON_SET.EMAIL} className="text-highlight mb-4 inline-block size-16" />
                        <h1 className="text-text-primary text-2xl font-bold">{type === 'verify' ? 'Verify Email' : 'Change Email'}</h1>
                        <p className="text-text-secondary mt-2">
                            Click the button below to {type === 'verify' ? 'verify your email and activate your account' : 'change your email'}.
                        </p>

                        <form action={verifyAction}>
                            <button type="submit" className="button button-highlight mt-4 w-full" disabled={isPending}>
                                {isPending ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-6">
                        <Icon icon={ICON_SET.NOT_FOUND} className="mb-2 inline-block size-16 text-red-500" />
                        <h1 className="text-text-primary text-2xl font-bold">Token Not Found</h1>
                        <p className="text-text-secondary mt-2">The token is invalid or expired. Please request a new one.</p>

                        <Link href={APP_ROUTES.AUTH.LOGIN} replace className="button button-highlight mt-4 w-full">
                            Request New Token
                        </Link>

                        {state?.message && (
                            <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                                <Icon icon={ICON_SET.ERROR} className="size-7" />
                                {state.message}
                            </p>
                        )}
                    </div>
                )}
            </article>
        </main>
    );
}
