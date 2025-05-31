'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import Icon from '@/components/ui/Icon';
import { API_ROUTES } from '@/constants/routes.constants';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import cn from '@/lib/utils/cn';

type Props = {
    track: string;
    artist: string;
    album: string;
    duration: number;
    currentDuration: number;
    className?: string;
    onClose: () => void;
};

type LyricLine = {
    time: number;
    text: string;
};

const parseLyrics = (lyricsText: string): LyricLine[] => {
    const regex = /\[(\d{2}):(\d{2})\.(\d{2})\]\s?(.*)/g;
    const lines: LyricLine[] = [];
    let match;
    while ((match = regex.exec(lyricsText)) !== null) {
        const [, min, sec, ms, text] = match;
        const time = parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 100;
        lines.push({ time, text });
    }
    return lines;
};

const MusicLyricsCard = ({ track, artist, album, duration, currentDuration, className, onClose }: Props) => {
    const { isPending, makeApiCall, data } = useSafeApiCall<null, string>();
    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

    const getLyrics = useCallback(() => {
        if (!track || !artist || !album || !duration) return;
        makeApiCall({
            url: API_ROUTES.LYRICS.GET,
            params: {
                track,
                artist,
                album,
                duration,
                lyricsOnly: true,
            },
        });
    }, [track, artist, album, duration, makeApiCall]);

    useEffect(() => {
        getLyrics();
    }, [getLyrics]);

    const parsedLyrics = useMemo(() => {
        if (!data) return [];
        return parseLyrics(data);
    }, [data]);

    const isSynced = useMemo(() => parsedLyrics.length > 0, [parsedLyrics]);

    const activeIndex = useMemo(() => {
        if (!isSynced) return 0;
        for (let i = parsedLyrics.length - 1; i >= 0; i--) {
            if (currentDuration >= parsedLyrics[i].time) {
                return i;
            }
        }
        return 0;
    }, [currentDuration, parsedLyrics, isSynced]);

    useEffect(() => {
        if (!isSynced) return;
        const currentLine = lineRefs.current[activeIndex];
        currentLine?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, [activeIndex, isSynced]);

    return (
        <div
            className={cn('bg-secondary absolute inset-auto z-50 flex flex-col overflow-hidden rounded-2xl shadow-lg', className)}
            ref={lyricsContainerRef}>
            <div className="shadow-raised-xs flex items-center justify-between px-4 py-3">
                <h2 className="text-text-primary font-alegreya text-lg tracking-wide">Lyrics</h2>
                <button className="button size-8 shrink-0 rounded-full p-1 text-xs" title="Close lyrics" aria-label="Close lyrics" onClick={onClose}>
                    <Icon icon="close" />
                </button>
            </div>

            <div className="sm:scrollbar-thin h-full flex-1 space-y-2 overflow-y-auto p-4">
                {isPending ? (
                    <Icon icon="loading" className="text-highlight mx-auto size-20 shrink-0" />
                ) : data ? (
                    isSynced ? (
                        parsedLyrics.map((line, index) => (
                            <div
                                key={index}
                                ref={(el) => {
                                    lineRefs.current[index] = el;
                                }}
                                className={cn(
                                    'text-center transition-all duration-300 ease-in-out',
                                    index === activeIndex ? 'text-highlight text-lg font-semibold' : 'text-text-secondary'
                                )}>
                                {line.text}
                            </div>
                        ))
                    ) : (
                        <div className="text-text-secondary text-center whitespace-pre-wrap">{data}</div>
                    )
                ) : (
                    <div className="text-text-secondary text-center">No lyrics found.</div>
                )}
            </div>
        </div>
    );
};

export default MusicLyricsCard;
