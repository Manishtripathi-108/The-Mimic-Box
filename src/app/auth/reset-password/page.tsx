import { Suspense } from 'react';

import { Metadata } from 'next';

import { Icon } from '@iconify/react';

import ResetPasswordForm from '@/components/layout/auth/ResetPassword';
import ICON_SET from '@/constants/icons';

export const metadata: Metadata = {
    title: 'Reset Password | The Mimic Box',
    description: 'Reset your password',
};

export default function ResetPassword() {
    return (
        <Suspense fallback={<Icon icon={ICON_SET.LOADING} className="size-20" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
