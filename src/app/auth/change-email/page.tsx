import { Suspense } from 'react';

import { Metadata } from 'next';

import { Icon } from '@iconify/react';

import VerifyEmail from '@/components/layout/auth/VerifyEmail';
import ICON_SET from '@/constants/icons';

export const metadata: Metadata = {
    title: 'Verify Your Email | The Mimic Box',
    description: 'Verify your email to change your email on The Mimic Box.',
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<Icon icon={ICON_SET.LOADING} className="size-20" />}>
            <VerifyEmail type="change" />
        </Suspense>
    );
}
