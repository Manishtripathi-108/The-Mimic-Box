/* ------------------------------ Cloud Uploads ----------------------------- */
/**
 * Represents the input parameters for uploading a file to Cloud.
 */
export type CloudUploadParams = {
    file: string | Buffer;
    destinationFolder: string;
    type?: 'image' | 'video';
    isTemporary?: boolean;
    removeLocalCopy?: boolean;
};

/**
 * Represents the output data for a successful Cloud upload.
 */
export type CloudUploadResult = {
    url: string;
    publicId?: string;
};

/* ---------------------------------- Audio --------------------------------- */
