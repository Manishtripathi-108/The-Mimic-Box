'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
    document.addEventListener('visibilitychange', callback);
    return () => document.removeEventListener('visibilitychange', callback);
};

const getSnapshot = () => document.visibilityState === 'visible';
const getServerSnapshot = () => true; // assume visible by default on server

export function usePageVisible() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
