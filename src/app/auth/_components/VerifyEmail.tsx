'use client';

import { useActionState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { verifyEmailToken } from '@/actions/auth.actions';
import { verifyEmailChangeToken } from '@/actions/user.actions';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';

const VerifyEmail = ({ type }: { type: 'verify' | 'change' }) => {
    const { data: session, update } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
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
                    router.replace(DEFAULT_AUTH_ROUTE);
                } else {
                    await update({
                        ...session,
                        user: {
                            ...session?.user,
                            email: (response as { payload: { email: string } }).payload?.email || session?.user?.email,
                        },
                    });
                }
            }

            return response;
        } catch {
            return { success: false, message: 'Verification failed. Please try again.' };
        }
    }

    // Use useActionState to handle async state
    const [state, verifyAction, isPending] = useActionState(handleVerify, undefined);
    const hasError = () => !token || (state && !state.success);

    return (
        <main className="bg-primary h-calc-full-height flex items-center justify-center">
            <article className="shadow-floating-sm from-secondary to-tertiary w-full max-w-md overflow-hidden rounded-2xl bg-linear-150 from-15% to-85% text-center">
                <header className="shadow-raised-xs text-highlight flex items-center justify-center gap-2 border-b p-4">
                    <div className="shadow-floating-xs flex size-12 items-center justify-center rounded-full border">
                        <Icon icon="appLogo" className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold">The Mimic Box</h2>
                </header>

                {!hasError() ? (
                    <div className="p-6">
                        <Icon icon={isPending ? 'loading' : 'email'} className="text-highlight mb-4 inline-block size-16" />
                        <h1 className="text-text-primary text-2xl font-bold">{type === 'verify' ? 'Verify Email' : 'Change Email'}</h1>
                        <p className="text-text-secondary mt-2">
                            Click the button below to {type === 'verify' ? 'verify your email and activate your account' : 'change your email'}.
                        </p>

                        <form action={verifyAction}>
                            <Button type="submit" variant="highlight" className="mt-4 w-full" disabled={isPending}>
                                {isPending ? 'Verifying...' : 'Verify Email'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="p-6">
                        <Icon icon={token ? 'error' : 'notFound'} className="mb-2 inline-block size-16 text-red-500" />
                        <h1 className="text-text-primary text-2xl font-bold">{token ? 'Invalid Token!' : 'Token Missing!'}</h1>
                        <p className="mt-2 text-red-500">
                            {token
                                ? state?.message || 'The token is invalid or expired. Please request a new one.'
                                : 'The token is missing. Please request a new one.'}
                        </p>

                        <Link href={DEFAULT_AUTH_ROUTE} replace className="button button-highlight mt-4 w-full">
                            Request New Token
                        </Link>
                    </div>
                )}
            </article>
        </main>
    );
};

export default VerifyEmail;
