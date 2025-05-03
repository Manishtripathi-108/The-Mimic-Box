import AuthError from '@/app/auth/_components/AuthError';

export const metadata = {
    title: 'Error',
    description: 'An unexpected error occurred. Please log in again.',
};

const Page = () => {
    return <AuthError />;
};

export default Page;
