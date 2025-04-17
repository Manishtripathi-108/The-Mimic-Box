'use server';

import { existsSync } from 'fs';
import { extname } from 'path';
import sharp from 'sharp';

import { AudioFileValidationSchema } from '@/lib/schema/audio.validations';
import { convertAudioFormat, editAudioMetadata, extractAudioMetadata } from '@/lib/services/audio.service';
import { T_AudioAdvanceSettings } from '@/lib/types/common.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { cleanupFiles, cleanupFilesAfterDelay, getTempPath, saveUploadedFile } from '@/lib/utils/file-server-only.utils';
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

// export const handleConvertAudio = async (files: File[], settings: T_AudioAdvanceSettings | T_AudioAdvanceSettings[]) => {
//     if (!files || files.length === 0 || !settings || (Array.isArray(settings) && settings.length === 0)) {
//         return createErrorReturn('No ');
//     }

//     let downloadFilePath = null;

//     const parsedFile = AudioFileValidationSchema.safeParse(files);
//     if (!parsedFile.success) return createErrorReturn('Invalid', null, parsedFile.error.errors);

//     const savedFiles = await safeAwaitAll(
//         parsedFile.data.map((file) =>
//             saveUploadedFile({
//                 file,
//                 destinationFolder: 'audio',
//                 isTemporary: true,
//             })
//         )
//     );

//     const validFileDetails = savedFiles.flatMap(([, fileDetails]) => (fileDetails ? [fileDetails] : []));
//     if (validFileDetails.length === 0) return createErrorReturn('Error saving the audio file.');

//     // Convert each file
//     if (validFileDetails.length === 1) {
//         const response = await convertAudioFormat(
//             validFileDetails[0].fullPath,
//             validFileDetails[0]?.fileName,
//             formats?.toLowerCase(),
//             qualities?.toLowerCase(),
//             JSON.parse(advanceSettings) || {}
//         );
//         if (response.success) downloadFilePath = response.payload.fileUrl;
//         cleanupFiles([req.files[0].path]);
//     } else {
//         const convertedFiles = [];

//         await Promise.all(
//             req.files.map(async (file, index) => {
//                 const { success, fileUrl } = await convertAudioFormat(
//                     file.path,
//                     file?.originalname,
//                     formats[index]?.toLowerCase(),
//                     qualities[index]?.toLowerCase(),
//                     JSON.parse(advanceSettings[index]) || {}
//                 );
//                 if (success) convertedFiles.push(fileUrl);
//                 cleanupFiles([file.path]);
//             })
//         );

//         if (convertedFiles.length === 0) {
//             return createErrorReturn('Failed to convert any files');
//         }

//         // Create ZIP file
//         downloadFilePath = getTempPath('zip', `converted_${Date.now()}.zip`);
//         await createDirectoryIfNotExists(getTempPath('zip'));
//         await createZipFile(convertedFiles, downloadFilePath);

//         // Delete converted files after zipping
//         cleanupFiles(convertedFiles);
//     }

//     // Send ZIP file as response
//     res.download(downloadFilePath, `converted_${Date.now()}.${extname(downloadFilePath)}`, (err) => {
//         if (err) {
//             console.error('Error sending ZIP file:', err);
//             res.status(500).json({ success: false, message: 'Failed to send zip file' });
//         } else {
//             setTimeout(() => cleanupFiles([downloadFilePath]), process.env.TEMP_FILE_DELETE_DELAY);
//         }
//     });
// };
