import LoginInForm from '@/components/layout/auth/Login';
import { APP_ROUTES } from '@/constants/routes.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | The Mimic Box',
    description: 'Sign in to your account on The Mimic Box. Secure and easy access to your dashboard.',
    openGraph: {
        title: 'Login | The Mimic Box',
        description: 'Sign in to your account on The Mimic Box. Secure and easy access to your dashboard.',
        url: `${process.env.NEXT_PUBLIC_URL}${APP_ROUTES.AUTH.LOGIN}`,
        type: 'website',
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
                width: 1200,
                height: 630,
                alt: 'The Mimic Box Logo',
            },
        ],
        siteName: 'The Mimic Box',
        locale: 'en_US',
    },
};

export default function SignInPage() {
    return <LoginInForm />;
}
