import { useCallback, useEffect, useRef, useState } from 'react';

type AudioPlayerState = {
    playing: boolean;
    loading: boolean;
    error: string | null;
    currentTime: number;
    duration: number;
    volume: number;
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

    useEffect(() => {
        console.log('preloadNext, onEnd, onError');

        preloadNextRef.current = preloadNext;
        onEndRef.current = onEnd;
        onErrorRef.current = onError;
    }, [preloadNext, onEnd, onError]);

    const [state, setState] = useState<AudioPlayerState>({
        playing: false,
        loading: true,
        error: null,
        currentTime: 0,
        duration: 0,
        volume: 1,
        playbackRate: 1,
        buffered: null,
    });

    const updateState = useCallback((partial: Partial<AudioPlayerState>) => {
        setState((prev) => ({ ...prev, ...partial }));
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            updateState({ duration: audio.duration, loading: false });
        }
    }, [updateState]);

    const handleTimeUpdate = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        updateState({ currentTime: audio.currentTime, buffered: audio.buffered });

        const preloadNext = preloadNextRef.current;
        if (preloadNext && audio.currentTime > audio.duration / 2 && preloadRef.current?.src !== preloadNext) {
            preloadRef.current = new Audio(preloadNext);
            preloadRef.current.preload = 'auto';
        }
    }, [updateState]);

    const handleEnded = useCallback(() => {
        updateState({ playing: false });
        onEndRef.current?.();
    }, [updateState]);

    const handleError = useCallback(() => {
        const audio = audioRef.current;
        const error = audio?.error?.message || 'Playback error';
        updateState({ error, loading: false });
        onErrorRef.current?.(error);
    }, [updateState]);

    const handleWaiting = useCallback(() => updateState({ loading: true }), [updateState]);
    const handlePlaying = useCallback(() => updateState({ loading: false }), [updateState]);

    const setupAudio = useCallback(() => {
        if (!src) return () => {};

        const audio = new Audio(src);
        audioRef.current = audio;
        audio.preload = 'auto';

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('playing', handlePlaying);

        return () => {
            console.log('src, handleLoadedMetadata, handleTimeUpdate, handleEnded, handleError, handleWaiting, handlePlaying');

            audio.pause();
            audio.removeAttribute('src');
            audio.load();
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('playing', handlePlaying);
        };
    }, [src, handleLoadedMetadata, handleTimeUpdate, handleEnded, handleError, handleWaiting, handlePlaying]);

    useEffect(() => {
        const cleanup = setupAudio();
        return cleanup;
    }, [setupAudio]);

    /* ------------------------------- Controls ------------------------------- */
    const fadeAudio = useCallback((to: number, duration = 300) => {
        const el = audioRef.current;
        if (!el) return;

        const from = el.volume;
        const diff = to - from;
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            el.volume = from + diff * progress;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, []);

    const play = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio
            .play()
            .then(() => updateState({ playing: true }))
            .catch((err) => updateState({ error: err.message }));
    }, [updateState]);

    const pause = useCallback(() => {
        audioRef.current?.pause();
        updateState({ playing: false });
    }, [updateState]);

    const toggleFadePlay = useCallback(
        (fadeDuration = 400) => {
            const audio = audioRef.current;
            if (!audio) return;

            if (audio.paused) {
                audio.play().then(() => fadeAudio(audio.volume, fadeDuration));
                updateState({ playing: true });
            } else {
                fadeAudio(0, fadeDuration);
                audio.pause();
                updateState({ playing: false });
            }
        },
        [fadeAudio, updateState]
    );

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) play();
        else pause();
    }, [play, pause]);

    const seek = useCallback(
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

    const setRate = useCallback(
        (rate: number) => {
            if (audioRef.current) {
                audioRef.current.playbackRate = rate;
                updateState({ playbackRate: rate });
            }
        },
        [updateState]
    );

    const toggleMute = useCallback(() => {
        if (audioRef.current) {
            const audio = audioRef.current;
            audio.muted = !audio.muted;
            updateState({ volume: audio.muted ? 0 : audio.volume });
        }
    }, [updateState]);

    return {
        ...state,
        play,
        pause,
        togglePlay,
        toggleFadePlay,
        seek,
        setVolume,
        setRate,
        toggleMute,
        audioEl: audioRef,
    };
};

export default useAudioPlayer;
