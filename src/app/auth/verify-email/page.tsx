import VerifyEmail from '@/components/layout/auth/VerifyEmail';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Verify Your Email | The Mimic Box',
    description: 'Verify your email to complete your registration on The Mimic Box.',
};

export default function VerifyEmailPage() {
    return <VerifyEmail />;
}
