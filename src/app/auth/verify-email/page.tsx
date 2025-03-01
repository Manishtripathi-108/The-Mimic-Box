'use client';

import ICON_SET from '@/constants/icons';
import { Icon } from '@iconify/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { verifyEmailToken } from '@/actions/auth.actions';
import { DEFAULT_AUTH_ROUTE } from '@/routes';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { APP_ROUTES } from '@/constants/routes.constants';

export default function VerifyEmail() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    // Define the action function
    async function handleVerify() {
        if (!token) return { success: false, message: 'Token missing' };

        try {
            const response = await verifyEmailToken(token);
            if (response.success) {
                toast.success('Email verified. You can now log in.');
                router.push(DEFAULT_AUTH_ROUTE);
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
            <div className="shadow-neumorphic-sm w-full max-w-md overflow-hidden rounded-2xl text-center">
                <div className="shadow-neumorphic-xs flex items-center justify-center gap-4 p-4">
                    <div className="shadow-neumorphic-xs flex size-12 items-center justify-center rounded-full border">
                        <Icon icon={ICON_SET.DESKTOP} className="size-6" />
                    </div>
                    <h2 className="text-highlight mt-2 text-lg font-semibold">The Mimic Box</h2>
                </div>

                {token ? (
                    <div className="p-6">
                        <Icon icon={isPending ? ICON_SET.LOADING : ICON_SET.EMAIL} className="text-highlight mb-4 inline-block size-16" />
                        <h1 className="text-text-primary text-2xl font-bold">Confirm Your Email</h1>
                        <p className="text-text-secondary mt-2">Click the button below to verify your email and activate your account.</p>

                        <form action={verifyAction}>
                            <button type="submit" className="button mt-4 w-full" disabled={isPending}>
                                {isPending ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>

                        {state?.message && (
                            <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                                <Icon icon={ICON_SET.ERROR} className="size-7" />
                                {state.message}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="p-6">
                        <Icon icon={ICON_SET.NOT_FOUND} className="mb-2 inline-block size-16 text-red-500" />
                        <h1 className="text-text-primary text-2xl font-bold">Token Not Found</h1>
                        <p className="text-text-secondary mt-2">The token is invalid or expired. Please request a new one.</p>

                        <Link href={APP_ROUTES.AUTH.LOGIN} type="button" className="button mt-4 w-full">
                            Request New Token
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
