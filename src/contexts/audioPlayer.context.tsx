'use client';

import { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react';

import { useAudioPlayer as useSingleAudio } from '@/hooks/useAudioPlayer.hook';
import { T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import { audioPlayerInitialState, audioPlayerReducer } from '@/reducers/audioPlayer.reducer';

type LoopMode = null | 'all' | 'one';

type T_AudioPlayerContext = {
    next: () => void;
    previous: () => void;
    clearQueue: () => void;
    setQueue: (tracks: T_AudioPlayerTrack[], context?: T_TrackContext | null, autoPlay?: boolean) => void;
    addToQueue: (tracks: T_AudioPlayerTrack[]) => void;
    toggleShuffle: () => void;
    toggleLoop: () => void;
    current: T_AudioPlayerTrack | null;
    playbackContext: T_TrackContext | null;
    queue: T_AudioPlayerTrack[];
    isShuffled: boolean;
    loopMode: LoopMode;
} & ReturnType<typeof useSingleAudio>;

const AudioPlayerContext = createContext({} as T_AudioPlayerContext);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(audioPlayerReducer, audioPlayerInitialState);
    const retryCountRef = useRef(0);

    const { queue, currentTrackIndex, loopMode, isShuffled, playbackContext } = state;

    const current = useMemo(() => queue[currentTrackIndex] || null, [queue, currentTrackIndex]);

    const { play, pause, ...rest } = useSingleAudio({
        src: current?.urls.find((url) => url.quality === '320kbps')?.url || current?.urls[0]?.url,
        preloadNext: queue[currentTrackIndex + 1]?.urls.find((u) => u.quality === '320kbps')?.url,
        onEnd: () => {
            if (loopMode === 'one') {
                rest.seek(0);
                play();
            } else {
                next();
                play();
            }
        },
        onError: (err) => {
            console.error('Audio error:', err);
            retryPlayback();
        },
    });

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

    const next = useCallback(() => {
        retryCountRef.current = 0;
        dispatch({ type: 'NEXT_TRACK' });
    }, []);

    const previous = useCallback(() => {
        dispatch({ type: 'PREV_TRACK' });
    }, []);

    const clearQueue = useCallback(() => {
        pause();
        dispatch({ type: 'CLEAR_QUEUE' });
    }, [pause]);

    const toggleShuffle = useCallback(() => {
        dispatch({ type: 'TOGGLE_SHUFFLE' });
    }, []);

    const toggleLoop = useCallback(() => {
        dispatch({ type: 'TOGGLE_LOOP' });
    }, []);

    const retryPlayback = useCallback(() => {
        if (retryCountRef.current < 2) {
            retryCountRef.current += 1;
            setTimeout(() => play(), 300);
        } else {
            next();
        }
    }, [play, next]);

    return (
        <AudioPlayerContext.Provider
            value={{
                play,
                pause,

                next,
                previous,
                clearQueue,
                setQueue,
                addToQueue,
                toggleShuffle,
                toggleLoop,

                current,
                playbackContext,
                queue,

                isShuffled,
                loopMode,
                ...rest,
            }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);
