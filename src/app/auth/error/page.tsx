import AuthError from '@/app/auth/_components/AuthError';

export const metadata = {
    title: 'Error',
    description: 'An unexpected error occurred. Please log in again.',
};

export default function AuthErrorPage() {
    return <AuthError />;
}
