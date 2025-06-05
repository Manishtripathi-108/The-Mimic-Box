import { existsSync, unlinkSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

import { sanitizeFilename } from '@/lib/utils/file.utils';

/**
 * Base directory of the project. Used to construct absolute paths.
 */
const BASE_DIR = process.cwd();

/**
 * Resolves and returns an absolute path under the "storage" directory.
 *
 * @example
 * buildPath('uploads', 'audio.mp3');
 * Returns: /your/project/path/storage/uploads/audio.mp3
 */
export const buildPath = (...segments: string[]): string => {
    return path.resolve(BASE_DIR, 'storage', ...segments);
};

/**
 * Returns a path inside the "uploads" directory.
 *
 * @example
 * getUploadPath('images', 'photo.png');
 * Returns: /your/project/path/storage/uploads/images/photo.png
 */
export const getUploadPath = (...subFolders: string[]): string => {
    return buildPath('uploads', ...subFolders);
};

/**
 * Returns a path inside the "temp" directory.
 *
 * @example
 * getTempPath('tempfile.txt');
 * Returns: /your/project/path/storage/temp/tempfile.txt
 */
export const getTempPath = (...subFolders: string[]): string => {
    return buildPath('temp', ...subFolders);
};

/**
 * Ensures that a directory exists. If it doesn't, it will be created recursively.
 *
 * @param dirPath - Absolute path of the directory to create.
 */
export const createDirectoryIfNotExists = async (dirPath: string): Promise<Error | undefined> => {
    if (!existsSync(dirPath)) {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            console.error('Failed to create directory:', error);
            return new Error(`Could not create directory at ${dirPath}`);
        }
    }
};

/**
 * Deletes the specified files if they exist.
 *
 * @param filePaths - Array of absolute file paths to delete.
 */
export const cleanupFiles = (filePaths: string[]): void => {
    try {
        filePaths.forEach((filePath) => {
            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
        });
    } catch (error) {
        console.error('Failed to clean up files:', error);
    }
};

/**
 * Deletes the specified files after a delay (in minutes).
 *
 * @param filePaths - Files to delete.
 * @param delayMinutes - Delay in minutes before deletion (default: 15).
 */
export const cleanupFilesAfterDelay = (filePaths: string[], delayMinutes = 15): void => {
    setTimeout(
        () => {
            cleanupFiles(filePaths);
        },
        delayMinutes * 60 * 1000
    );
};

/**
 * Saves an uploaded file to a specified destination folder.
 * The file is sanitized, and if it's temporary, it will be deleted after a specified delay.
 *
 * @param file - The file to save.
 * @param destinationFolder - The folder where the file should be saved.
 * @param isTemporary - Whether the file is temporary (default: false).
 * @param deleteAfterMint - Time in minutes after which the file should be deleted (default: 15).
 * @returns An object containing the sanitized file name and full path of the saved file.
 */
export const saveUploadedFile = async ({
    file,
    destinationFolder,
    isTemporary = false,
    deleteAfterMint = 15,
}: {
    file: File;
    destinationFolder: string;
    isTemporary?: boolean;
    deleteAfterMint?: number;
}): Promise<{
    fileName: string;
    fullPath: string;
}> => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedFileName = sanitizeFilename(file.name, true);

    const segments = destinationFolder.split('/');
    const targetDir = buildPath(isTemporary ? 'temp' : '', ...segments);
    const fullPath = path.join(targetDir, sanitizedFileName);

    await createDirectoryIfNotExists(targetDir);
    await fs.writeFile(fullPath, buffer);

    if (isTemporary || deleteAfterMint) {
        cleanupFilesAfterDelay([fullPath], deleteAfterMint);
    }

    return {
        fileName: sanitizedFileName,
        fullPath,
    };
};
