'use client';

import { useEffect, useState } from 'react';

/**
 * A hook that returns a boolean indicating if the browser is currently online.
 */
const useNetworkStatus = (): boolean | null => {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);

    useEffect(() => {
        const handleOnline = (): void => setIsOnline(true);
        const handleOffline = (): void => setIsOnline(false);

        // Check connection status on mount
        setIsOnline(window.navigator.onLine);

        // Add event listeners for online and offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};

export default useNetworkStatus;
