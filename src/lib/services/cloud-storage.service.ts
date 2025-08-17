import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { existsSync } from 'fs';

import cloudinary from '@/lib/config/cloudinary.config';
import { T_ErrorResponseOutput, T_SuccessResponseOutput } from '@/lib/types/response.types';
import { CloudUploadParams, CloudUploadResult } from '@/lib/types/server.types';
import { createError, createSuccess, createValidationError } from '@/lib/utils/createResponse.utils';
import { cleanupFiles } from '@/lib/utils/file-server-only.utils';

/**
 * Uploads a file to Cloud.
 */
export const uploadToCloud = async ({
    file,
    destinationFolder,
    type = 'image',
    isTemporary = false,
    removeLocalCopy = true,
}: CloudUploadParams): Promise<T_SuccessResponseOutput<CloudUploadResult> | T_ErrorResponseOutput> => {
    try {
        const uploadOptions: UploadApiOptions = {
            resource_type: type,
            folder: `mimic-box/${isTemporary ? 'temp/' : ''}${destinationFolder}`,
        };

        if (typeof file === 'string' && !existsSync(file)) {
            return createValidationError('File does not exist');
        }

        let uploadResponse: UploadApiResponse | UploadApiErrorResponse;

        if (Buffer.isBuffer(file)) {
            uploadResponse = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                    if (error) return reject(error);
                    if (result) return resolve(result);
                    reject(new Error('Something went wrong while uploading the file'));
                });
                uploadStream.end(file);
            });
        } else if (typeof file === 'string') {
            uploadResponse = await cloudinary.uploader.upload(file, uploadOptions);
        } else {
            return createValidationError('Invalid file input: must be a Buffer or a file path string.');
        }

        return createSuccess('File uploaded successfully', {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        });
    } catch (error) {
        return createError('Error uploading file to Cloudinary', { error });
    } finally {
        if (removeLocalCopy && typeof file === 'string') {
            cleanupFiles([file]);
        }
    }
};

/**
 * Deletes a file from Cloud.
 */
export const deleteFromCloud = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return createSuccess('File deleted successfully');
    } catch (error) {
        return createError('Error deleting file from Cloudinary', { error });
    }
};

/**
 * Downloads a file from Cloud.
 */
export const downloadFromCloud = async (
    publicId: string,
    type: 'video' | 'audio' = 'video'
): Promise<T_SuccessResponseOutput<CloudUploadResult> | T_ErrorResponseOutput> => {
    try {
        const downloadResponse = await cloudinary.api.resource(publicId, { resource_type: type });
        return createSuccess('File downloaded successfully', { url: downloadResponse.secure_url });
    } catch (error) {
        return createError('Error downloading file from Cloudinary', { error });
    }
};
