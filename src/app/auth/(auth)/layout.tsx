'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { Icon } from '@iconify/react';
import { signIn } from 'next-auth/react';

import ICON_SET from '@/constants/icons';
import { DEFAULT_AUTH_REDIRECT } from '@/constants/routes.constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<Icon icon={ICON_SET.LOADING} className="size-20" aria-hidden="true" />}>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
        </Suspense>
    );
}

const AuthLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const searchParams = useSearchParams();
    const callBackUrl = searchParams.get('callbackUrl');

    const signInSocial = async (provider: 'google' | 'github') => {
        await signIn(provider, {
            callbackUrl: callBackUrl ? decodeURIComponent(callBackUrl) : DEFAULT_AUTH_REDIRECT,
        });
    };

    return (
        <section className="bg-primary h-calc-full-height flex items-center justify-center px-4">
            <div className="shadow-floating-sm from-secondary to-tertiary w-full max-w-md rounded-2xl bg-linear-150 from-15% to-85% p-6">
                <Suspense fallback={<Icon icon={ICON_SET.LOADING} className="size-20" aria-hidden="true" />}>{children}</Suspense>

                {/* Divider */}
                <div className="mt-4 flex items-center gap-2">
                    <hr className="flex-1" />
                    <span className="text-text-secondary text-sm">or</span>
                    <hr className="flex-1" />
                </div>

                {/* Social Sign-In Buttons */}
                <div className="mt-4 flex justify-center gap-3">
                    <button
                        title="Sign in with Google"
                        onClick={() => signInSocial('google')}
                        className="button w-full rounded-xl"
                        aria-label="Sign in with Google">
                        <Icon icon={ICON_SET.GOOGLE} className="size-7" />
                        <span className="sr-only text-sm sm:not-sr-only">Sign in with Google</span>
                    </button>
                    <button
                        title="Sign in with GitHub"
                        onClick={() => signInSocial('github')}
                        className="button w-full rounded-xl"
                        aria-label="Sign in with GitHub">
                        <Icon icon={ICON_SET.GITHUB} className="size-7" />
                        <span className="sr-only text-sm sm:not-sr-only">Sign in with GitHub</span>
                    </button>
                </div>
            </div>
        </section>
    );
};
