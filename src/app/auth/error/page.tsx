'use client';

import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'next/navigation';

export default function AuthError() {
    const router = useRouter();

    const handleRedirect = () => {
        router.push(APP_ROUTES.AUTH.LOGIN);
    };

    return (
        <div className="h-calc-full-height flex items-center justify-center">
            <div className="shadow-neumorphic-sm text-text-primary grid max-w-sm place-items-center rounded-xl p-6">
                <Icon icon={ICON_SET.ERROR} className="size-20" />
                <h2 className="font-semibold">Something went wrong. Please log in again.</h2>
                <button onClick={handleRedirect} className="button mt-5">
                    Return to Login
                </button>
            </div>
        </div>
    );
}
