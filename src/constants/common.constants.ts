export const IMAGE_FALLBACKS = {
    APP_LOGO: 'https://res.cloudinary.com/dra73suxl/image/upload/v1744229205/mimic_logo_tb4e9r.png',
    PROFILE: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    BANNER: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742811780/scene-night-tree_raa1zn.jpg',
    NO_DATA: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742810700/nodata_vyixzn.png',
    AUDIO_COVER: 'https://res.cloudinary.com/dra73suxl/image/upload/v1744229654/no_cover_image_fallback_jhsdj.png',
};

export const MAX_FILE_SIZE = {
    image: 5 * 1024 * 1024, // 5MB
    video: 50 * 1024 * 1024, // 50MB
    audio: 50 * 1024 * 1024, // 50MB
    document: 50 * 1024 * 1024, // 50MB
} as const;
