'use client';

import { useEffect } from 'react';

import { isBrowser } from '@/lib/utils/core.utils';

type T_MediaCover = {
    url: string;
    quality: string;
};

type T_MediaMetadata = {
    title: string;
    artist?: string;
    album?: string;
    covers?: T_MediaCover[];
};

type T_MediaSessionActions = {
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
    getAudioElement: () => HTMLAudioElement | null;
};

const useMediaSession = (current: T_MediaMetadata | null, actions: T_MediaSessionActions) => {
    useEffect(() => {
        if (!isBrowser || !current || !('mediaSession' in navigator)) return;

        const { play, pause, next, previous, getAudioElement } = actions;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: current.title,
            artist: current.artist || '',
            album: current.album || '',
            artwork:
                current.covers?.map((cover) => ({
                    src: cover.url,
                    sizes: cover.quality,
                    type: 'image/png',
                })) || [],
        });

        navigator.mediaSession.setActionHandler('play', play);
        navigator.mediaSession.setActionHandler('pause', pause);
        navigator.mediaSession.setActionHandler('previoustrack', previous);
        navigator.mediaSession.setActionHandler('nexttrack', next);

        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            const skipTime = details.seekOffset ?? 10;
            const audioEl = getAudioElement();
            if (audioEl) {
                audioEl.currentTime = Math.max(0, audioEl.currentTime - skipTime);
            }
        });

        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            const skipTime = details.seekOffset ?? 10;
            const audioEl = getAudioElement();
            if (audioEl) {
                audioEl.currentTime = Math.min(audioEl.duration, audioEl.currentTime + skipTime);
            }
        });

        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (details.fastSeek && 'fastSeek' in HTMLMediaElement.prototype) {
                getAudioElement()?.fastSeek?.(details.seekTime || 0);
            } else {
                const audioEl = getAudioElement();
                if (audioEl) {
                    audioEl.currentTime = details.seekTime || 0;
                }
            }
        });

        return () => {
            const actions: MediaSessionAction[] = ['play', 'pause', 'previoustrack', 'nexttrack', 'seekbackward', 'seekforward', 'seekto'];
            actions.forEach((action) => {
                navigator.mediaSession.setActionHandler(action, null);
            });
        };
    }, [current, actions]);
};

export default useMediaSession;
