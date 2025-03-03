import AuthError from '@/components/layout/auth/AuthError';

export const metadata = {
    title: 'Error | The Mimic Box',
    description: 'An unexpected error occurred. Please log in again.',
};

export default function AuthErrorPage() {
    return <AuthError />;
}
