'use client';

import { useEffect } from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';

import ICON_SET from '@/constants/icons';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="bg-primary h-calc-full-height grid place-items-center rounded-lg p-6 text-center">
                <div className="to-tertiary shadow-floating-xs from-secondary flex max-w-md flex-col items-center justify-start rounded-2xl bg-linear-150 p-4">
                    <div className="flex w-full items-start justify-end gap-1.5">
                        <div className="size-2 rounded-full bg-white hover:bg-gray-200"></div>
                        <div className="size-2 rounded-full bg-white opacity-50"></div>
                    </div>

                    <Icon icon={ICON_SET.ERROR} className="size-28" />

                    <div className="mb-6 w-full text-center">
                        <h1 className="font-bold tracking-wider text-red-500">Error!</h1>
                        <p className="text-sm tracking-wide text-gray-500">{error.message || 'Oh no, something went wrong.'}</p>
                    </div>

                    <button onClick={() => reset()} className="button">
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
