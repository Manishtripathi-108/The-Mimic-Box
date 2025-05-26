'use client';

import JSZip from 'jszip';
import isEqual from 'lodash.isequal';
import toast from 'react-hot-toast';

import { getSpotifyEntityTracks } from '@/actions/spotify.actions';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import { useDownload } from '@/contexts/Download.context';
import { useFFmpeg } from '@/hooks/useFFmpeg.hook';
import useMapSpotifyTracksToSaavn from '@/hooks/useMapSpotifyTracksToSaavn';
import { T_AudioFile, T_AudioPlayerTrack, T_TrackContext } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';
import { downloadFile } from '@/lib/utils/file.utils';

const QUALITIES = ['12kbps', '48kbps', '96kbps', '160kbps', '320kbps'];

type Props = {
    className?: string;
    context?: T_TrackContext;
    downloadCurrent?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const batchSize = 5;

const MusicDownloads = ({ className, context, downloadCurrent = false, ...props }: Props) => {
    const { currentTrack, playbackContext, queue } = useAudioPlayerContext();
    const { mapTracks } = useMapSpotifyTracksToSaavn();
    const { addDownload, updateDownload } = useDownload();

    const { isLoaded, load, writeFile, exec, readFile, deleteFile } = useFFmpeg();
    const prepareMetadataArgs = (metadata: Record<string, string | number>) =>
        Object.entries(metadata).flatMap(([k, v]) => ['-metadata', `${k}=${v}`]);

    const getTracksToDownload = async (): Promise<T_AudioPlayerTrack[]> => {
        if (playbackContext && isEqual(playbackContext, context)) {
            return queue;
        }

        if (context) {
            const res = await getSpotifyEntityTracks(context.id, context.type);
            if (!res.success) throw new Error('Failed to fetch Spotify tracks');

            return await mapTracks({ context, spotifyTracks: res.payload });
        }

        throw new Error('No tracks available to download');
    };

    const buildAudioFileFromTrack = (track: T_AudioPlayerTrack, quality: string): T_AudioFile | null => {
        const url = track.urls.find((u) => u.quality === quality);
        if (!url) return null;

        return {
            src: url.url,
            filename: track.title,
            cover: track.covers?.find((c) => c.quality === '500x500')?.url,
            metadata: {
                title: track.title,
                artist: track.artists || 'Unknown Artist',
                album: track.album || 'Unknown Album',
                year: track.year || 'Unknown Year',
                language: track.language || 'Unknown Language',
            },
        };
    };

    const processBatch = async (tracks: T_AudioPlayerTrack[], quality: string) => {
        if (!isLoaded) await load();

        const audioFiles = tracks.map((track) => buildAudioFileFromTrack(track, quality)).filter(Boolean) as T_AudioFile[];
        if (!audioFiles.length) throw new Error('Track not available at selected quality.');
        const downloads = audioFiles.map((file) => ({
            id: file.src,
            title: file.filename || 'Unknown Track',
            url: file.src,
        }));

        downloads.forEach((download) => addDownload(download));

        const zip = new JSZip();
        for (let i = 0; i < audioFiles.length; i += batchSize) {
            const batch = audioFiles.slice(i, i + batchSize);
            for (let j = 0; j < batch.length; j++) {
                const file = batch[j];
                const idx = i + j;
                const inputName = `input_${idx}.mp4`;
                const outputName = `${file.filename || `output_${idx}`}.m4a`;
                const coverName = file.cover ? `cover_${idx}.jpg` : null;

                updateDownload(file.src, { status: 'downloading', progress: 0 });
                await writeFile(inputName, file.src);
                updateDownload(file.src, { status: 'processing', progress: 0 });

                const args = ['-i', inputName];

                if (coverName && file.cover) {
                    await writeFile(coverName, file.cover);
                    args.push(
                        '-i',
                        coverName,
                        '-map',
                        '0:a',
                        '-map',
                        '1',
                        '-disposition:v',
                        'attached_pic',
                        '-metadata:s:v',
                        'comment=Cover (front)'
                    );
                }

                args.push(...prepareMetadataArgs(file.metadata), '-codec', 'copy', outputName);
                await exec(args);

                const output = await readFile(outputName);
                zip.file(outputName, output);

                await deleteFile(inputName);
                if (coverName) await deleteFile(coverName);
                await deleteFile(outputName);
                updateDownload(file.src, { status: 'ready', progress: 100 });
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });

        downloadFile(zipBlob, `${context?.name || 'Tracks'} - ${new Date().toISOString()}.zip`);
    };

    const downloadTracks = async (quality: string) => {
        const toastId = toast.loading('Loading tracks...');
        try {
            if (downloadCurrent && currentTrack) {
                await processBatch([currentTrack], quality);
                toast.success('Track downloaded with metadata!', { id: toastId });
                return;
            }

            const tracks = await getTracksToDownload();
            if (!tracks.length) throw new Error('No valid tracks found for selected quality.');

            await processBatch(tracks, quality);
            toast.success('Tracks downloaded with metadata!', { id: toastId });
        } catch (err) {
            toast.error((err as Error).message || 'Error while downloading music', { id: toastId });
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
                            onClick={() => downloadTracks(quality)}>
                            {quality}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MusicDownloads;
