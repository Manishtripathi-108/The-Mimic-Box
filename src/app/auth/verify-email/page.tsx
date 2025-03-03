import VerifyEmail from '@/components/layout/auth/VerifyEmail';
import { APP_ROUTES } from '@/constants/routes.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Verify Your Email | The Mimic Box',
    description: 'Verify your email to complete your registration on The Mimic Box.',
    openGraph: {
        title: 'Verify Your Email | The Mimic Box',
        description: 'Verify your email to complete your registration on The Mimic Box.',
        url: `${process.env.NEXT_PUBLIC_URL}${APP_ROUTES.AUTH.VERIFY_EMAIL}`,
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

export default function VerifyEmailPage() {
    return <VerifyEmail />;
}
