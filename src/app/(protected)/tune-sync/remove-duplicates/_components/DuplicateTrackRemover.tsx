'use client';

import { Fragment, useCallback, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

import { deduplicatePlaylistItems } from '@/actions/tune-sync.actions';
import { NoDataCard } from '@/components/layout/NoDataCard';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Checkbox from '@/components/ui/form/Checkbox';
import { T_DuplicateTrack, T_RemoveDuplicates, T_RemoveDuplicatesSource } from '@/lib/types/common.types';

type T_FormData = {
    trackId: string[];
};

type DuplicateTrackRemoverProps = {
    duplicates: T_DuplicateTrack[];
    source: T_RemoveDuplicatesSource;
    playlistId: string;
};

const parseSelectedToMap = (selected: string[]) => {
    const map = new Map<string, { positions: number[]; isSameId: boolean }>();
    for (const json of selected) {
        try {
            const { id, position, isSameId } = JSON.parse(json);
            if (typeof id !== 'string' || typeof position !== 'number') continue;

            const entry = map.get(id) ?? { positions: [], isSameId: false };
            entry.positions.push(position);
            entry.isSameId ||= Boolean(isSameId);
            map.set(id, entry);
        } catch {
            // ignore invalid JSON entries
        }
    }
    return map;
};

const buildDedupArgs = (
    playlistId: string,
    source: T_RemoveDuplicatesSource,
    trackMap: Map<string, { positions: number[]; isSameId: boolean }>
): T_RemoveDuplicates => {
    if (source === 'spotify') {
        const tracksToRemove = Array.from(trackMap, ([id, value]) => ({ uri: id, ...value }));
        return { playlistId, data: { tracks: tracksToRemove }, source };
    }
    // saavn style expects array of ids
    return { playlistId, data: Array.from(trackMap.keys()), source: 'saavn' };
};

export default function DuplicateTrackRemover({ duplicates, source, playlistId }: DuplicateTrackRemoverProps) {
    const {
        handleSubmit,
        setValue,
        control,
        register,
        reset,
        formState: { isSubmitting },
    } = useForm<T_FormData>({
        defaultValues: { trackId: [] },
    });

    const selectedTrackIds = useWatch({ control, name: 'trackId' });
    const [localDuplicates, setLocalDuplicates] = useState<T_DuplicateTrack[]>(duplicates);
    const router = useRouter();

    // Flatten all duplicate IDs + positions for easy selection tracking
    const allTrackIds = useMemo(
        () =>
            localDuplicates.flatMap((group) =>
                group.duplicates.map((t) =>
                    JSON.stringify({
                        id: t.id,
                        position: t.position,
                        isSameId: t.reason === 'same-id',
                    })
                )
            ),
        [localDuplicates]
    );

    const isAllSelected = selectedTrackIds.length === allTrackIds.length && allTrackIds.length > 0;

    // Toggle handler for Select All
    const toggleSelectAll = useCallback(() => {
        setValue('trackId', isAllSelected ? [] : allTrackIds, { shouldValidate: true, shouldDirty: true });
    }, [isAllSelected, allTrackIds, setValue]);

    // Submit handler split into clear steps
    const onSubmit = useCallback(
        async ({ trackId }: T_FormData) => {
            if (isSubmitting) return;

            if (!trackId || trackId.length === 0) {
                toast.error('No duplicates selected.');
                return;
            }

            const toastId = toast.loading('Deleting duplicates...');

            // parse selections
            const trackMap = parseSelectedToMap(trackId);
            const saveDuplicates = localDuplicates;

            if (trackMap.size === 0) {
                toast.error('No valid duplicates found.', { id: toastId });
                return;
            }

            // optimistic UI update
            setLocalDuplicates((prev) =>
                prev.flatMap((group) => {
                    const remaining = group.duplicates.filter((d) => !trackMap.has(d.id));
                    return remaining.length ? [{ ...group, duplicates: remaining }] : [];
                })
            );

            const args = buildDedupArgs(playlistId, source, trackMap);

            const result = await deduplicatePlaylistItems(args);

            if (!result.success) {
                setLocalDuplicates(saveDuplicates);
                toast.error(result.message || 'Failed to delete duplicates', { id: toastId });
                return;
            }

            reset();
            toast.success(`${trackMap.size} duplicate${trackMap.size > 1 ? 's' : ''} deleted.`, { id: toastId });
        },
        [isSubmitting, playlistId, source, reset, localDuplicates]
    );

    if (localDuplicates.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <NoDataCard message="No duplicate tracks found." className="w-full max-w-md">
                    <Button onClick={() => router.back()}>Go Back</Button>
                </NoDataCard>
            </div>
        );
    }

    return (
        <Card className="mx-auto max-w-6xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting}>
                    {/* Header */}
                    <CardHeader>
                        <CardTitle>Duplicate Tracks</CardTitle>
                        <CardDescription>Select tracks to remove duplicates</CardDescription>
                        <CardAction>
                            <Checkbox color="danger" checked={isAllSelected} onChange={toggleSelectAll}>
                                Select All Duplicates
                            </Checkbox>
                        </CardAction>
                    </CardHeader>

                    {/* Duplicate Groups */}
                    <CardContent className="mt-4 space-y-2 md:space-y-0">
                        {localDuplicates.map(
                            (group, idx) =>
                                group.duplicates.length > 0 && (
                                    <motion.div
                                        key={`${group.id}-${idx}`}
                                        className="md:hover:bg-gradient-secondary-to-tertiary bg-gradient-secondary-to-tertiary shadow-floating-xs md:hover:shadow-floating-sm focus-within:shadow-floating-sm focus-within:bg-gradient-secondary-to-tertiary flex flex-col gap-4 divide-y rounded-xl p-4 transition-[box-shadow,_color] md:flex-row md:items-start md:divide-x md:divide-y-0 md:bg-none md:shadow-none"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}>
                                        {/* Original Track */}
                                        <Checkbox
                                            {...register('trackId')}
                                            color="danger"
                                            disabled={group.isSameId}
                                            value={JSON.stringify({ id: group.id, position: group.position, isSameId: group.isSameId })}
                                            className={{ label: 'w-full items-start pb-2 md:w-1/2 md:pb-0', field: 'mt-5' }}>
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

                                        {/* Duplicate Tracks */}
                                        <div className="flex w-full flex-col gap-2 md:w-1/2">
                                            {group.duplicates.map((track, i) => (
                                                <Fragment key={`${track.id}-${i}`}>
                                                    <Checkbox
                                                        {...register('trackId')}
                                                        color="danger"
                                                        value={JSON.stringify({
                                                            id: track.id,
                                                            position: track.position,
                                                            isSameId: track.reason === 'same-id',
                                                        })}
                                                        className={{ label: 'items-start', field: 'mt-2.5' }}>
                                                        <div className="flex items-start gap-2">
                                                            <Image
                                                                src={track.cover}
                                                                alt="cover"
                                                                width={40}
                                                                height={40}
                                                                className="h-10 w-10 rounded"
                                                            />
                                                            <div className="flex-1 space-y-0.5 text-sm">
                                                                <div className="text-text-primary">{track.title}</div>
                                                                <div className="text-text-secondary text-xs">{track.artist}</div>
                                                                <div className="text-text-secondary text-xs">{track.album}</div>
                                                                <div className="mt-1 flex items-center gap-2">
                                                                    <Badge variant="outline">#{track.position}</Badge>
                                                                    <Badge variant="danger">
                                                                        {track.reason === 'same-id' ? 'Same ID' : 'Same Title'}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Checkbox>
                                                    <hr className="last:hidden" />
                                                </Fragment>
                                            ))}
                                        </div>
                                    </motion.div>
                                )
                        )}
                    </CardContent>

                    {/* Submit */}
                    <Button
                        icon="trash"
                        size="lg"
                        type="submit"
                        variant="danger"
                        className="fixed right-4 bottom-4 z-10 md:right-16"
                        disabled={isSubmitting || !selectedTrackIds.length}>
                        Delete Selected ({selectedTrackIds.length})
                    </Button>
                </fieldset>
            </form>
        </Card>
    );
}
