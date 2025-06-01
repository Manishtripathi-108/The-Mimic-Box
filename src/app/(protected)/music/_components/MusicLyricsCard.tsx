'use client';

import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import Icon from '@/components/ui/Icon';
import { API_ROUTES } from '@/constants/routes.constants';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import cn from '@/lib/utils/cn';

type Props = {
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

const MusicLyricsCard = ({ className, onClose }: Props) => {
    const { currentTrack, getAudioElement } = useAudioPlayerContext();
    const { isPending, makeApiCall, data } = useSafeApiCall<null, string>();

    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeIndexRef = useRef<number | null>(null);

    const audio = getAudioElement();

    const fetchLyrics = useCallback(() => {
        if (!currentTrack) return;

        makeApiCall({
            url: API_ROUTES.LYRICS.GET,
            params: {
                track: currentTrack.title,
                artist: currentTrack.artists,
                album: currentTrack.album,
                duration: currentTrack.duration,
                lyricsOnly: true,
            },
        });
    }, [currentTrack, makeApiCall]);

    const parsedLyrics = useMemo(() => (data ? parseLyrics(data) : []), [data]);
    const isSynced = parsedLyrics.length > 0;

    const updateLyricsHighlight = useCallback(() => {
        if (!audio || !isSynced) return;

        const currentTime = audio.currentTime;
        let newIndex = parsedLyrics.findIndex((line, i) => i === parsedLyrics.length - 1 || currentTime < parsedLyrics[i + 1].time);

        if (newIndex === -1) newIndex = parsedLyrics.length - 1;

        if (activeIndexRef.current !== newIndex) {
            // Clear previous highlight
            if (activeIndexRef.current !== null) {
                const prevEl = lineRefs.current[activeIndexRef.current];
                prevEl?.classList.remove('text-highlight', 'text-lg', 'font-semibold');
            }

            // Add highlight to current
            const currentEl = lineRefs.current[newIndex];
            currentEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            currentEl?.classList.add('text-highlight', 'text-lg', 'font-semibold');

            activeIndexRef.current = newIndex;
        }
    }, [audio, isSynced, parsedLyrics]);

    useEffect(() => {
        fetchLyrics();
    }, [fetchLyrics]);

    useEffect(() => {
        if (!audio || !isSynced) return;

        audio.addEventListener('timeupdate', updateLyricsHighlight);
        return () => audio.removeEventListener('timeupdate', updateLyricsHighlight);
    }, [audio, updateLyricsHighlight, isSynced]);

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

            <div className="sm:scrollbar-thin text-text-secondary h-full flex-1 space-y-2 overflow-y-auto p-4 text-sm">
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
                                className="text-center transition-all duration-300 ease-in-out">
                                {line.text}
                            </div>
                        ))
                    ) : (
                        <div className="text-center whitespace-pre-wrap">{data}</div>
                    )
                ) : (
                    <div className="text-center">No lyrics found.</div>
                )}
            </div>
        </div>
    );
};

export default memo(MusicLyricsCard);
