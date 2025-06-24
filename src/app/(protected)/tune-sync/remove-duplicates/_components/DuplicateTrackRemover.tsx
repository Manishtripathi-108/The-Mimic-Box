'use client';

import React, { useEffect, useMemo } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { deduplicatePlaylistItems } from '@/actions/tune-sync.actions';
import { T_DuplicateTrack, T_RemoveDuplicates, T_RemoveDuplicatesSource } from '@/lib/types/common.types';

type T_FormData = {
    selectAll?: boolean;
    trackId: string[];
};

export default function DuplicateTrackRemover({
    duplicates,
    source,
    playlistId,
}: {
    duplicates: T_DuplicateTrack[];
    source: T_RemoveDuplicatesSource;
    playlistId: string;
}) {
    const {
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { isSubmitting },
    } = useForm<T_FormData>({
        defaultValues: { trackId: [] },
    });

    const selectedTrackIds = watch('trackId');
    const isAllSelected = watch('selectAll');

    const allTrackIds = useMemo(() => duplicates.flatMap((group) => group.duplicates.map((t) => t.id)), [duplicates]);

    // Handle manual toggle of "Select All"
    const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setValue('selectAll', checked);
        setValue('trackId', checked ? allTrackIds : []);
    };

    // Watch for individual changes and sync selectAll state
    useEffect(() => {
        const allSelected = selectedTrackIds.length === allTrackIds.length && allTrackIds.length > 0;
        const noneSelected = selectedTrackIds.length === 0;

        // Only update selectAll if it's different to avoid infinite loop
        if (isAllSelected !== allSelected && !noneSelected) {
            setValue('selectAll', allSelected);
        }
        if (noneSelected && isAllSelected) {
            setValue('selectAll', false);
        }
    }, [selectedTrackIds, allTrackIds, isAllSelected, setValue]);

    const onSubmit = async (data: T_FormData) => {
        const parsedTrackData: { id: string; position: number }[] = [];
        for (const json of data.trackId) {
            try {
                const parsed = JSON.parse(json) as { id: string; position: number };
                if (parsed && typeof parsed.id === 'string' && typeof parsed.position === 'number') {
                    parsedTrackData.push(parsed);
                }
            } catch {
                // Skip malformed JSON
            }
        }

        // group positions by ID
        const trackMap = new Map<string, number[]>();
        for (const { id, position } of parsedTrackData) {
            if (!trackMap.has(id)) trackMap.set(id, []);
            trackMap.get(id)!.push(position);
        }

        if (!trackMap.size) {
            toast.error('No duplicates selected.');
            return;
        }

        const toastId = toast.loading('Deleting duplicates...');
        try {
            let args: T_RemoveDuplicates;

            if (source === 'spotify') {
                const tracksToRemove = Array.from(trackMap.entries()).map(([id, positions]) => ({ uri: id, positions }));
                args = {
                    playlistId: playlistId,
                    data: { tracks: tracksToRemove },
                    source: 'spotify',
                };
            } else {
                const tracksToRemove = Array.from(trackMap.entries()).map(([id]) => id);

                args = {
                    playlistId: playlistId,
                    data: tracksToRemove,
                    source: 'saavn',
                };
            }

            const result = await deduplicatePlaylistItems(args);

            if (!result.success) {
                toast.error(result.message || 'Failed to delete duplicates', { id: toastId });
                return;
            }

            toast.success(`${trackMap.size} duplicate${trackMap.size > 1 ? 's' : ''} deleted.`, { id: toastId });
        } catch (error) {
            console.error('🪵 Error deleting duplicates:', error);
            toast.error('Failed to delete duplicates. Please try again.', { id: toastId });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <fieldset disabled={isSubmitting}>
                <div className="mx-auto max-w-5xl space-y-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-text-primary text-lg font-semibold">Duplicate Tracks</h2>
                        <label className="form-checkbox">
                            <input type="checkbox" className="checkbox-field" checked={isAllSelected} onChange={handleSelectAllChange} />
                            <span className="form-text">Select All</span>
                        </label>
                    </div>

                    {duplicates.map((group, idx) => (
                        <motion.div
                            key={`${group.id}-${idx}`}
                            className="bg-secondary shadow-floating-sm rounded-xl p-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}>
                            <div className="mb-3 flex items-center gap-3">
                                <Image src={group.cover} alt="cover" height={52} width={52} className="size-16 rounded" />
                                <div className="text-sm">
                                    <div className="text-text-primary font-medium">{group.title}</div>
                                    <div className="text-text-secondary text-xs">{group.artist}</div>
                                    <div className="text-text-secondary text-xs">{group.album}</div>
                                    <div className="text-text-secondary text-xs">{group.position}</div>
                                    <div className="text-xs text-green-500">Original</div>
                                </div>
                            </div>

                            <div className="ml-4 space-y-2">
                                {group.duplicates.map((track, i) => (
                                    <label key={`${track.id}-${i}`} className="form-checkbox flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox-field"
                                            value={JSON.stringify({ id: track.id, position: track.position })}
                                            {...register('trackId')}
                                        />
                                        <Image src={track.cover} alt="cover" height={40} width={40} className="h-10 w-10 rounded" />
                                        <div className="text-sm">
                                            <div className="text-text-primary">{track.title}</div>
                                            <div className="text-text-secondary text-xs">{track.artist}</div>
                                            <div className="text-text-secondary text-xs">{track.album}</div>
                                            <div className="text-text-secondary text-xs">{track.position}</div>
                                        </div>
                                        <span className="text-xs text-red-500">{track.reason === 'same-id' ? 'Same ID' : 'Same Title'}</span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="sticky bottom-4 z-10 flex justify-end py-4">
                    <button type="submit" disabled={!selectedTrackIds.length} className="button button-danger">
                        Delete Selected ({selectedTrackIds.length})
                    </button>
                </div>
            </fieldset>
        </form>
    );
}
