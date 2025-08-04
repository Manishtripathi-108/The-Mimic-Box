'use client';

import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import { LYRICS_UNAVAILABLE_MESSAGES } from '@/constants/client.constants';
import API_ROUTES from '@/constants/routes/api.routes';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import { useClickOutside } from '@/hooks/useClickOutside';
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
    const fetchLyrics = useCallback(() => {
        if (!currentTrack) return;

        makeApiCall({
            url: API_ROUTES.LYRICS.GET,
            params: {
                title: currentTrack.title,
                artist: currentTrack.artists,
                album: currentTrack.album,
                duration: currentTrack.duration,
                lyricsOnly: true,
            },
        });
    }, [currentTrack, makeApiCall]);

    const lyricsContainerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeIndexRef = useRef<number | null>(null);

    const audio = getAudioElement();

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

    useClickOutside({
        targets: [lyricsContainerRef],
        onClickOutside: onClose,
    });

    return (
        <Card
            id="lyrics-card"
            role="dialog"
            aria-label="Music lyrics"
            className={cn('absolute inset-auto z-50 gap-4', className)}
            ref={lyricsContainerRef}>
            <CardHeader className="p-4">
                <CardTitle className="font-alegreya tracking-wide">Lyrics</CardTitle>
                <CardDescription className="truncate text-xs">
                    {currentTrack?.title} - {currentTrack?.artists}
                </CardDescription>
                <CardAction>
                    <Button icon="close" title="Close lyrics" aria-label="Close lyrics" onClick={onClose} />
                </CardAction>
            </CardHeader>

            <CardContent className="sm:scrollbar-thin h-full flex-1 space-y-2 overflow-y-auto px-4 text-sm">
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
                    <div className="text-center">{LYRICS_UNAVAILABLE_MESSAGES[Math.floor(Math.random() * LYRICS_UNAVAILABLE_MESSAGES.length)]}</div>
                )}
            </CardContent>
        </Card>
    );
};

export default memo(MusicLyricsCard);
