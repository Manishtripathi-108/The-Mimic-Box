import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes.constants';

const AuthError = () => {
    return (
        <main className="h-calc-full-height flex items-center justify-center">
            <article className="shadow-floating-sm from-secondary to-tertiary text-text-primary grid w-full max-w-md place-items-center space-y-5 rounded-2xl bg-linear-150 from-15% to-85% p-6">
                <Icon icon="error" className="shadow-floating-xs bg-primary size-16 rounded-full" />
                <h2 className="text-center font-semibold">An unexpected error occurred. Please log in again.</h2>
                <Link href={DEFAULT_AUTH_ROUTE} replace className="button">
                    Return to Login
                </Link>
            </article>
        </main>
    );
};

export default AuthError;
