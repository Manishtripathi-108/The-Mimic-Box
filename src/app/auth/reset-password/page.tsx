import { Suspense } from 'react';

import { Metadata } from 'next';

import ResetPasswordForm from '@/app/auth/_components/ResetPassword';
import Icon from '@/components/ui/Icon';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your password',
};

export default function ResetPassword() {
    return (
        <Suspense fallback={<Icon icon="loading" className="size-20" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
