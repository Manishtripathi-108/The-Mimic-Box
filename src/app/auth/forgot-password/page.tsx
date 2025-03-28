import { Metadata } from 'next';

import ForgotPasswordForm from '@/components/layout/auth/ForgotPassword';

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Forgot your password? No worries! Reset your password in a few easy steps.',
};

export default function ForgotPassword() {
    return <ForgotPasswordForm />;
}
