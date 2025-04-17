'use server';

import { existsSync } from 'fs';
import { extname } from 'path';
import sharp from 'sharp';
import { v4 as uuidV4 } from 'uuid';

import { AudioFileValidationSchema } from '@/lib/schema/audio.validations';
import { convertAudioFormat, editAudioMetadata, extractAudioMetadata } from '@/lib/services/audio.service';
import { T_AudioAdvanceSettings } from '@/lib/types/common.types';
import { createZipFile } from '@/lib/utils/archiver.utils';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { cleanupFiles, cleanupFilesAfterDelay, createDirectoryIfNotExists, getTempPath, saveUploadedFile } from '@/lib/utils/file-server-only.utils';
import { safeAwait, safeAwaitAll } from '@/lib/utils/safeAwait.utils';

export const handleExtractAudioMetadata = async (file: File) => {
    console.log('handleExtractAudioMetadata', file.name);

    const parsedFile = AudioFileValidationSchema.safeParse([file]);
    if (!parsedFile.success) return createErrorReturn(parsedFile.error.errors[0].message);

    const [saveError, fileDetails] = await safeAwait(
        saveUploadedFile({
            file: parsedFile.data[0],
            destinationFolder: 'audio',
            isTemporary: true,
        })
    );

    if (saveError || !fileDetails) return createErrorReturn('Error saving the audio file.', saveError);

    const [error, response] = await safeAwait(extractAudioMetadata(fileDetails.fullPath));
    if (error || !response.success) return createErrorReturn(response?.message || 'Error extracting audio metadata', error);

    return createSuccessReturn(response.message, { ...response.payload, fileName: fileDetails.fileName });
};

export const handleEditMetadata = async (fileName: string, metaTags: string, coverImage: File) => {
    if (!fileName || !metaTags) return createErrorReturn('Audio file or metadata is missing. Please provide valid inputs.');

    const metadata = typeof metaTags === 'string' ? JSON.parse(metaTags) : metaTags;
    const tempAudioPath = getTempPath('audio', fileName);

    if (!existsSync(tempAudioPath)) return createErrorReturn('Audio file not found. Please reupload a valid file.');

    let coverImagePath: string | null = null;

    if (coverImage instanceof File) {
        const outputPath = getTempPath('images', `cover_${Date.now()}.jpg`);
        const buffer = Buffer.from(await coverImage.arrayBuffer());

        const [error] = await safeAwait(sharp(buffer).resize(640, 640).toFormat('jpg').toFile(outputPath));
        if (!error) coverImagePath = outputPath;
    }

    const result = await editAudioMetadata(tempAudioPath, metadata, coverImagePath);
    cleanupFiles([tempAudioPath, coverImagePath].filter((path): path is string => path !== null));

    if (!result.success) return result;

    cleanupFilesAfterDelay([result.payload.fileUrl], 60);
    return createSuccessReturn(result.message, { downloadUrl: result.payload.fileUrl, fileName: `edited_audio${extname(fileName)}` });
};

export const handleConvertAudio = async (files: File[], settings: T_AudioAdvanceSettings | T_AudioAdvanceSettings[]) => {
    if (!files.length || !settings || (Array.isArray(settings) && !settings.length)) {
        return createErrorReturn('No files or settings provided.');
    }

    if (Array.isArray(settings) && settings.length !== files.length) {
        return createErrorReturn('Settings length must match the number of files.');
    }

    const normalizedSettings = Array.isArray(settings) ? settings : Array(files.length).fill(settings);

    const validationResult = AudioFileValidationSchema.safeParse(files);
    if (!validationResult.success) {
        return createErrorReturn('Invalid audio files.', null, validationResult.error.errors);
    }

    const savedResults = await safeAwaitAll(
        validationResult.data.map((file) =>
            saveUploadedFile({
                file,
                destinationFolder: 'audio',
                isTemporary: true,
            })
        )
    );

    const validFiles = savedResults.flatMap(([, result]) => (result ? [result] : []));

    if (!validFiles.length) {
        return createErrorReturn('Error saving the audio files.');
    }

    const convertedFileUrls: string[] = [];

    await Promise.all(
        validFiles.map(async (fileDetail, i) => {
            const result = await convertAudioFormat(fileDetail.fullPath, fileDetail.fileName, normalizedSettings[i]);

            if (result.success) {
                convertedFileUrls.push(result.payload.fileUrl);
            }

            cleanupFiles([fileDetail.fullPath]);
        })
    );

    if (!convertedFileUrls.length) {
        return createErrorReturn('Failed to convert any files.');
    }

    const zipDir = getTempPath('zip');
    const zipFileName = `converted_${Date.now()}.zip`;
    const zipFilePath = getTempPath('zip', zipFileName);

    await createDirectoryIfNotExists(zipDir);
    await createZipFile(convertedFileUrls, zipFilePath);

    cleanupFiles(convertedFileUrls);
    cleanupFilesAfterDelay([zipFilePath], 60);

    return createSuccessReturn('Files converted successfully!', {
        downloadUrl: zipFilePath,
        fileName: `converted_${uuidV4()}.zip`,
    });
};
