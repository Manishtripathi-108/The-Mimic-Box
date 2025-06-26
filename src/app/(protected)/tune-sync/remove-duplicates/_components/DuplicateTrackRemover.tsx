'use client';

import React, { useEffect, useMemo } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

import { deduplicatePlaylistItems } from '@/actions/tune-sync.actions';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
        register,
        handleSubmit,
        setValue,
        control,
        formState: { isSubmitting },
    } = useForm<T_FormData>({
        defaultValues: { trackId: [''] },
    });

    const selectedTrackIds = useWatch({ control, name: 'trackId' });
    const isAllSelected = useWatch({ control, name: 'selectAll' });
    console.log('🪵 > DuplicateTrackRemover.tsx:41 > selectedTrackIds:', selectedTrackIds);

    const allTrackIds = useMemo(
        () => duplicates.flatMap((group) => group.duplicates.map((t) => JSON.stringify({ id: t.id, position: t.position }))),
        [duplicates]
    );

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

    const onSubmit = async ({ trackId }: T_FormData) => {
        const trackMap = new Map<string, number[]>();

        for (const json of trackId) {
            try {
                const { id, position } = JSON.parse(json);
                if (typeof id === 'string' && typeof position === 'number') {
                    if (!trackMap.has(id)) trackMap.set(id, []);
                    trackMap.get(id)!.push(position);
                }
            } catch {
                continue;
            }
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
            <fieldset disabled={isSubmitting} className="mx-auto max-w-6xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-text-primary text-lg font-semibold">Duplicate Tracks</h2>
                    <label className="form-checkbox">
                        <input type="checkbox" className="checkbox-field" checked={isAllSelected} onChange={handleSelectAllChange} />
                        <span className="form-text">Select All</span>
                    </label>
                </div>

                <div className="space-y-4">
                    {duplicates.map((group, idx) => (
                        <motion.div
                            key={`${group.id}-${idx}`}
                            className="bg-secondary shadow-floating-sm flex flex-col gap-4 rounded-xl p-4 md:flex-row md:items-start"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}>
                            {/* Original Track */}
                            <div className="flex w-full items-center gap-3 md:w-1/2">
                                <input
                                    type="checkbox"
                                    className="checkbox-field"
                                    value={JSON.stringify({ id: group.id, position: group.position })}
                                    {...register('trackId')}
                                />
                                <Image src={group.cover} alt="cover" width={52} height={52} className="size-14 rounded" />
                                <div className="space-y-0.5 text-sm">
                                    <div className="text-text-primary font-medium">{group.title}</div>
                                    <div className="text-text-secondary text-xs">{group.artist}</div>
                                    <div className="text-text-secondary text-xs">{group.album}</div>
                                    <Badge variant="outline">#{group.position}</Badge>
                                </div>
                            </div>

                            {/* Duplicates */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                {group.duplicates.map((track, i) => (
                                    <label key={`${track.id}-${i}`} className="form-checkbox flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox-field"
                                            value={JSON.stringify({ id: track.id, position: track.position })}
                                            {...register('trackId')}
                                        />
                                        <Image src={track.cover} alt="cover" width={40} height={40} className="h-10 w-10 rounded" />
                                        <div className="flex-1 space-y-0.5 text-sm">
                                            <div className="text-text-primary">{track.title}</div>
                                            <div className="text-text-secondary text-xs">{track.artist}</div>
                                            <div className="text-text-secondary text-xs">{track.album}</div>
                                            <div className="mt-1 flex items-center gap-2">
                                                <Badge variant="outline">#{track.position}</Badge>
                                                <Badge variant="danger">{track.reason === 'same-id' ? 'Same ID' : 'Same Title'}</Badge>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Submit button */}
                <div className="sticky bottom-4 z-10 flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting || !selectedTrackIds.length} variant="danger" icon="trash">
                        Delete Selected ({selectedTrackIds.length})
                    </Button>
                </div>
            </fieldset>
        </form>
    );
}
