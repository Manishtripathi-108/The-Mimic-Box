'use client';

import React, { memo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getLyrics } from '@/actions/lrclib.actions';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Input from '@/components/ui/Input';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsPanel, TabsTrigger } from '@/components/ui/Tabs';
import { LYRICS_UNAVAILABLE_MESSAGES } from '@/constants/client.constants';
import { LyricsQuerySchema } from '@/lib/schema/audio.validations';
import type { T_LyricsQuery, T_LyricsRecord } from '@/lib/types/common.types';
import { copyToClipboard } from '@/lib/utils/client.utils';
import { formatTimeDuration } from '@/lib/utils/core.utils';

const LyricsResult = memo(({ lyric, onSelect }: { lyric: T_LyricsRecord; onSelect?: (lyrics: string) => void }) => {
    const badgeText = lyric.instrumental ? 'Instrumental' : lyric.syncedLyrics ? 'Synced' : 'Plain';

    const handleCopy = (content: string) => {
        if (onSelect) {
            onSelect(content);
        } else {
            copyToClipboard(content);
        }
    };

    const fallbackMessage = LYRICS_UNAVAILABLE_MESSAGES[Math.floor(Math.random() * LYRICS_UNAVAILABLE_MESSAGES.length)];

    return (
        <details className="shadow-raised-xs relative rounded-md border p-4">
            <summary title={`${lyric.trackName} - ${lyric.artistName}`} className="text-text-primary cursor-pointer select-none">
                <div className="inline-grid w-[calc(100%-1rem)] gap-1">
                    <span className="truncate">
                        {lyric.trackName} - {lyric.artistName}
                    </span>
                    <span className="text-text-secondary shadow-pressed-xs w-fit rounded-md border px-2 text-sm">{badgeText}</span>
                    <p className="text-text-secondary text-sm">
                        {lyric.albumName || 'Unknown'} • {formatTimeDuration(lyric.duration * 1000, 'minutes') || 'N/A'}s
                    </p>
                </div>
            </summary>

            {!lyric.instrumental && (
                <div className="mt-3 space-y-2">
                    <Tabs defaultValue="synced">
                        <TabsList className="w-full">
                            <TabsTrigger value="synced" className="text-sm">
                                Synced Lyrics
                            </TabsTrigger>
                            <TabsTrigger value="plain" className="text-sm">
                                Plain Lyrics
                            </TabsTrigger>
                            <TabsIndicator />
                        </TabsList>

                        <TabsContent>
                            <TabsPanel value="synced" className="p-0">
                                <p className="shadow-pressed-xs text-text-secondary sm:scrollbar-thin max-h-80 overflow-y-scroll rounded-lg border p-2 whitespace-pre-wrap">
                                    {lyric.syncedLyrics || fallbackMessage}
                                </p>
                                <Button
                                    variant="highlight"
                                    className="mx-auto mt-2 block h-auto"
                                    disabled={!lyric.syncedLyrics}
                                    onClick={() => handleCopy(lyric.syncedLyrics || fallbackMessage)}>
                                    {onSelect ? 'Select' : 'Copy'} Synced Lyrics
                                </Button>
                            </TabsPanel>

                            <TabsPanel value="plain" className="p-0">
                                <p className="shadow-pressed-xs text-text-secondary sm:scrollbar-thin max-h-80 overflow-y-scroll rounded-lg border p-2 whitespace-pre-wrap">
                                    {lyric.plainLyrics || fallbackMessage}
                                </p>
                                <Button
                                    variant="highlight"
                                    className="mx-auto mt-2 block h-auto"
                                    disabled={!lyric.plainLyrics}
                                    onClick={() => handleCopy(lyric.plainLyrics || fallbackMessage)}>
                                    {onSelect ? 'Select' : 'Copy'} Plain Lyrics
                                </Button>
                            </TabsPanel>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </details>
    );
});
LyricsResult.displayName = 'LyricsResult';

const SearchLyrics = ({ defaultParams = {}, onSelect }: { defaultParams?: Partial<T_LyricsQuery>; onSelect?: (lyrics: string) => void }) => {
    const [lyrics, setLyrics] = useState<T_LyricsRecord[] | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const {
        handleSubmit,
        setError,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof LyricsQuerySchema>>({
        resolver: zodResolver(LyricsQuerySchema),
        defaultValues: {
            q: '',
            trackName: '',
            artistName: '',
            albumName: '',
            ...defaultParams,
        },
    });

    const submitSearchLyrics = async (data: T_LyricsQuery) => {
        setLyrics(null);
        const res = await getLyrics(data);
        if (res.success) {
            const records = Array.isArray(res.payload) ? res.payload : [res.payload];
            setLyrics(records);
        } else {
            setError('root', { message: res.message });
        }
    };

    return (
        <div className="space-y-4 px-2 py-6 sm:px-6">
            <h3 className="font-aladin text-highlight text-center text-2xl tracking-wider">
                Search Lyrics <sub className="text-accent font-karla text-xs">By Lrclib</sub>
            </h3>

            <form onSubmit={handleSubmit(submitSearchLyrics)} className={`space-y-2 ${isSubmitting ? 'pointer-events-none animate-pulse' : ''}`}>
                <Input
                    control={control}
                    name="q"
                    label="Search here..."
                    iconName="search"
                    placeholder="e.g. Departure Lane Umair & Talha Anjum"
                    disabled={isSubmitting}
                />

                <div className="flex items-center justify-end">
                    <Button onClick={() => setShowAdvanced((prev) => !prev)} variant="transparent" size="sm">
                        {showAdvanced ? 'Hide Advance Search' : 'Open Advance Search'}
                    </Button>
                </div>

                {showAdvanced && (
                    <div className="grid gap-2 sm:grid-cols-2">
                        <Input control={control} name="trackName" label="Track Name" placeholder="e.g. Departure Lane" disabled={isSubmitting} />
                        <Input
                            control={control}
                            name="artistName"
                            label="Artist Name"
                            placeholder="e.g. Umair & Talha Anjum"
                            disabled={isSubmitting}
                        />
                        <Input control={control} name="albumName" label="Album Name" placeholder="e.g. My Terrible Mind" disabled={isSubmitting} />
                        <Input
                            control={control}
                            name="duration"
                            label="Duration (sec)"
                            placeholder="e.g. 167"
                            type="number"
                            disabled={isSubmitting}
                        />
                    </div>
                )}

                <ErrorMessage message={errors.root?.message} />

                <div className="flex items-center justify-end gap-6 pt-2">
                    <Button onClick={() => reset()} disabled={isSubmitting} variant="danger">
                        Clear
                    </Button>
                    <Button type="submit" disabled={isSubmitting} variant="highlight">
                        {isSubmitting ? 'Searching...' : 'Search Lyrics'}
                    </Button>
                </div>
            </form>

            {!isSubmitting && lyrics && (
                <div className="space-y-4 py-2">
                    <hr />
                    <h3 className="font-aladin text-text-primary flex items-center justify-between text-xl tracking-wider">
                        Search Results: <span className="text-text-secondary text-sm">{lyrics.length}</span>
                    </h3>

                    {lyrics.length > 0 ? (
                        lyrics.map((lyric) => <LyricsResult key={lyric.id} lyric={lyric} onSelect={onSelect} />)
                    ) : (
                        <div className="text-text-secondary rounded-md border p-4 text-center">No results found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default memo(SearchLyrics);
