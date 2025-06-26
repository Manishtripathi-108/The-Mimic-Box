'use client';

import React, { memo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getLyrics } from '@/actions/lrclib.actions';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Input from '@/components/ui/Input';
import TabNavigation from '@/components/ui/TabNavigation';
import { LyricsQuerySchema } from '@/lib/schema/audio.validations';
import type { T_LyricsQuery, T_LyricsRecord } from '@/lib/types/common.types';

type SearchLyricsProps = {
    defaultParams?: Partial<T_LyricsQuery>;
    onSelect?: (lyrics: string) => void;
};

type LyricsResultProps = {
    lyric: T_LyricsRecord;
    onSelect?: (lyrics: string) => void;
};

const TAB_OPTIONS = ['Plain Lyrics', 'Synced Lyrics'];

const LyricsResult = memo(({ lyric, onSelect }: LyricsResultProps) => {
    const [tab, setTab] = useState('Plain Lyrics');
    const currentLyrics = tab === 'Plain Lyrics' ? lyric.plainLyrics : lyric.syncedLyrics;

    const badgeText = lyric.instrumental ? 'Instrumental' : lyric.syncedLyrics ? 'Synced' : 'Plain';

    return (
        <details className="shadow-raised-xs relative rounded-md border p-4">
            <summary title={`${lyric.trackName} - ${lyric.artistName}`} className="text-text-primary cursor-pointer select-none">
                <div className="inline-grid w-[calc(100%-1rem)] gap-1">
                    <span className="truncate">
                        {lyric.trackName} - {lyric.artistName}
                    </span>
                    <span className="text-text-secondary shadow-pressed-xs w-fit rounded-md border px-2 text-sm">{badgeText}</span>
                    <p className="text-text-secondary text-sm">
                        {lyric.albumName || 'Unknown'} • {lyric.duration || 'N/A'}s
                    </p>
                </div>
            </summary>

            {!lyric.instrumental && (
                <div className="mt-3 space-y-2">
                    <div className="shadow-pressed-xs rounded-t-xl rounded-b-md border">
                        <TabNavigation tabs={TAB_OPTIONS} className="w-full" buttonClassName="text-sm p-2" onTabChange={setTab} currentTab={tab} />
                        <p className="text-text-secondary sm:scrollbar-thin h-80 overflow-y-scroll px-2 py-4 whitespace-pre-wrap">
                            {currentLyrics || 'The lyric gods are on vacation... try again later!'}
                        </p>
                    </div>

                    {onSelect && (
                        <Button variant="highlight" onClick={() => onSelect(currentLyrics)} className="mx-auto mt-2">
                            Select {tab}
                        </Button>
                    )}
                </div>
            )}
        </details>
    );
});

LyricsResult.displayName = 'LyricsResult';

const SearchLyrics = ({ defaultParams = {}, onSelect }: SearchLyricsProps) => {
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
