'use client';

import { Icon } from '@iconify/react';
import ICON_SET from '@/constants/icons';
import { DEFAULT_AUTH_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const signInSocial = async (provider: 'google' | 'github') => {
        await signIn(provider, {
            callbackUrl: DEFAULT_AUTH_REDIRECT,
        });
    };

    return (
        <div className="bg-primary h-calc-full-height flex items-center justify-center px-4">
            <div className="bg-primary shadow-neumorphic-sm w-full max-w-md rounded-2xl p-6">
                {children}

                <div className="mt-2 flex items-center gap-2">
                    <div className="bg-secondary h-px flex-1"></div>
                    <span className="text-text-secondary text-sm">or</span>
                    <div className="bg-secondary h-px flex-1"></div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => signInSocial('google')}
                        className="shadow-neumorphic-xs text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-center rounded-xl py-2 transition hover:scale-105">
                        <Icon icon={ICON_SET.GOOGLE} className="size-7" />
                        <span className="sr-only">Sign in with Google</span>
                    </button>
                    <button
                        onClick={() => signInSocial('github')}
                        className="shadow-neumorphic-xs text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-center rounded-xl py-2 transition hover:scale-105">
                        <Icon icon={ICON_SET.GITHUB} className="size-7" />
                        <span className="sr-only">Sign in with GitHub</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
