export const TOKEN_EXPIRY_MS = 900000;

export const MAX_FILE_SIZE = {
    image: 5 * 1024 * 1024, // 5MB
    video: 50 * 1024 * 1024, // 50MB
    audio: 50 * 1024 * 1024, // 50MB
    document: 50 * 1024 * 1024, // 50MB
} as const;
