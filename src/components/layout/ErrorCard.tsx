'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const ErrorCard = ({
    message,
    reset,
    error,
    children,
}: {
    message: string;
    reset?: () => void;
    error?: Error & { digest?: string };
    children?: React.ReactNode;
}) => {
    useEffect(() => console.error(error), [error]);

    return (
        <div className="bg-primary h-calc-full-height grid place-items-center rounded-lg p-2 text-center sm:p-6">
            <div className="shadow-floating-xs bg-gradient-secondary-to-tertiary flex w-full max-w-md flex-col items-center justify-start rounded-2xl p-4">
                <div className="flex w-full items-start justify-end gap-1.5">
                    <div className="size-2 rounded-full bg-white hover:bg-gray-200"></div>
                    <div className="size-2 rounded-full bg-white opacity-50"></div>
                </div>

                <Icon icon="error" className="mb-2 size-28" />

                <div className="mb-6 w-full text-center">
                    <h1 className="text-danger font-bold tracking-wider">Error!</h1>
                    <p className="text-sm tracking-wide text-gray-500">{message || 'Oh no, something went wrong.'}</p>
                </div>

                {reset && !children && <Button onClick={() => reset()}>Try Again</Button>}
                {children}
            </div>
        </div>
    );
};

export default ErrorCard;
