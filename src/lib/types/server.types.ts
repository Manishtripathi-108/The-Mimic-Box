/* ------------------------------ Cloud Uploads ----------------------------- */
/**
 * Represents the input parameters for uploading a file to Cloud.
 */
export type CloudUploadParams = {
    file: string | Buffer;
    destinationFolder: string;
    type?: 'image' | 'video';
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
export type FFProbeMetadata = {
    format?: {
        duration?: number;
        tags?: Record<string, string>;
    };
    streams?: Array<{
        index: number;
        codec_name?: string;
        codec_type?: string;
    }>;
};

export type AudioConversionOptions = {
    audio: {
        channels: string;
        volume: number;
        sampleRate: string;
    };
    effects: {
        fadeIn?: number;
        fadeOut?: number;
        playbackSpeed?: string;
        pitchShift?: string;
        normalize?: boolean;
    };
    trim: {
        trimStart?: number;
        trimEnd?: number;
    };
};
