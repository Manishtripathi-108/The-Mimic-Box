'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Track = {
    id: string;
    src: string;
    coverUrl?: string;
    title: string;
    artist?: string;
    album?: string;
};

type LoopMode = null | 'repeatOne' | 'repeat';

type AudioPlayerContextType = {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    next: () => void;
    previous: () => void;
    shuffled: boolean;
    toggleShuffle: () => void;
    setVolume: (vol: number) => void;
    setRate: (rate: number) => void;
    loop: LoopMode;
    toggleLoop: () => void;
    fadeAudio: (toVolume: number, callback?: () => void, duration?: number) => void;
    onProgressChange: (time: number) => void;
    onAbort: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
    onError: (e: React.SyntheticEvent<HTMLAudioElement>) => void;
    queue: Track[];
    current: Track | null;
    isPlaying: boolean;
    setQueue: (tracks: Track[]) => void;
    clearQueue: () => void;
    currentTime: number;
    duration: number;
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
    const ctx = useContext(AudioPlayerContext);
    if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
    return ctx;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const preloadRef = useRef<HTMLAudioElement>(null);

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

    const hasPreloadedRef = useRef(false);
    const retryCountRef = useRef(0);

    const current = useMemo(() => queue[currentIndex] || null, [queue, currentIndex]);

    // Apply volume & rate on changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
            audio.playbackRate = rate;
        }
    }, [volume, rate]);

    // Update current time & duration
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

    // Conditionally preload next audio (>50% played)
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

    const fadeAudio = useCallback((toVol: number, cb?: () => void, duration = 400) => {
        const audio = audioRef.current;
        if (!audio) return;

        const currentVol = audio.volume;
        const steps = 50;
        const delta = (toVol - currentVol) / (duration / steps);

        // If volume is already at target, do nothing
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
            .then(() => {
                setIsPlaying(true);
            })
            .catch((e) => {
                console.warn('Play error:', e);
            });
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
        audio.play().then(() => fadeAudio(volume));
        setIsPlaying(true);
    };

    const pauseWithFade = () => {
        const audio = audioRef.current;
        if (!audio) return;
        fadeAudio(0, () => {
            audio.pause();
            audio.volume = volume;
            setIsPlaying(false);
        });
    };

    const togglePlay = () => (isPlaying ? pauseWithFade() : playWithFade());

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
        togglePlay,
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
        setQueue: updateQueue,
        clearQueue,
        currentTime,
        duration,
    };

    return (
        <AudioPlayerContext.Provider value={contextValue}>
            {children}
            <audio ref={audioRef} src={current?.src} onEnded={next} onAbort={onAbort} onError={onError} />
            <audio ref={preloadRef} preload="auto" style={{ display: 'none' }} />
        </AudioPlayerContext.Provider>
    );
};
