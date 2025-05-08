'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * A single track in the playlist.
 */
type Track = {
    album?: string;
    artist?: string;
    coverUrl?: string;
    id: string;
    src: string;
    title: string;
};

type LoopMode = null | 'repeat' | 'repeatOne';

/**
 * The type for the AudioPlayerContext.
 */
type AudioPlayerContextType = {
    /**
     * Play the current track.
     */
    play: () => void;
    /**
     * Pause the current track.
     */
    pause: () => void;
    /**
     * Toggle play/pause.
     */
    togglePlay: () => void;
    /**
     * Skip to the next track in the queue.
     */
    next: () => void;
    /**
     * Skip to the previous track in the queue.
     */
    previous: () => void;
    /**
     * Whether the queue is shuffled.
     */
    shuffled: boolean;
    /**
     * Toggle shuffle on/off.
     */
    toggleShuffle: () => void;
    /**
     * Set the volume.
     * @param {number} vol The new volume.
     */
    setVolume: (vol: number) => void;
    /**
     * Set the playback rate.
     * @param {number} rate The new playback rate.
     */
    setRate: (rate: number) => void;
    /**
     * The loop mode.
     * @see LoopMode
     */
    loop: LoopMode;
    /**
     * Toggle loop on/off.
     */
    toggleLoop: () => void;
    /**
     * Fade the audio to the specified volume.
     * @param {number} toVolume The volume to fade to.
     * @param {function} [callback] The callback to call after the fade.
     * @param {number} [duration] The duration of the fade in ms.
     */
    fadeAudio: (toVolume: number, callback?: () => void, duration?: number) => void;
    /**
     * The callback for when the track's progress changes.
     * @param {number} time The new progress in ms.
     */
    onProgressChange: (time: number) => void;
    /**
     * The callback for when the audio is aborted.
     * @param {React.SyntheticEvent<HTMLAudioElement>} e The event.
     */
    onAbort: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
    /**
     * The callback for when the audio encounters an error.
     * @param {React.SyntheticEvent<HTMLAudioElement>} e The event.
     */
    onError: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
    /**
     * The current queue.
     */
    queue: Track[];
    /**
     * The current track.
     */
    current: Track | null;
    /**
     * Whether the audio is playing.
     */
    isPlaying: boolean;
    /**
     * Set the queue.
     * @param {Track[]} tracks The new queue.
     */
    setQueue: (tracks: Track[]) => void;
    /**
     * Whether the audio is loading.
     */
    isLoading: boolean;
    /**
     * Clear the queue.
     */
    clearQueue: () => void;
    /**
     * The current time of the track in ms.
     */
    currentTime: number;
    /**
     * The duration of the track in ms.
     */
    duration: number;
    /**
     * Whether the audio is muted.
     */
    isMuted: boolean;
    /**
     * Toggle mute on/off.
     */
    toggleMute: () => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

/**
 * Returns the context of the audio player.
 * @throws {Error} if used outside of AudioPlayerProvider
 */
export const useAudioPlayer = () => {
    const ctx = useContext(AudioPlayerContext);
    if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
    return ctx;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const preloadRef = useRef<HTMLAudioElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
    const [queue, setQueue] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [rate, setRate] = useState(1);
    const [loop, setLoop] = useState<LoopMode>(null);
    const [shuffled, setShuffled] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const hasPreloadedRef = useRef(false);
    const retryCountRef = useRef(0);

    const current = useMemo(() => queue[currentIndex] || null, [queue, currentIndex]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = isMuted ? 0 : volume;
            audio.playbackRate = rate;
        }
    }, [volume, rate, isMuted]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const update = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener('timeupdate', update);
        audio.addEventListener('loadedmetadata', update);
        return () => {
            audio.removeEventListener('timeupdate', update);
            audio.removeEventListener('loadedmetadata', update);
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        const preload = preloadRef.current;
        if (!audio || !preload) return;

        const handleTimeUpdate = () => {
            if (!hasPreloadedRef.current && audio.duration && audio.currentTime >= audio.duration / 2) {
                const next = queue[currentIndex + 1];
                if (next?.src) {
                    preload.src = next.src;
                    preload.load();
                    hasPreloadedRef.current = true;
                }
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [currentIndex, queue]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !current) return;

        setIsLoading(true);

        const handleCanPlay = () => setIsLoading(false);

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('loadeddata', handleCanPlay);

        return () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('loadeddata', handleCanPlay);
        };
    }, [current]);

    const fadeAudio = useCallback((toVol: number, cb?: () => void, duration = 400) => {
        const audio = audioRef.current;
        if (!audio) return;

        const currentVol = audio.volume;
        const steps = 50;
        const delta = (toVol - currentVol) / (duration / steps);

        if (delta === 0 || duration === 0) {
            audio.volume = toVol;
            cb?.();
            return;
        }

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

    const play = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((e) => console.warn('Play error:', e));
    }, []);

    const pause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.pause();
        setIsPlaying(false);
    }, []);

    const playWithFade = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0;
        audio.play().then(() => fadeAudio(isMuted ? 0 : volume));
        setIsPlaying(true);
    };

    const pauseWithFade = () => {
        const audio = audioRef.current;
        if (!audio) return;
        fadeAudio(0, () => {
            audio.pause();
            audio.volume = isMuted ? 0 : volume;
            setIsPlaying(false);
        });
    };

    const next = useCallback(() => {
        retryCountRef.current = 0;
        hasPreloadedRef.current = false;
        const isLast = currentIndex >= queue.length - 1;
        if (loop === 'repeatOne') {
            audioRef.current!.currentTime = 0;
            play();
            return;
        }
        if (isLast) {
            if (loop === 'repeat') setCurrentIndex(0);
            else pause();
        } else {
            setCurrentIndex((i) => i + 1);
        }
    }, [currentIndex, queue.length, loop, play, pause]);

    const previous = useCallback(() => {
        setCurrentIndex((i) => (i - 1 + queue.length) % queue.length);
        hasPreloadedRef.current = false;
    }, [queue.length]);

    // Media Session API integration
    useEffect(() => {
        if (!current || typeof window === 'undefined' || !('mediaSession' in navigator)) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: current.title,
            artist: current.artist || '',
            album: current.album || '',
            artwork: current.coverUrl ? [{ src: current.coverUrl, sizes: '512x512', type: 'image/png' }] : [],
        });

        // Core controls
        navigator.mediaSession.setActionHandler('play', play);
        navigator.mediaSession.setActionHandler('pause', pause);
        navigator.mediaSession.setActionHandler('previoustrack', previous);
        navigator.mediaSession.setActionHandler('nexttrack', next);

        // Seek controls
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            const skipTime = details.seekOffset || 10;
            if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - skipTime);
            }
        });

        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            const skipTime = details.seekOffset || 10;
            if (audioRef.current) {
                audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + skipTime);
            }
        });

        // Seekto (scrubbing to an exact position)
        navigator.mediaSession.setActionHandler('seekto', (details) => {
            const position = details.seekTime || 0;
            if (audioRef.current) {
                audioRef.current.currentTime = position;
            }
        });

        return () => {
            const handlers: MediaSessionAction[] = ['play', 'pause', 'previoustrack', 'nexttrack', 'seekbackward', 'seekforward', 'seekto'];
            handlers.forEach((action) => navigator.mediaSession.setActionHandler(action, null));
        };
    }, [current, play, pause, next, previous]);

    const retryPlayback = useCallback(() => {
        if (retryCountRef.current < 2) {
            retryCountRef.current++;
            setTimeout(() => play(), 300);
        } else {
            next();
        }
    }, [play, next]);

    const shuffleArray = useCallback((arr: Track[]) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, []);

    const toggleShuffle = useCallback(() => {
        if (queue.length <= 1) return;
        const isNowShuffled = !shuffled;
        setShuffled(isNowShuffled);

        const newQueue = isNowShuffled ? shuffleArray(originalQueue) : originalQueue;
        const cur = current;
        const idx = newQueue.findIndex((t) => t.id === cur?.id);

        setQueue(newQueue);
        if (idx !== -1) setCurrentIndex(idx);
    }, [shuffled, originalQueue, queue.length, current, shuffleArray]);

    const updateQueue = useCallback(
        (tracks: Track[]) => {
            setOriginalQueue(tracks);
            const newQ = shuffled && tracks.length > 1 ? shuffleArray(tracks) : tracks;
            setQueue(newQ);
            setCurrentIndex(0);
            hasPreloadedRef.current = false;
        },
        [shuffled, shuffleArray]
    );

    const clearQueue = useCallback(() => {
        pause();
        setQueue([]);
        setOriginalQueue([]);
        setCurrentIndex(0);
        hasPreloadedRef.current = false;
    }, [pause]);

    const onProgressChange = useCallback((time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
    }, []);

    const toggleLoop = () => {
        setLoop((prev) => (prev === null ? 'repeatOne' : prev === 'repeatOne' ? 'repeat' : null));
    };

    const onAbort = useCallback(
        (e: React.SyntheticEvent<HTMLAudioElement>) => {
            console.warn('Audio aborted', e);
            retryPlayback();
        },
        [retryPlayback]
    );

    const onError = useCallback(
        (e: React.SyntheticEvent<HTMLAudioElement>) => {
            console.warn('Audio error', e);
            retryPlayback();
        },
        [retryPlayback]
    );

    const contextValue: AudioPlayerContextType = {
        play,
        pause,
        togglePlay: () => (isPlaying ? pauseWithFade() : playWithFade()),
        next,
        previous,
        shuffled,
        toggleShuffle,
        setVolume,
        setRate,
        loop,
        toggleLoop,
        fadeAudio,
        onProgressChange,
        onAbort,
        onError,
        queue,
        current,
        isPlaying,
        isLoading,
        setQueue: updateQueue,
        clearQueue,
        currentTime,
        duration,
        isMuted,
        toggleMute: () => setIsMuted((prev) => !prev),
    };

    return (
        <AudioPlayerContext.Provider value={contextValue}>
            {children}
            <audio ref={audioRef} src={current?.src} onEnded={next} onAbort={onAbort} onError={onError} />
            <audio ref={preloadRef} preload="auto" style={{ display: 'none' }} />
        </AudioPlayerContext.Provider>
    );
};
