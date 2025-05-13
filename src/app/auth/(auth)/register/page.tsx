import { Metadata } from 'next';

import RegisterForm from '@/app/auth/_components/Register';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create an account on The Mimic Box to get started. Join us today!',
    openGraph: {
        title: 'Register',
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

const Page = () => {
    return <RegisterForm />;
};

export default Page;
