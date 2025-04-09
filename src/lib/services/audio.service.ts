import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

import { IMAGE_URL } from '@/constants/client.constants';
import { uploadToCloud } from '@/lib/services/cloud-storage.service';
import { ErrorResponseOutput, SuccessResponseOutput } from '@/lib/types/response.types';
import { AudioConversionOptions, FFProbeMetadata } from '@/lib/types/server.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { createDirectoryIfNotExists, getTempPath } from '@/lib/utils/file-path.utils';

const getMetadataFromFFprobe = (fileUrl: string): Promise<FFProbeMetadata> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileUrl, (error, metadata) => {
            if (error) {
                reject(new Error('Failed to extracting metadata.'));
            } else {
                resolve(metadata as FFProbeMetadata);
            }
        });
    });
};

const extractLyrics = (fileUrl: string): Promise<string> => {
    return new Promise((resolve) => {
        const command = `ffprobe -i "${fileUrl}" -show_entries format_tags=lyrics -of json`;
        exec(command, (error, stdout) => {
            if (error) return resolve('No lyrics found');
            try {
                const lyrics = JSON.parse(stdout)?.format?.tags?.lyrics ?? 'No lyrics found';
                resolve(lyrics);
            } catch {
                resolve('No lyrics found');
            }
        });
    });
};

const getAudioDuration = (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                resolve(metadata?.format?.duration ?? 0);
            }
        });
    });
};

export const extractAudioMetadata = async (
    fileUrl: string
): Promise<SuccessResponseOutput<{ metadata: Record<string, string>; coverImage: string }> | ErrorResponseOutput> => {
    try {
        const coverImagePath = getTempPath('images', `cover_${Date.now()}.jpg`);
        await createDirectoryIfNotExists(getTempPath('images'));

        const metadata = await getMetadataFromFFprobe(fileUrl);
        const lyrics = await extractLyrics(fileUrl);
        metadata.format = { ...(metadata.format ?? {}), tags: { ...metadata.format?.tags, lyrics } };

        const coverStream = metadata.streams?.find((stream) => stream.codec_name === 'mjpeg' || stream.codec_type === 'video');

        let coverImage = IMAGE_URL.AUDIO_COVER_FALLBACK;
        if (coverStream) {
            try {
                await new Promise((resolve, reject) => {
                    ffmpeg(fileUrl).outputOptions('-map', `0:${coverStream.index}`).save(coverImagePath).on('end', resolve).on('error', reject);
                });

                const uploadResult = await uploadToCloud({
                    file: coverImagePath,
                    destinationFolder: 'images',
                    type: 'image',
                });

                coverImage = uploadResult.success && uploadResult.payload?.url ? uploadResult.payload.url : IMAGE_URL.AUDIO_COVER_FALLBACK;
            } catch (error) {
                console.warn('Error uploading or extracting cover image', error);
            }
        }

        return createSuccessReturn('Audio metadata extracted successfully', {
            metadata: metadata?.format?.tags ?? {},
            coverImage,
        });
    } catch (error) {
        return createErrorReturn('Failed to extract audio metadata', error instanceof Error ? error : new Error(String(error)));
    }
};

export const editAudioMetadata = async (
    fileUrl: string,
    fileExtension: string,
    metadata: Record<string, string>,
    coverImagePath: string
): Promise<SuccessResponseOutput<{ fileUrl: string }> | ErrorResponseOutput> => {
    try {
        const outputFilePath = getTempPath('audio', `edited_${Date.now()}${fileExtension}`);
        await createDirectoryIfNotExists(getTempPath('audio'));

        const command = ffmpeg(fileUrl);

        // Attach cover image if provided
        if (coverImagePath) {
            command
                .input(coverImagePath)
                .outputOptions('-map', '0:a', '-map', '1', '-disposition:v', 'attached_pic')
                .outputOptions('-metadata:s:v', 'comment=Cover (front)');
        }

        // Add metadata
        Object.entries(metadata).forEach(([key, value]) => {
            command.outputOptions('-metadata', `${key}=${value || ''}`);
        });

        await new Promise((resolve, reject) => {
            command.outputOptions('-c', 'copy').save(outputFilePath).on('end', resolve).on('error', reject);
        });

        return createSuccessReturn('Audio metadata edited successfully', { fileUrl: outputFilePath });
    } catch (error) {
        return createErrorReturn('Failed to edit audio metadata', error instanceof Error ? error : new Error(String(error)));
    }
};

export const convertAudioFormat = async (
    fileUrl: string,
    fileName: string,
    targetFormat = 'm4a',
    bitrate = 192,
    options: AudioConversionOptions
): Promise<SuccessResponseOutput<{ fileUrl: string }> | ErrorResponseOutput> => {
    try {
        const outputFilePath = getTempPath('audio', `converted_${fileName.split('.')[0]}.${targetFormat}`);
        await createDirectoryIfNotExists(getTempPath('audio'));

        const encoders = await new Promise<Record<string, unknown>>((resolve, reject) => {
            ffmpeg().availableEncoders((err, list) => (err ? reject(err) : resolve(list)));
        });
        // Determine the best available AAC encoder
        let aacEncoder = 'aac';
        if (encoders.aac_at) aacEncoder = 'aac_at';
        else if (encoders.libfdk_aac) aacEncoder = 'libfdk_aac';

        const command = ffmpeg(fileUrl);
        if (targetFormat === 'm4a') {
            command.audioCodec(aacEncoder).videoCodec('copy').outputOptions('-metadata:s:v', 'comment=Cover (front)');
        }

        if (options.audio.channels !== '0') command.audioChannels(Number(options.audio.channels));
        if (options.audio.volume !== 100) command.audioFilters(`volume=${20 * Math.log10(options.audio.volume / 100)}dB`);
        if (options.audio.sampleRate) command.audioFrequency(Number(options.audio.sampleRate));
        if (options.effects.fadeIn) command.audioFilters(`afade=t=in:ss=0:d=${options.effects.fadeIn}`);
        if (options.effects.fadeOut) {
            const duration = await getAudioDuration(fileUrl);
            const start = Math.max(0, duration - (options.effects.fadeOut ?? 0));
            command.audioFilters(`afade=t=out:st=${start}:d=${options.effects.fadeOut}`);
        }
        if (options.effects.playbackSpeed && options.effects.playbackSpeed !== '1.0x (Normal)') {
            const speed = parseFloat(options.effects.playbackSpeed.replace('x', ''));
            command.audioFilters(`atempo=${speed}`);
        }
        if (options.effects.pitchShift) command.audioFilters(`asetrate=${options.effects.pitchShift}`);
        if (options.effects.normalize) command.audioFilters('loudnorm');
        if (options.trim.trimStart) command.setStartTime(options.trim.trimStart);
        if (options.trim.trimEnd) command.setDuration(options.trim.trimEnd);

        await new Promise((resolve, reject) => {
            command.audioBitrate(bitrate).save(outputFilePath).on('end', resolve).on('error', reject);
        });

        return createSuccessReturn('Audio converted successfully', { fileUrl: outputFilePath });
    } catch (error) {
        return createErrorReturn('Failed to convert audio format', error instanceof Error ? error : new Error(String(error)));
    }
};
