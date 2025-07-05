'use client';

import { useEffect, useState } from 'react';

import Button from '@/components/ui/Button';

// Define the BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWAButton = ({ className }: { className?: string }) => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt || !(deferredPrompt as BeforeInstallPromptEvent).prompt) return;

        const promptEvent = deferredPrompt as BeforeInstallPromptEvent;
        promptEvent.prompt();

        const choiceResult = await promptEvent.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('PWA setup accepted');
        } else {
            console.log('PWA setup dismissed');
        }

        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <Button onClick={handleInstallClick} className={className}>
            Install App
        </Button>
    );
};

export default InstallPWAButton;
