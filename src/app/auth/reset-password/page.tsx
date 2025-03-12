import { Metadata } from 'next';

import ResetPasswordForm from '@/components/layout/auth/ResetPassword';

export const metadata: Metadata = {
    title: 'Reset Password | The Mimic Box',
    description: 'Reset your password',
};

export default function ResetPassword() {
    return <ResetPasswordForm />;
}
