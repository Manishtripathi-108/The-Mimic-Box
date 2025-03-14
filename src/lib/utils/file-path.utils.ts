import { existsSync, unlinkSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

/**
 * Base directory for constructing paths.
 * Defaults to `process.cwd()` but can be dynamically set via environment variables.
 */
const BASE_DIR = process.cwd();

/**
 * General-purpose function for building paths dynamically.
 * Resolves paths relative to the BASE_DIR.
 *
 * @example
 * const projectPath = buildPath('src', 'index.ts');
 * // Returns: '/path/to/project/src/index.ts'
 */
export const buildPath = (...segments: string[]): string => {
    return path.resolve(BASE_DIR, ...segments);
};

/**
 * Returns the path to the uploads directory, with optional subdirectories.
 *
 * @example
 * const uploadFilePath: string = getUploadPath('audio', 'example.mp3');
 * // Returns: '/path/to/project/uploads/audio/example.mp3'
 * @example
 * const uploadFilePath: string = getUploadPath('audio');
 * // Returns: '/path/to/project/uploads/audio'
 */
export const getUploadPath = (...subFolders: string[]): string => {
    return buildPath('uploads', ...subFolders);
};

/**
 * Returns the path to the temporary files directory.
 *
 * @example
 * const tempFilePath: string = getTempPath(['tempfile.txt']);
 * // Returns: '/path/to/project/temp/tempfile.txt'
 */
export const getTempPath = (...subFolders: string[]): string => {
    return buildPath('temp', ...subFolders);
};

/**
 * Ensures that a directory exists at the specified path.
 * If the directory does not exist, it is created, including any
 * necessary parent directories.
 * @example
 * await createDirectoryIfNotExists('/path/to/directory');
 */
export const createDirectoryIfNotExists = async (dirPath: string): Promise<Error | undefined> => {
    if (!existsSync(dirPath)) {
        try {
            await mkdir(dirPath, { recursive: true });
        } catch (error) {
            console.error('Error creating directory:', error);
            return new Error(`Failed to create directory at ${dirPath}`);
        }
    }
};

/**
 * Utility to clean up multiple files.
 * @example
 * cleanupFiles(['/path/to/file1.txt', '/path/to/file2.txt']);
 */
export const cleanupFiles = (filePaths: string[]): void => {
    try {
        filePaths?.forEach((filePath: string) => {
            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
        });
    } catch (error) {
        console.error('Error cleaning up files:', error);
    }
};

/**
 * Utility to clean up multiple files after a specified delay.
 * @example
 * cleanupFilesAfterDelay(['/path/to/file1.txt', '/path/to/file2.txt'], 5000);
 */
export const cleanupFilesAfterDelay = (filePaths: string[], delay = 900000): void => {
    setTimeout(() => {
        cleanupFiles(filePaths);
    }, delay);
};
