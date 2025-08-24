import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';

const AuthError = () => {
    return (
        <main className="h-calc-full-height flex items-center justify-center">
            <article className="shadow-floating-sm text-text-primary bg-gradient-secondary-to-tertiary grid w-full max-w-md place-items-center space-y-5 rounded-2xl p-6">
                <Icon icon="error" className="shadow-floating-xs bg-primary size-16 rounded-full" />
                <h2 className="text-center font-semibold">An unexpected error occurred. Please log in again.</h2>
                <Button asChild>
                    <Link href={DEFAULT_AUTH_ROUTE} replace>
                        Return to Login
                    </Link>
                </Button>
            </article>
        </main>
    );
};

export default AuthError;
