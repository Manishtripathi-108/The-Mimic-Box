'use client';

import { useEffect } from 'react';

const ServiceWorkerRegister = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(() => console.log('Service Worker registered.'))
                .catch((err) => console.error('Service Worker registration failed:', err));
        }
    }, []);

    return null;
};

export default ServiceWorkerRegister;
