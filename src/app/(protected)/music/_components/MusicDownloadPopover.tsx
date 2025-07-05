'use client';

import { memo, useRef } from 'react';

import deepEqual from 'fast-deep-equal';
import toast from 'react-hot-toast';

import { useAudioDownload } from '@/contexts/AudioDownload.context';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useAudioSourceTrackMapper from '@/hooks/useAudioSourceTrackMapper';
import { useClickOutside } from '@/hooks/useClickOutside';
import { T_AudioPlayerTrack, T_AudioSourceContext } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

const QUALITIES = ['12kbps', '48kbps', '96kbps', '160kbps', '320kbps'];

type Props = {
    className?: string;
    context?: T_AudioSourceContext;
    downloadCurrent?: boolean;
    onClose: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const MusicDownloadPopover = ({ className, context, downloadCurrent = false, onClose, ...props }: Props) => {
    const { currentTrack, playbackContext, queue } = useAudioPlayerContext();
    const { getPlayableTracks, isPending } = useAudioSourceTrackMapper();
    const { downloadTracks } = useAudioDownload();
    const ref = useRef<HTMLDivElement | null>(null);

    useClickOutside({
        targets: [ref],
        onClickOutside: onClose,
    });

    const getTracksToDownload = async (): Promise<T_AudioPlayerTrack[]> => {
        if (playbackContext && deepEqual(playbackContext, context)) return queue;

        if (context) return await getPlayableTracks(context);

        throw new Error('No tracks available to download');
    };

    const handleDownloadTracks = async (quality: string) => {
        onClose?.();
        const toastId = toast.loading('starting download. Please wait...');
        try {
            if (downloadCurrent && currentTrack) {
                downloadTracks([currentTrack], quality, currentTrack.title);
                toast.success('Download started', { id: toastId });
                return;
            }

            const tracks = await getTracksToDownload();
            if (!tracks.length) throw new Error('No valid tracks found for selected quality.');

            downloadTracks(tracks, quality, `${context?.type}-${new Date().getTime()}-${quality}`);
            toast.success('Download started', { id: toastId });
        } catch (err) {
            toast.error((err as Error).message || 'Error while downloading tracks', { id: toastId });
        }
    };

    return (
        <div
            ref={ref}
            id="download-popover"
            role="tooltip"
            className={cn('bg-tertiary text-text-secondary absolute inset-auto m-0 overflow-hidden rounded-md border shadow-lg', className)}
            {...props}>
            <ul className="divide-y">
                {QUALITIES.map((quality) => (
                    <li key={quality}>
                        <button
                            type="button"
                            disabled={isPending}
                            className="hover:bg-highlight block w-full cursor-pointer px-4 py-2 hover:text-white"
                            onClick={() => handleDownloadTracks(quality)}>
                            {quality}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default memo(MusicDownloadPopover);
