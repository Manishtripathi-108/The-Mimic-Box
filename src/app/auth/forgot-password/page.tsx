import ForgotPasswordForm from '@/components/layout/auth/ForgotPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forgot Password | The Mimic Box',
    description: 'Forgot your password? No worries! Reset your password in a few easy steps.',
};

export default function ForgotPassword() {
    return <ForgotPasswordForm />;
}
