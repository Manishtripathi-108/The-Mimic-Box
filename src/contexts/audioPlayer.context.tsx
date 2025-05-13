'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import useMediaSession from '@/hooks/useMediaSession.hook.';
import { T_AudioPlayerState, T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import { audioPlayerInitialState, audioPlayerReducer } from '@/reducers/audioPlayer.reducer';

// Types
export type AudioPlayerState = {
    playing: boolean;
    loading: boolean;
    duration: number;
    volume: number;
    muted: boolean;
    loop: boolean;
    playbackRate: number;
};

export type T_AudioPlayerContext = {
    getAudioElement: () => HTMLAudioElement | null;
    current: T_AudioPlayerTrack | null;
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    toggleFadePlay: (fadeDuration?: number) => void;
    next: () => void;
    previous: () => void;
    clearQueue: () => void;
    setQueue: (tracks: T_AudioPlayerTrack[], context?: T_TrackContext | null, autoPlay?: boolean) => void;
    addToQueue: (tracks: T_AudioPlayerTrack[]) => void;
    toggleShuffle: () => void;
    toggleLoop: () => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setRate: (rate: number) => void;
    seek: (time: number) => void;
} & T_AudioPlayerState &
    AudioPlayerState;

const AudioPlayerContext = createContext({} as T_AudioPlayerContext);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
    // Reducer state
    const [playerState, dispatch] = useReducer(audioPlayerReducer, audioPlayerInitialState);
    const { queue, currentTrackIndex, playbackOrder } = playerState;

    // Audio DOM and internal state
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioState, setAudioState] = useState<AudioPlayerState>({
        playing: false,
        loading: false,
        duration: 0,
        volume: 1,
        muted: false,
        loop: false,
        playbackRate: 1,
    });

    // Current track and audio source
    const current = useMemo(() => queue[currentTrackIndex] || null, [queue, currentTrackIndex]);
    const src = useMemo(() => current?.urls.find((url) => url.quality === '320kbps')?.url || current?.urls[0]?.url, [current]);
    const currentIndex = useMemo(() => playbackOrder.indexOf(currentTrackIndex), [playbackOrder, currentTrackIndex]);
    const isLastTrackInQueue = useMemo(() => currentIndex === playbackOrder.length - 1, [currentIndex, playbackOrder]);

    // Utilities: Update audio state
    const updateAudioState = useCallback((updates: Partial<AudioPlayerState>) => {
        setAudioState((prev) => ({ ...prev, ...updates }));
    }, []);

    // Utilities: Audio fade in/out
    const fadeAudio = useCallback((toVol: number, duration = 400, cb?: () => void) => {
        const audio = audioRef.current;
        if (!audio) return;

        const steps = 50;
        const currentVol = audio.volume;
        if (duration === 0 || currentVol === toVol) {
            audio.volume = toVol;
            cb?.();
            return;
        }

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

    // Playback controls
    const play = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio?.src) return;
        try {
            await audio.play();
            updateAudioState({ playing: true });
        } catch (err) {
            console.warn('Play error:', err);
            updateAudioState({ playing: false });
        }
    }, [updateAudioState]);

    const pause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio?.src) return;
        audio.pause();
        updateAudioState({ playing: false });
    }, [updateAudioState]);

    const togglePlay = useCallback(() => {
        if (audioRef.current?.paused) play();
        else pause();
    }, [play, pause]);

    const toggleFadePlay = useCallback(
        (fadeDuration = 500) => {
            const audio = audioRef.current;
            if (!audio) return;

            if (audio.paused) {
                audio.volume = 0;
                audio.play().then(() => fadeAudio(audioState.volume, fadeDuration));
                updateAudioState({ playing: true });
            } else {
                fadeAudio(0, fadeDuration, () => {
                    audio.pause();
                    audio.volume = audioState.volume;
                });
                updateAudioState({ playing: false });
            }
        },
        [fadeAudio, updateAudioState, audioState.volume]
    );

    // Audio attribute controls
    const seek = useCallback((time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
    }, []);

    const setVolume = useCallback(
        (volume: number) => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                updateAudioState({ volume });
            }
        },
        [updateAudioState]
    );

    const setRate = useCallback(
        (rate: number) => {
            if (audioRef.current) {
                audioRef.current.playbackRate = rate;
                updateAudioState({ playbackRate: rate });
            }
        },
        [updateAudioState]
    );

    const toggleMute = useCallback(() => {
        if (audioRef.current) {
            const newMuted = !audioRef.current.muted;
            audioRef.current.muted = newMuted;
            updateAudioState({ muted: newMuted });
        }
    }, [updateAudioState]);

    const toggleLoop = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.loop) {
            audio.loop = false;
            updateAudioState({ loop: false });
        } else {
            audio.loop = true;
            updateAudioState({ loop: true });
        }
    }, [updateAudioState]);

    // Queue controls
    const setQueue = useCallback(
        (tracks: T_AudioPlayerTrack[], context: T_TrackContext | null = null, autoPlay = false) => {
            dispatch({ type: 'SET_QUEUE', payload: { tracks, context } });
            if (autoPlay) setTimeout(play, 500);
        },
        [play]
    );

    const addToQueue = useCallback((tracks: T_AudioPlayerTrack[]) => {
        dispatch({ type: 'ADD_TO_QUEUE', payload: tracks });
    }, []);

    const clearQueue = useCallback(() => {
        pause();
        dispatch({ type: 'CLEAR_QUEUE' });
    }, [pause]);

    const next = useCallback(() => {
        dispatch({ type: 'NEXT_TRACK' });
    }, []);

    const previous = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.currentTime > 5 || queue.length <= 1) {
            audio.currentTime = 0;
        } else {
            dispatch({ type: 'PREV_TRACK' });
        }
    }, [queue]);

    const toggleShuffle = useCallback(() => {
        dispatch({ type: 'TOGGLE_SHUFFLE' });
    }, []);

    // MediaSession API
    useMediaSession(
        {
            title: current?.title || '',
            artist: current?.artists || '',
            album: current?.album || '',
            covers: current?.covers,
        },
        {
            play,
            pause,
            next,
            previous,
            getAudioElement: () => audioRef.current,
        }
    );

    // Audio initialization
    const setupAudio = useCallback(() => {
        if (!src) return;

        const audio = new Audio(src);
        audioRef.current = audio;
        audio.preload = 'auto';

        const onLoadedMetadata = () => updateAudioState({ duration: audio.duration, loading: false });
        const onPlaying = () => updateAudioState({ loading: false });
        const onWaiting = () => updateAudioState({ loading: true });
        const onError = () => updateAudioState({ loading: false });
        const onEnded = () => {
            if (audio.loop) return;
            audio.currentTime = 0;

            next();
        };

        const events: [keyof HTMLMediaElementEventMap, EventListener][] = [
            ['loadedmetadata', onLoadedMetadata],
            ['playing', onPlaying],
            ['waiting', onWaiting],
            ['error', onError],
            ['ended', onEnded],
        ];

        events.forEach(([event, handler]) => audio.addEventListener(event, handler));

        return () => {
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
            events.forEach(([event, handler]) => audio.removeEventListener(event, handler));
        };
    }, [src, updateAudioState, next]);

    useEffect(() => {
        const cleanup = setupAudio();
        return cleanup;
    }, [setupAudio]);

    useEffect(() => {
        const wasPlaying = audioState.playing;
        if (wasPlaying) setTimeout(play, 100);
    }, [src, audioState.playing, play]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const pauseIfLastTrack = () => {
            if (isLastTrackInQueue) updateAudioState({ playing: false });
        };

        audio.addEventListener('ended', pauseIfLastTrack);

        return () => audio.removeEventListener('ended', pauseIfLastTrack);
    }, [isLastTrackInQueue, updateAudioState]);

    return (
        <AudioPlayerContext.Provider
            value={{
                getAudioElement: () => audioRef.current,
                current,
                ...playerState,
                ...audioState,
                play,
                pause,
                togglePlay,
                toggleFadePlay,
                next,
                previous,
                clearQueue,
                setQueue,
                addToQueue,
                toggleShuffle,
                toggleLoop,
                setVolume,
                setRate,
                toggleMute,
                seek,
            }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);
