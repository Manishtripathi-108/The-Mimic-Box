'use client';

import React, { memo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getLyrics } from '@/actions/lrclib.actions';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Input from '@/components/ui/Input';
import TabNavigation from '@/components/ui/TabNavigation';
import { LyricsQuerySchema } from '@/lib/schema/audio.validations';
import type { T_LyricsQuery, T_LyricsRecord } from '@/lib/types/common.types';

type SearchLyricsProps = {
    defaultParams?: Partial<T_LyricsQuery>;
    onSelect: (record: T_LyricsRecord['syncedLyrics' | 'plainLyrics']) => void;
};

const LyricsResult = ({ lyric, onSelect }: { lyric: T_LyricsRecord; onSelect: (lyrics: string) => void }) => {
    const [tab, setTab] = useState<'Plain Lyrics' | 'Synced Lyrics'>('Plain Lyrics');
    const currentLyrics = tab === 'Plain Lyrics' ? lyric.plainLyrics : lyric.syncedLyrics;

    return (
        <details key={lyric.id} className="shadow-raised-xs rounded-md border p-4">
            <summary className="text-text-primary cursor-pointer select-none">
                {lyric.trackName} - {lyric.artistName}
            </summary>
            <div className="mt-2 space-y-2">
                <p className="text-text-secondary text-sm">
                    {lyric.albumName} • {lyric.duration}s
                    {lyric.instrumental && <span className="ml-2 rounded-full border px-2 text-sm">Instrumental</span>}
                </p>

                <div className="shadow-pressed-xs rounded-md border p-1">
                    <TabNavigation
                        tabs={['Plain Lyrics', 'Synced Lyrics']}
                        className="mb-4 w-full"
                        buttonClassName="text-sm"
                        onTabChange={setTab}
                        currentTab={tab}
                    />
                    <p className="text-text-secondary p-2 whitespace-pre-wrap">{currentLyrics}</p>
                </div>

                <button onClick={() => onSelect(currentLyrics)} className="button button-highlight mx-auto mt-2">
                    Select {tab}
                </button>
            </div>
        </details>
    );
};

const SearchLyrics = ({ defaultParams = {}, onSelect }: SearchLyricsProps) => {
    const [lyrics, setLyrics] = useState<T_LyricsRecord[] | T_LyricsRecord | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const {
        handleSubmit,
        setError,
        control,
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

    const onSubmit = async (data: T_LyricsQuery) => {
        setLyrics(null);
        const res = await getLyrics(data);

        if (res.success) {
            setLyrics(res.payload);
        } else {
            setError('root', { message: res.message });
        }
    };

    return (
        <div
            style={{ scrollbarGutter: 'stable' }}
            className="scrollbar-thin bg-tertiary max-h-96 w-full max-w-md space-y-4 overflow-y-auto py-6 shadow-lg">
            <h3 className="font-aladin text-highlight text-center text-2xl tracking-wider">Search Lyrics</h3>

            <form onSubmit={handleSubmit(onSubmit)} className={`space-y-3 px-6 ${isSubmitting ? 'pointer-events-none animate-pulse' : ''}`}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Input control={control} name="trackName" label="Track Name" placeholder="eg: Riders In The Sky" disabled={isSubmitting} />
                    <Input control={control} name="q" label="Search By Lyrics" placeholder="eg: An old cow polk went..." disabled={isSubmitting} />
                </div>

                <button
                    type="button"
                    onClick={() => setShowAdvanced((prev) => !prev)}
                    className="text-text-secondary hover:text-text-primary w-full cursor-pointer text-end text-sm">
                    {showAdvanced ? 'Hide Advanced Filters' : 'More filters'}
                </button>

                {showAdvanced && (
                    <div className="grid gap-2 sm:grid-cols-3">
                        <Input control={control} name="albumName" label="Album Name" placeholder="eg: Collectors Series" disabled={isSubmitting} />
                        <Input control={control} name="duration" label="Duration (sec)" placeholder="eg: 180" type="number" disabled={isSubmitting} />
                        <Input control={control} name="artistName" label="Artist Name" placeholder="eg: Neil Levang" disabled={isSubmitting} />

                        <div className="col-span-3 mt-4 flex items-center gap-2">
                            <hr className="flex-1" />
                            <span className="text-text-secondary text-sm">or</span>
                            <hr className="flex-1" />
                        </div>

                        <Input
                            control={control}
                            name="id"
                            label="Lrclib ID"
                            placeholder="eg: 1"
                            type="number"
                            classNames={{ container: 'col-span-3' }}
                            disabled={isSubmitting}
                        />
                    </div>
                )}

                <ErrorMessage message={errors.root?.message} />

                <button type="submit" disabled={isSubmitting} className="button button-highlight mx-auto">
                    {isSubmitting ? 'Searching...' : 'Search Lyrics'}
                </button>
            </form>

            {!isSubmitting && lyrics && (
                <div className="space-y-4 p-2">
                    <h3 className="font-aladin text-text-primary flex items-center justify-between text-xl tracking-wider">
                        Search Results: <span className="text-text-secondary text-sm">{Array.isArray(lyrics) ? lyrics.length : 1}</span>
                    </h3>
                    {(Array.isArray(lyrics) ? lyrics : [lyrics]).map((lyric) => (
                        <LyricsResult key={lyric.id} lyric={lyric} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default memo(SearchLyrics);
