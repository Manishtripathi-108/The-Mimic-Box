import ResetPasswordForm from '@/components/layout/auth/ResetPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password | The Mimic Box',
    description: 'Reset your password',
};

export default function ResetPassword() {
    return <ResetPasswordForm />;
}
