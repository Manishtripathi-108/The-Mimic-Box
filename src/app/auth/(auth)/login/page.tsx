import { Metadata } from 'next';

import LoginInForm from '@/app/auth/_components/Login';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Sign in to your account on The Mimic Box. Secure and easy access to your dashboard.',
};

export default function SignInPage() {
    return <LoginInForm />;
}
