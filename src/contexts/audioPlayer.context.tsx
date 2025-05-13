'use client';

import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import useMediaSession from '@/hooks/useMediaSession.hook.';
import { T_AudioPlayerState, T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import { audioPlayerInitialState, audioPlayerReducer } from '@/reducers/audioPlayer.reducer';

type T_AudioPlayerContext = {
    playing: boolean;
    next: () => void;
    previous: () => void;
    clearQueue: () => void;
    setQueue: (tracks: T_AudioPlayerTrack[], context?: T_TrackContext | null, autoPlay?: boolean) => void;
    addToQueue: (tracks: T_AudioPlayerTrack[]) => void;
    toggleShuffle: () => void;
    toggleLoop: () => void;
    current: T_AudioPlayerTrack | null;
} & T_AudioPlayerState;

const AudioPlayerContext = createContext({} as T_AudioPlayerContext);

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(audioPlayerReducer, audioPlayerInitialState);

    const { queue, currentTrackIndex } = state;

    const current = useMemo(() => queue[currentTrackIndex] || null, [queue, currentTrackIndex]);

    const setQueue = useCallback((tracks: T_AudioPlayerTrack[], context: T_TrackContext | null = null, autoPlay = false) => {
        dispatch({ type: 'SET_QUEUE', payload: { tracks, context } });
        setTimeout(() => {
            if (autoPlay) {
                window.audioPlayer?.play();
            }
        }, 500);
    }, []);

    const addToQueue = useCallback((tracks: T_AudioPlayerTrack[]) => {
        dispatch({ type: 'ADD_TO_QUEUE', payload: tracks });
    }, []);

    const next = useCallback(() => {
        dispatch({ type: 'NEXT_TRACK' });
        setTimeout(() => {
            window.audioPlayer?.play();
        }, 500);
    }, []);

    const previous = useCallback(() => {
        dispatch({ type: 'PREV_TRACK' });
    }, []);

    const clearQueue = useCallback(() => {
        dispatch({ type: 'CLEAR_QUEUE' });
    }, []);

    const toggleShuffle = useCallback(() => {
        dispatch({ type: 'TOGGLE_SHUFFLE' });
    }, []);

    const toggleLoop = useCallback(() => {
        dispatch({ type: 'TOGGLE_LOOP' });
    }, []);

    useMediaSession(
        {
            title: current?.title || '',
            artist: current?.artists || '',
            album: current?.album || '',
            covers: current?.covers,
        },
        {
            play: () => {
                window.audioPlayer?.play();
            },
            pause: () => {
                window.audioPlayer?.pause();
            },
            next: () => {
                next();
            },
            previous: () => {
                previous();
            },
            getAudioElement: () => {
                return window.audioPlayer?.audioEl || null;
            },
        }
    );

    return (
        <AudioPlayerContext.Provider
            value={{
                playing: !window.audioPlayer?.audioEl?.paused || false,
                next,
                previous,
                clearQueue,
                setQueue,
                addToQueue,
                toggleShuffle,
                toggleLoop,
                current,
                ...state,
            }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

export const useAudioPlayerContext = () => useContext(AudioPlayerContext);
