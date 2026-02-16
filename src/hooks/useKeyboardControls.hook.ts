'use client';

import { useCallback, useEffect } from 'react';

import { isBrowser } from '@/lib/utils/core.utils';

type T_KeyboardControlsConfig = {
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleMute: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setVolume: (volume: number) => void;
    seekTo: (time: number) => void;
    getAudioElement: () => HTMLAudioElement | null;
    volume: number;
    enabled?: boolean;
};

const SEEK_STEP = 5; // seconds
const VOLUME_STEP = 0.1; // 10%

/**
 * Hook to add global keyboard controls for music playback.
 *
 * Keyboard shortcuts:
 * - Space: Toggle play/pause
 * - Arrow Left: Seek backward 5 seconds
 * - Arrow Right: Seek forward 5 seconds
 * - Arrow Up: Increase volume by 10%
 * - Arrow Down: Decrease volume by 10%
 * - M: Toggle mute
 * - N: Next track
 * - P: Previous track
 * - L: Toggle loop
 * - S: Toggle shuffle
 */
const useKeyboardControls = ({
    togglePlay,
    playNext,
    playPrevious,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    setVolume,
    seekTo,
    getAudioElement,
    volume,
    enabled = true,
}: T_KeyboardControlsConfig) => {
    const isInputElement = useCallback((target: EventTarget | null): boolean => {
        if (!target || !(target instanceof HTMLElement)) return false;

        const tagName = target.tagName.toLowerCase();
        const isEditable = target.isContentEditable;
        const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';

        return isEditable || isInput;
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            // Don't handle if user is typing in an input field
            if (isInputElement(e.target)) return;

            const audio = getAudioElement();
            const key = e.key.toLowerCase();

            switch (key) {
                case ' ': // Space - Toggle play/pause
                    e.preventDefault();
                    togglePlay();
                    break;

                case 'arrowleft': // Seek backward
                    e.preventDefault();
                    if (audio) {
                        const newTime = Math.max(0, audio.currentTime - SEEK_STEP);
                        seekTo(newTime);
                    }
                    break;

                case 'arrowright': // Seek forward
                    e.preventDefault();
                    if (audio) {
                        const newTime = Math.min(audio.duration || 0, audio.currentTime + SEEK_STEP);
                        seekTo(newTime);
                    }
                    break;

                case 'arrowup': // Volume up
                    e.preventDefault();
                    setVolume(Math.min(1, volume + VOLUME_STEP));
                    break;

                case 'arrowdown': // Volume down
                    e.preventDefault();
                    setVolume(Math.max(0, volume - VOLUME_STEP));
                    break;

                case 'm': // Toggle mute
                    e.preventDefault();
                    toggleMute();
                    break;

                case 'n': // Next track
                    e.preventDefault();
                    playNext();
                    break;

                case 'p': // Previous track
                    e.preventDefault();
                    playPrevious();
                    break;

                case 'l': // Toggle loop
                    e.preventDefault();
                    toggleLoop();
                    break;

                case 's': // Toggle shuffle
                    e.preventDefault();
                    toggleShuffle();
                    break;

                default:
                    break;
            }
        },
        [isInputElement, getAudioElement, togglePlay, seekTo, setVolume, volume, toggleMute, playNext, playPrevious, toggleLoop, toggleShuffle]
    );

    useEffect(() => {
        if (!isBrowser || !enabled) return;

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, handleKeyDown]);
};

export default useKeyboardControls;
