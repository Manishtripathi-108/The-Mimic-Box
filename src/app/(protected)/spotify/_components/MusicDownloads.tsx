'use client';

import isEqual from 'lodash.isequal';
import toast from 'react-hot-toast';

import { getSpotifyEntityTracks } from '@/actions/spotify.actions';
import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
import useMapSpotifyTracksToSaavn from '@/hooks/useMapSpotifyTracksToSaavn';
import { T_TrackContext } from '@/lib/types/client.types';
import { downloadZip } from '@/lib/utils/client-archiver.utils';
import cn from '@/lib/utils/cn';
import { downloadFile } from '@/lib/utils/file.utils';

const QUALITIES = ['12kbps', '48kbps', '96kbps', '160kbps', '320kbps'];

type Props = {
    className?: string;
    context?: T_TrackContext;
    downloadCurrent?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const MusicDownloads = ({ className, context, downloadCurrent = false, ...props }: Props) => {
    const { current, playbackContext, queue } = useAudioPlayerContext();
    const { mapTracks } = useMapSpotifyTracksToSaavn();

    const handleDownload = async (quality: string) => {
        const toastId = toast.loading('Loading tracks...');
        try {
            // 1. Download current playing track
            if (downloadCurrent && current) {
                const url = current.urls.find((u) => u.quality === quality);
                if (url) {
                    await downloadFile(url.url, `${current.title} - ${quality}.mp3`);
                    toast.success('Track downloaded successfully!', { id: toastId });
                    return;
                }
            }

            // 2. Download from queue if context matches
            if (playbackContext && isEqual(playbackContext, context)) {
                const files = queue
                    .map((track) => {
                        const url = track.urls.find((u) => u.quality === quality);
                        return url ? { url: url.url, filename: `${track.title} - ${quality}.mp3` } : null;
                    })
                    .filter(Boolean) as { url: string; filename: string }[];

                if (files.length > 0) {
                    await downloadZip(files, `${playbackContext.name} Queue - ${quality}.zip`);
                    toast.success('Queue downloaded successfully!', { id: toastId });
                    return;
                }
            }

            // 3. Download mapped Saavn tracks for the provided context
            if (context) {
                const res = await getSpotifyEntityTracks(context.id, context.type);
                if (!res.success) {
                    toast.error('Failed to fetch Spotify tracks', { id: toastId });
                    console.error('Failed to fetch Spotify tracks', res.error);
                    return;
                }

                const saavnTracks = await mapTracks({ context, spotifyTracks: res.payload });

                const files = saavnTracks
                    .map((track) => {
                        const url = track.urls.find((u) => u.quality === quality);
                        return url ? { url: url.url, filename: `${track.title} - ${quality}.mp3` } : null;
                    })
                    .filter(Boolean) as { url: string; filename: string }[];

                if (files.length > 0) {
                    await downloadZip(files, `${context.name} - ${quality}.zip`);
                    toast.success('Saavn tracks downloaded successfully!', { id: toastId });
                    return;
                } else {
                    toast.error('No Saavn tracks available at selected quality.', { id: toastId });
                    console.error('No Saavn tracks available at selected quality.');
                }
            }
        } catch (err) {
            toast.error('Error while downloading music', { id: toastId });
            console.error('Error while downloading music:', err);
        }
    };

    return (
        <div
            id="download-popover"
            role="tooltip"
            className={cn('bg-tertiary text-text-secondary absolute inset-auto m-0 overflow-hidden rounded-md border shadow-lg', className)}
            {...props}>
            <ul className="divide-y">
                {QUALITIES.map((quality) => (
                    <li key={quality}>
                        <button
                            type="button"
                            className="hover:bg-highlight block w-full cursor-pointer px-4 py-2 hover:text-white"
                            onClick={() => handleDownload(quality)}>
                            {quality}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicDownloads;
