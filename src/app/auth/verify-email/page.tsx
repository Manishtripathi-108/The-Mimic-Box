import { Suspense } from 'react';

import { Metadata } from 'next';

import VerifyEmail from '@/app/auth/_components/VerifyEmail';
import Icon from '@/components/ui/Icon';

export const metadata: Metadata = {
    title: 'Verify Your Email',
    description: 'Verify your email to complete your registration on The Mimic Box.',
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<Icon icon="loading" className="size-20" />}>
            <VerifyEmail type="verify" />
        </Suspense>
    );
}
