import { exec } from 'child_process';
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import { extname } from 'path';

import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { uploadToCloud } from '@/lib/services/cloud-storage.service';
import { T_AudioAdvanceSettings } from '@/lib/types/common.types';
import { ErrorResponseOutput, SuccessResponseOutput } from '@/lib/types/response.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { createDirectoryIfNotExists, getTempPath } from '@/lib/utils/file-server-only.utils';

const getMetadataFromFFprobe = (fileUrl: string): Promise<FfprobeData> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(fileUrl, (error, metadata) => {
            if (error) {
                reject(new Error('Failed to extracting metadata.'));
            } else {
                resolve(metadata);
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
): Promise<SuccessResponseOutput<{ metadata: FfprobeData['format']['tags']; coverImage: string }> | ErrorResponseOutput> => {
    try {
        const coverImagePath = getTempPath('images', `cover_${Date.now()}.jpg`);
        await createDirectoryIfNotExists(getTempPath('images'));

        const metadata = await getMetadataFromFFprobe(fileUrl);
        const lyrics = await extractLyrics(fileUrl);
        metadata.format = { ...(metadata.format ?? {}), tags: { ...metadata.format?.tags, lyrics } };

        const coverStream = metadata.streams?.find((stream) => stream.codec_name === 'mjpeg' || stream.codec_type === 'video');

        let coverImage = IMAGE_FALLBACKS.AUDIO_COVER;
        if (coverStream) {
            try {
                await new Promise((resolve, reject) => {
                    ffmpeg(fileUrl).outputOptions('-map', `0:${coverStream.index}`).save(coverImagePath).on('end', resolve).on('error', reject);
                });

                const uploadResult = await uploadToCloud({
                    file: coverImagePath,
                    destinationFolder: 'audio-covers',
                    type: 'image',
                    isTemporary: true,
                    removeLocalCopy: true,
                });

                coverImage = uploadResult.success && uploadResult.payload?.url ? uploadResult.payload.url : IMAGE_FALLBACKS.AUDIO_COVER;
            } catch (error) {
                console.warn('Error uploading or extracting cover image', error);
            }
        }

        return createSuccessReturn('Audio metadata extracted successfully', {
            metadata: metadata.format.tags ?? {},
            coverImage,
        });
    } catch (error) {
        return createErrorReturn('Failed to extract audio metadata', error instanceof Error ? error : new Error(String(error)));
    }
};

export const editAudioMetadata = async (
    fileUrl: string,
    metadata: FfprobeData['format']['tags'],
    coverImagePath: string | null
): Promise<SuccessResponseOutput<{ fileUrl: string }> | ErrorResponseOutput> => {
    try {
        if (!metadata) return createErrorReturn('No metadata provided');

        const outputFilePath = getTempPath('audio', `edited_${Date.now()}${extname(fileUrl)}`);
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
    options: T_AudioAdvanceSettings
): Promise<SuccessResponseOutput<{ fileUrl: string }> | ErrorResponseOutput> => {
    try {
        const format = options.audio.format.toLowerCase();
        const outputFilePath = getTempPath('audio', `converted_${fileName.split('.')[0]}.${format}`);
        await createDirectoryIfNotExists(getTempPath('audio'));

        console.log('Converting audio format:', options);

        const command = ffmpeg(fileUrl);

        // Handle AAC encoder if m4a
        if (format === 'm4a') {
            const encoders = await new Promise<Record<string, unknown>>((resolve, reject) => {
                ffmpeg().availableEncoders((err, list) => (err ? reject(err) : resolve(list)));
            });
            const aacEncoder = encoders.aac_at ? 'aac_at' : encoders.libfdk_aac ? 'libfdk_aac' : 'aac';
            command.audioCodec(aacEncoder).videoCodec('copy').outputOptions('-metadata:s:v', 'comment=Cover (front)');
        }

        // Audio settings
        if (options.audio.channels !== '0') command.audioChannels(Number(options.audio.channels));
        if (options.audio.sampleRate !== 'no change') command.audioFrequency(parseInt(options.audio.sampleRate));
        if (options.trim.trimStart) command.setStartTime(options.trim.trimStart);
        if (options.trim.trimEnd) command.setDuration(options.trim.trimEnd);

        // Collect audio filters
        const filters: string[] = [];

        if (options.audio.volume !== 100) {
            const db = 20 * Math.log10(options.audio.volume / 100);
            filters.push(`volume=${db}dB`);
        }

        if (options.effects.fadeIn > 0) filters.push(`afade=t=in:ss=0:d=${options.effects.fadeIn}`);
        if (options.effects.fadeOut > 0) {
            const duration = await getAudioDuration(fileUrl);
            const start = Math.max(0, duration - options.effects.fadeOut);
            filters.push(`afade=t=out:st=${start}:d=${options.effects.fadeOut}`);
        }

        if (options.effects.playbackSpeed !== '1.0x (Normal)') {
            const speed = parseFloat(options.effects.playbackSpeed.replace('x', ''));
            filters.push(`atempo=${speed}`);
        }

        if (options.effects.pitchShift !== 0) filters.push(`asetrate=${options.effects.pitchShift}`);
        if (options.effects.normalize) filters.push('loudnorm');

        if (filters.length > 0) command.audioFilters(filters.join(','));

        // Export file
        await new Promise((resolve, reject) => {
            command.audioBitrate(options.audio.bitrate).save(outputFilePath).on('end', resolve).on('error', reject);
        });

        return createSuccessReturn('Audio converted successfully', { fileUrl: outputFilePath });
    } catch (error) {
        return createErrorReturn('Failed to convert audio format', error instanceof Error ? error : new Error(String(error)));
    }
};
