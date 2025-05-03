'use client';

import useNetworkStatus from '@/hooks/useNetworkStatus';

const Page = () => {
    const isOnline = useNetworkStatus();

    return (
        <div className="h-calc-full-height grid place-items-center">
            <h1 className="text-accent font-karla text-center text-4xl">
                {isOnline === null ? 'Checking connection...' : isOnline ? 'You are online' : 'You are offline'}
            </h1>
        </div>
    );
};

export default Page;
