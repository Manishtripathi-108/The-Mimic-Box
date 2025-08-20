'use client';

import React, { useEffect, useMemo } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

import { deduplicatePlaylistItems } from '@/actions/tune-sync.actions';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
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
        setValue,
        control,
        register,
        formState: { isSubmitting },
    } = useForm<T_FormData>({
        defaultValues: { trackId: [], selectAll: false },
    });

    const selectedTrackIds = useWatch({ control, name: 'trackId' });
    const isAllSelected = useWatch({ control, name: 'selectAll' });

    const allTrackIds = useMemo(
        () => duplicates.flatMap((group) => group.duplicates.map((t) => JSON.stringify({ id: t.id, position: t.position }))),
        [duplicates]
    );

    // 🔹 Sync selectAll → trackId
    useEffect(() => {
        if (isAllSelected) {
            setValue('trackId', allTrackIds, { shouldValidate: true });
        } else {
            setValue('trackId', [], { shouldValidate: true });
        }
    }, [isAllSelected, allTrackIds, setValue]);

    // 🔹 Keep selectAll updated when trackId changes manually
    useEffect(() => {
        const allSelected = selectedTrackIds.length === allTrackIds.length && allTrackIds.length > 0;
        if (isAllSelected !== allSelected) {
            setValue('selectAll', allSelected);
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
                    <h2 className="text-highlight text-lg font-semibold">Duplicate Tracks</h2>
                    <Checkbox color="danger" {...register('selectAll')}>
                        Select All Duplicates
                    </Checkbox>
                </div>

                <div className="space-y-4">
                    {duplicates.map((group, idx) => (
                        <motion.div
                            key={`${group.id}-${idx}`}
                            className="bg-secondary shadow-floating-sm flex flex-col gap-4 rounded-xl p-4 md:flex-row md:items-start"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}>
                            {/* Original Track */}
                            <Checkbox
                                {...register('trackId')}
                                color="danger"
                                value={JSON.stringify({ id: group.id, position: group.position })}
                                className={{ label: 'w-full items-start md:w-1/2', field: 'mt-5' }}>
                                <div className="flex items-start gap-2">
                                    <Image src={group.cover} alt="cover" width={52} height={52} className="size-14 rounded" />
                                    <div className="space-y-0.5 text-sm">
                                        <div className="text-text-primary font-medium">{group.title}</div>
                                        <div className="text-text-secondary text-xs">{group.artist}</div>
                                        <div className="text-text-secondary text-xs">{group.album}</div>
                                        <Badge variant="outline">#{group.position}</Badge>
                                    </div>
                                </div>
                            </Checkbox>

                            {/* Duplicates */}
                            <div className="flex w-full flex-col gap-2 md:w-1/2">
                                {group.duplicates.map((track, i) => (
                                    <Checkbox
                                        key={`${track.id}-${i}`}
                                        {...register('trackId')}
                                        color="danger"
                                        className={{ label: 'items-start', field: 'mt-2.5' }}
                                        value={JSON.stringify({ id: track.id, position: track.position })}>
                                        <div className="flex items-start gap-2">
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
                                        </div>
                                    </Checkbox>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Submit button */}
                <Button
                    icon="trash"
                    size="lg"
                    type="submit"
                    variant="danger"
                    className="fixed right-4 bottom-4 z-10 sm:right-16"
                    disabled={isSubmitting || !selectedTrackIds.length}>
                    Delete Selected ({selectedTrackIds.length})
                </Button>
            </fieldset>
        </form>
    );
}
