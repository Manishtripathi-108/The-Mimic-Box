import { existsSync, unlinkSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidV4 } from 'uuid';

/**
 * Base directory of the project. Used to construct absolute paths.
 */
const BASE_DIR = process.cwd();

/**
 * Resolves and returns an absolute path under the "storage" directory.
 *
 * @example
 * buildPath('uploads', 'audio.mp3');
 * // Returns: /your/project/path/storage/uploads/audio.mp3
 */
export const buildPath = (...segments: string[]): string => {
    return path.resolve(BASE_DIR, 'storage', ...segments);
};

/**
 * Returns a path inside the "uploads" directory.
 *
 * @example
 * getUploadPath('images', 'photo.png');
 * // Returns: /your/project/path/storage/uploads/images/photo.png
 */
export const getUploadPath = (...subFolders: string[]): string => {
    return buildPath('uploads', ...subFolders);
};

/**
 * Returns a path inside the "temp" directory.
 *
 * @example
 * getTempPath('tempfile.txt');
 * // Returns: /your/project/path/storage/temp/tempfile.txt
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
 * Generates a safe, unique file name by prepending a UUID and replacing unsafe characters.
 * @example
 * sanitizeFileName('My File (1).mp3');
 * // Returns: 'uuid-my_file_1.mp3'
 */
export const sanitizeFileName = (fileName: string): string => {
    const name = path.basename(fileName);
    return (
        uuidV4() +
        '-' +
        name
            .toLowerCase()
            .replace(/[^a-z0-9.-]/g, '_') // Replace unsafe characters
            .replace(/_+/g, '_')
    ); // Normalize underscores
};

//Saves an uploaded file to disk.
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
    const sanitizedFileName = sanitizeFileName(file.name);

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
