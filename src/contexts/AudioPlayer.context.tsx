'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import toast from 'react-hot-toast';

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
    currentTrack: T_AudioPlayerTrack | null;
    play: () => void;
    pause: () => void;
    playTrackByIndex: (index: number) => void;
    playTrackById: (params: { saavnId?: string; spotifyId?: string }) => void;
    togglePlay: () => void;
    toggleFadePlay: (fadeDuration?: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    clearQueue: () => void;
    setQueue: (tracks: T_AudioPlayerTrack[], context?: T_TrackContext | null, autoPlay?: boolean) => void;
    addToQueue: (tracks: T_AudioPlayerTrack[], context?: T_TrackContext | null) => void;
    toggleShuffle: () => void;
    toggleLoop: () => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setPlaybackRate: (rate: number) => void;
    seekTo: (time: number) => void;
} & T_AudioPlayerState &
    AudioPlayerState;

const AudioPlayerContext = createContext({} as T_AudioPlayerContext);

export const useAudioPlayerContext = () => {
    const context = useContext(AudioPlayerContext);
    if (!context) throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
    return context;
};

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const retryCountRef = useRef(0);

    // Reducer state
    const [playerState, dispatch] = useReducer(audioPlayerReducer, audioPlayerInitialState);
    const { queue, currentTrackIndex, playbackOrder } = playerState;

    // Audio DOM and internal state
    const audioRef = useRef<HTMLAudioElement | null>(typeof Audio !== 'undefined' ? new Audio() : null);
    const [audioState, setAudioState] = useState<AudioPlayerState>({
        playing: false,
        loading: false,
        duration: 0,
        volume: 1,
        muted: false,
        loop: false,
        playbackRate: 1,
    });

    const currentTrack = useMemo(() => queue[currentTrackIndex] || null, [queue, currentTrackIndex]);
    const sortedUrls = useMemo(() => {
        if (!currentTrack) return [];
        return [...currentTrack.urls].sort((a, b) => {
            const getKbps = (q: string) => parseInt(q.replace('kbps', ''), 10) || 0;
            return getKbps(b.quality) - getKbps(a.quality);
        });
    }, [currentTrack]);

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

    const initAudioSource = useCallback(() => {
        const audio = audioRef.current;
        const src = sortedUrls[retryCountRef.current]?.url;
        if (!audio || !src) return false;

        audio.src = src;
        audio.preload = 'auto';
        return true;
    }, [sortedUrls]);

    const play = useCallback(() => audioRef.current?.play(), []);

    const pause = useCallback(() => {
        audioRef.current?.pause();
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
            } else {
                fadeAudio(0, fadeDuration, () => {
                    audio.pause();
                    audio.volume = audioState.volume;
                    updateAudioState({ playing: false });
                });
            }
        },
        [fadeAudio, audioState.volume, updateAudioState]
    );

    const playTrackByIndex = useCallback(
        (index: number) => {
            if (index < 0 || index >= queue.length) return;
            dispatch({ type: 'PLAY_INDEX', payload: index });
            setTimeout(play, 100);
        },
        [queue, play]
    );

    const playTrackById = useCallback(
        ({ saavnId, spotifyId }: { saavnId?: string; spotifyId?: string }) => {
            dispatch({ type: 'PLAY_ID', payload: { saavnId, spotifyId } });
            setTimeout(play, 100);
        },
        [play]
    );

    const seekTo = useCallback((time: number) => {
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

    const setPlaybackRate = useCallback((rate: number) => {
        if (audioRef.current) audioRef.current.playbackRate = rate;
    }, []);

    const toggleMute = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.muted = !audio.muted;
            updateAudioState({ muted: audio.muted });
        }
    }, [updateAudioState]);

    const toggleLoop = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.loop = !audio.loop;
            updateAudioState({ loop: audio.loop });
        }
    }, [updateAudioState]);

    const setQueue = useCallback(
        (tracks: T_AudioPlayerTrack[], context: T_TrackContext | null = null, autoPlay = false) => {
            console.log('Setting queue:', tracks);

            dispatch({ type: 'SET_QUEUE', payload: { tracks, context } });
            if (autoPlay) setTimeout(play, 500);
        },
        [play]
    );

    const addToQueue = useCallback((tracks: T_AudioPlayerTrack[], context: T_TrackContext | null = null) => {
        console.log('Adding to queue:', tracks);

        dispatch({ type: 'ADD_TO_QUEUE', payload: { tracks, context } });
    }, []);

    const clearQueue = useCallback(() => {
        pause();
        dispatch({ type: 'CLEAR_QUEUE' });
    }, [pause]);

    const playNext = useCallback(() => dispatch({ type: 'NEXT_TRACK' }), []);

    const playPrevious = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.currentTime > 5 || queue.length <= 1) audio.currentTime = 0;
        else dispatch({ type: 'PREV_TRACK' });
    }, [queue]);

    const toggleShuffle = useCallback(() => dispatch({ type: 'TOGGLE_SHUFFLE' }), []);

    const onError = useCallback(() => {
        retryCountRef.current += 1;

        if (retryCountRef.current < sortedUrls.length) {
            console.warn(`Retrying with fallback URL #${retryCountRef.current}`);
            initAudioSource();
            setTimeout(play, 200);
        } else {
            toast.error('Failed to play track. Please try downloading it.');
            retryCountRef.current = 0;
            playNext();
        }
    }, [sortedUrls.length, initAudioSource, play, playNext]);

    // Setup audio source + events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !sortedUrls.length) return;

        retryCountRef.current = 0;
        initAudioSource();

        const onLoadedMetadata = () => updateAudioState({ duration: audio.duration, loading: false });
        const onPlaying = () => updateAudioState({ loading: false, playing: true });
        const onWaiting = () => updateAudioState({ loading: true });
        const onRateChange = () => updateAudioState({ playbackRate: audio.playbackRate });
        const onEnded = () => {
            if (!audio.loop) playNext();
        };

        const events: [keyof HTMLMediaElementEventMap, EventListener][] = [
            ['loadedmetadata', onLoadedMetadata],
            ['playing', onPlaying],
            ['ratechange', onRateChange],
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
    }, [initAudioSource, onError, playNext, updateAudioState, sortedUrls]);

    useEffect(() => {
        if (audioState.playing) setTimeout(play, 100);
        if (audioRef.current) audioRef.current.playbackRate = audioState.playbackRate;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const pauseIfLastTrack = () => {
            if (isLastTrackInQueue) updateAudioState({ playing: false });
        };

        audio.addEventListener('ended', pauseIfLastTrack);

        return () => audio.removeEventListener('ended', pauseIfLastTrack);
    }, [isLastTrackInQueue, updateAudioState]);

    // MediaSession API
    useMediaSession(
        {
            title: currentTrack?.title || '',
            artist: currentTrack?.artists || '',
            album: currentTrack?.album || '',
            covers: currentTrack?.covers,
        },
        {
            play,
            pause,
            next: playNext,
            previous: playPrevious,
            getAudioElement: () => audioRef.current,
        }
    );

    return (
        <AudioPlayerContext.Provider
            value={{
                getAudioElement: () => audioRef.current,
                currentTrack,
                ...playerState,
                ...audioState,
                play,
                pause,
                playTrackByIndex,
                playTrackById,
                togglePlay,
                toggleFadePlay,
                playNext,
                playPrevious,
                clearQueue,
                setQueue,
                addToQueue,
                toggleShuffle,
                toggleLoop,
                setVolume,
                setPlaybackRate,
                toggleMute,
                seekTo,
            }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};
