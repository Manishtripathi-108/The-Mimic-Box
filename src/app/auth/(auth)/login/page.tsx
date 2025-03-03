import LoginInForm from '@/components/layout/auth/Login';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | The Mimic Box',
    description: 'Sign in to your account on The Mimic Box. Secure and easy access to your dashboard.',
};

export default function SignInPage() {
    return <LoginInForm />;
}
