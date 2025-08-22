'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { LinkedAccountProvider } from '@/lib/generated/prisma';

import ErrorCard from '@/components/layout/ErrorCard';
import { ConnectAccount } from '@/components/ui/LinkedAccountButtons';
import ErrorHandler from '@/lib/utils/ErrorHandler.utils';

const Page = () => {
    return (
        <main className="h-calc-full-height grid place-items-center">
            <Suspense fallback={<div>Loading...</div>}>
                <LinkAccountError />
            </Suspense>
        </main>
    );
};

const LinkAccountError = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const linkAccountType = searchParams.get('linkAccountType');
    const errorMessage = ErrorHandler.getMessage(error);

    return (
        <ErrorCard message={errorDescription || errorMessage}>
            {linkAccountType && <ConnectAccount className="button" account={linkAccountType as LinkedAccountProvider} />}
        </ErrorCard>
    );
};

export default Page;
