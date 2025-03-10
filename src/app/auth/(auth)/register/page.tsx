import RegisterForm from '@/components/layout/auth/Register';
import { APP_ROUTES } from '@/constants/routes.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register | The Mimic Box',
    description: 'Create an account on The Mimic Box to get started. Join us today!',
    openGraph: {
        title: 'Register | The Mimic Box',
        description: 'Create an account on The Mimic Box to get started. Join us today!',
        url: `${process.env.NEXT_PUBLIC_URL}${APP_ROUTES.AUTH.REGISTER}`,
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

export default function RegisterPage() {
    return <RegisterForm />;
}
