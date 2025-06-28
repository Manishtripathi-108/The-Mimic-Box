'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { signIn } from 'next-auth/react';

import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { DEFAULT_AUTH_REDIRECT } from '@/constants/routes/auth.routes';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense fallback={<Icon icon="loading" className="size-20" />}>
            <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
        </Suspense>
    );
};

export default Layout;

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
                <Suspense fallback={<Icon icon="loading" className="size-20" />}>{children}</Suspense>

                {/* Divider */}
                <div className="mt-4 flex items-center gap-2">
                    <hr className="flex-1" />
                    <span className="text-text-secondary text-sm">or</span>
                    <hr className="flex-1" />
                </div>

                {/* Social Sign-In Buttons */}
                <div className="mt-4 flex justify-center gap-3">
                    <Button
                        title="Sign in with Google"
                        aria-label="Sign in with Google"
                        onClick={() => signInSocial('google')}
                        className="w-full"
                        size="lg"
                        icon="google">
                        <span className="sr-only text-sm sm:not-sr-only">Sign in with Google</span>
                    </Button>

                    <Button
                        title="Sign in with GitHub"
                        aria-label="Sign in with GitHub"
                        onClick={() => signInSocial('github')}
                        className="w-full"
                        size="lg"
                        icon="github">
                        <span className="sr-only text-sm sm:not-sr-only">Sign in with GitHub</span>
                    </Button>
                </div>
            </div>
        </section>
    );
};
