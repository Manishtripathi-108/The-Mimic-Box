'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * A single track in the playlist.
 */
type Track = {
    album?: string;
    artist?: string;
    covers?: {
        quality: string;
        url: string;
    }[];
    id: string;
    src: string;
    title: string;
};

type LoopMode = null | 'repeat' | 'repeatOne';

/**
 * The context type for the audio player.
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
     * Toggle play or pause.
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
     * Fade the audio to a specified volume.
     * @param toVolume The target volume level (0 to 1).
     * @param callback Optional callback to execute after fading.
     * @param duration Optional duration of the fade in milliseconds.
     */
    fadeAudio: (toVolume: number, callback?: () => void, duration?: number) => void;

    /**
     * Update the playback progress.
     * @param time The new playback time in seconds.
     */
    onProgressChange: (time: number) => void;

    /**
     * The callback for when the audio encounters an error.
     * @param e The error event.
     */
    onError: (e: React.SyntheticEvent<HTMLAudioElement>) => void;

    /**
     * Clear the current queue.
     */
    clearQueue: () => void;

    /**
     * Update the queue with a new list of tracks.
     * @param tracks The new queue of tracks.
     */
    setQueue: (tracks: Track[]) => void;

    /**
     * Add tracks to the current queue.
     * @param tracks The tracks to add to the queue.
     */
    addToQueue: (tracks: Track[]) => void;

    /**
     * Toggle shuffle mode on or off.
     */
    toggleShuffle: () => void;

    /**
     * Toggle the loop mode.
     */
    toggleLoop: () => void;

    /**
     * Toggle mute on or off.
     */
    toggleMute: () => void;

    /**
     * Set the volume level.
     * @param vol The new volume level (0 to 1).
     */
    setVolume: (vol: number) => void;

    /**
     * Set the playback rate.
     * @param rate The new playback rate.
     */
    setRate: (rate: number) => void;

    /**
     * The current track being played.
     */
    current: Track | null;

    /**
     * The current queue of tracks.
     */
    queue: Track[];

    /**
     * The current playback time of the track in seconds.
     */
    currentTime: number;

    /**
     * The total duration of the current track in seconds.
     */
    duration: number;

    /**
     * Whether the audio is currently playing.
     */
    isPlaying: boolean;

    /**
     * Whether the audio is currently loading.
     */
    isLoading: boolean;

    /**
     * Whether the audio is currently muted.
     */
    isMuted: boolean;

    /**
     * Whether the queue is currently shuffled.
     */
    isShuffled: boolean;

    /**
     * The loop mode for playback.
     */
    loop: LoopMode;
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
    const [isShuffled, setIsShuffled] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const hasPreloadedRef = useRef(false);
    const retryCountRef = useRef(0);

    const current = useMemo(() => queue[currentIndex] || null, [queue, currentIndex]);

    // Set the volume and playback rate
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = isMuted ? 0 : volume;
            audio.playbackRate = rate;
        }
    }, [volume, rate, isMuted]);

    // handles time updates and duration changes
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

    // handles preload of the next track when the current track is halfway through
    useEffect(() => {
        const audio = audioRef.current;
        const preload = preloadRef.current;
        if (!audio || !preload) return;

        const handleTimeUpdate = () => {
            if (!hasPreloadedRef.current && audio.duration && audio.currentTime >= audio.duration / 2) {
                const next = queue[currentIndex + 1];
                console.log('preloading next track', next);
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

    // handles loading state
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

    /* -------------------------------- Controls -------------------------------- */

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
            artwork: current.covers ? current.covers.map((cover) => ({ src: cover.url, sizes: cover.quality, type: 'image/png' })) : [],
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

    /* ----------------------------- Shuffle & Loop ----------------------------- */

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
        const isNowShuffled = !isShuffled;
        setIsShuffled(isNowShuffled);

        const newQueue = isNowShuffled ? shuffleArray(originalQueue) : originalQueue;
        const cur = current;
        const idx = newQueue.findIndex((t) => t.id === cur?.id);

        setQueue(newQueue);
        if (idx !== -1) setCurrentIndex(idx);
    }, [isShuffled, originalQueue, queue.length, current, shuffleArray]);

    const toggleLoop = () => {
        setLoop((prev) => (prev === null ? 'repeatOne' : prev === 'repeatOne' ? 'repeat' : null));
    };

    /* ---------------------------------- Queue --------------------------------- */

    const updateQueue = useCallback(
        (tracks: Track[]) => {
            setOriginalQueue(tracks);
            const newQ = isShuffled && tracks.length > 1 ? shuffleArray(tracks) : tracks;
            setQueue(newQ);
            setCurrentIndex(0);
            hasPreloadedRef.current = false;
        },
        [isShuffled, shuffleArray]
    );

    const clearQueue = useCallback(() => {
        pause();
        setQueue([]);
        setOriginalQueue([]);
        setCurrentIndex(0);
        hasPreloadedRef.current = false;
    }, [pause]);

    const addToQueue = useCallback(
        (tracks: Track[]) => {
            setOriginalQueue((prev) => [...prev, ...tracks]);
            const newQ = isShuffled && tracks.length > 1 ? shuffleArray([...queue, ...tracks]) : [...queue, ...tracks];
            setQueue(newQ);
            if (current) setCurrentIndex(newQ.findIndex((t) => t.id === current.id));
            hasPreloadedRef.current = false;
        },
        [isShuffled, queue, current, shuffleArray]
    );

    const onProgressChange = useCallback((time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
    }, []);

    const onError = useCallback(
        (e: React.SyntheticEvent<HTMLAudioElement>) => {
            console.warn('Audio error', e);
            retryPlayback();
        },
        [retryPlayback]
    );

    const contextValue: AudioPlayerContextType = {
        // Playback controls
        play,
        pause,
        togglePlay: () => (isPlaying ? pauseWithFade() : playWithFade()),
        next,
        previous,

        // Queue management
        current,
        queue,
        setQueue: updateQueue,
        addToQueue,
        clearQueue,
        isShuffled,
        toggleShuffle,

        // Playback state
        isPlaying,
        isLoading,
        currentTime,
        duration,

        // Volume and mute controls
        setVolume,
        isMuted,
        toggleMute: () => setIsMuted((prev) => !prev),
        fadeAudio,

        // Playback rate and loop controls
        setRate,
        loop,
        toggleLoop,

        // Event handlers
        onProgressChange,
        onError,
    };

    return (
        <AudioPlayerContext.Provider value={contextValue}>
            {children}
            <audio ref={audioRef} src={current?.src} onEnded={next} onError={onError} />
            <audio ref={preloadRef} preload="auto" style={{ display: 'none' }} />
        </AudioPlayerContext.Provider>
    );
};
