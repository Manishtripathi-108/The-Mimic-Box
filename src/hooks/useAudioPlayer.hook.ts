import { useCallback, useEffect, useRef, useState } from 'react';

// Declare global audioPlayer interface
declare global {
    interface Window {
        audioPlayer?: {
            play: () => void;
            pause: () => void;
            togglePlay: () => void;
            toggleFadePlay: (fadeDuration?: number) => void;
            audioEl: HTMLAudioElement | null;
        };
    }
}

// Define the audio player state shape
type AudioPlayerState = {
    playing: boolean;
    loading: boolean;
    error: string | null;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
    playbackRate: number;
    buffered: TimeRanges | null;
};

type UseAudioPlayerOptions = {
    src: string;
    preloadNext?: string;
    onEnd?: () => void;
    onError?: (error: string) => void;
};

const useAudioPlayer = ({ src, preloadNext, onEnd, onError }: UseAudioPlayerOptions) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const preloadRef = useRef<HTMLAudioElement | null>(null);
    const preloadNextRef = useRef(preloadNext);
    const onEndRef = useRef(onEnd);
    const onErrorRef = useRef(onError);
    const lastUpdateRef = useRef(0);

    const [state, setState] = useState<AudioPlayerState>({
        playing: false,
        loading: true,
        error: null,
        currentTime: 0,
        duration: 0,
        volume: 1,
        muted: false,
        playbackRate: 1,
        buffered: null,
    });

    // Update refs on change
    useEffect(() => {
        preloadNextRef.current = preloadNext;
        onEndRef.current = onEnd;
        onErrorRef.current = onError;
    }, [preloadNext, onEnd, onError]);

    const updateState = useCallback((partial: Partial<AudioPlayerState>) => {
        setState((prev) => ({ ...prev, ...partial }));
    }, []);

    const setupAudio = useCallback(() => {
        if (!src) return () => {};

        const audio = new Audio(src);
        audioRef.current = audio;
        audio.preload = 'auto';

        const updateHandlers = () => {
            updateState({ duration: audio.duration, loading: false });
        };

        const updateTime = () => {
            const now = performance.now();
            if (now - lastUpdateRef.current < 500) return;
            lastUpdateRef.current = now;

            updateState({
                currentTime: audio.currentTime,
                buffered: audio.buffered,
            });

            if (preloadNextRef.current && audio.currentTime > audio.duration / 2 && preloadRef.current?.src !== preloadNextRef.current) {
                preloadRef.current = new Audio(preloadNextRef.current);
                preloadRef.current.preload = 'auto';
            }
        };

        const handleEnded = () => {
            updateState({ playing: false });
            onEndRef.current?.();
        };

        const handleError = () => {
            const error = audio?.error?.message || 'Playback error';
            updateState({ error, loading: false });
            onErrorRef.current?.(error);
        };

        const events: [keyof HTMLMediaElementEventMap, EventListener][] = [
            ['loadedmetadata', updateHandlers],
            ['timeupdate', updateTime],
            ['ended', handleEnded],
            ['error', handleError],
            ['waiting', () => updateState({ loading: true })],
            ['playing', () => updateState({ loading: false })],
        ];

        events.forEach(([event, handler]) => audio.addEventListener(event, handler));

        return () => {
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
            events.forEach(([event, handler]) => audio.removeEventListener(event, handler));
        };
    }, [src, updateState]);

    useEffect(() => {
        const cleanup = setupAudio();
        return cleanup;
    }, [setupAudio]);

    /* ------------------------------- Controls ------------------------------- */

    const fadeAudio = useCallback((toVol: number, duration = 400, cb?: () => void) => {
        const audio = audioRef.current;
        if (!audio) return;

        const currentVol = audio.volume;
        if (duration === 0 || currentVol === toVol) {
            audio.volume = toVol;
            cb?.();
            return;
        }

        const steps = 50;
        const delta = (toVol - currentVol) / (duration / steps);
        let vol = currentVol;

        const interval = setInterval(() => {
            vol += delta;
            audio.volume = Math.max(0, Math.min(1, vol));

            const done = (delta > 0 && vol >= toVol) || (delta < 0 && vol <= toVol);
            if (done) {
                clearInterval(interval);
                audio.volume = toVol;
                cb?.();
            }
        }, steps);
    }, []);

    const play = useCallback(async () => {
        try {
            await audioRef.current?.play();
            updateState({ playing: true });
        } catch (err) {
            updateState({ error: err as string });
        }
    }, [updateState]);

    const pause = useCallback(() => {
        audioRef.current?.pause();
        updateState({ playing: false });
    }, [updateState]);

    const toggleFadePlay = useCallback(
        (fadeDuration = 500) => {
            const audio = audioRef.current;
            if (!audio) return;

            if (audio.paused) {
                audio.volume = 0;
                audio.play().then(() => fadeAudio(state.volume, fadeDuration));
                updateState({ playing: true });
            } else {
                fadeAudio(0, fadeDuration, () => {
                    audio.pause();
                    audio.volume = state.volume;
                });
                updateState({ playing: false });
            }
        },
        [fadeAudio, updateState, state.volume]
    );

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) play();
        else pause();
    }, [play, pause]);

    const seekTo = useCallback(
        (time: number) => {
            if (audioRef.current) {
                audioRef.current.currentTime = time;
                updateState({ currentTime: time });
            }
        },
        [updateState]
    );

    const setVolume = useCallback(
        (volume: number) => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                updateState({ volume });
            }
        },
        [updateState]
    );

    const setPlaybackRate = useCallback(
        (rate: number) => {
            if (audioRef.current) {
                audioRef.current.playbackRate = rate;
                updateState({ playbackRate: rate });
            }
        },
        [updateState]
    );

    const toggleMute = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !audio.muted;
            updateState({ muted: audio.muted });
        }
    }, [updateState]);

    return {
        ...state,
        play,
        pause,
        togglePlay,
        toggleFadePlay,
        seekTo,
        setVolume,
        setPlaybackRate,
        toggleMute,
        audioEl: audioRef,
    };
};

export default useAudioPlayer;
