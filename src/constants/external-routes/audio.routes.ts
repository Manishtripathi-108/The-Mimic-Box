const AUDIO_BASE = process.env.NEXT_PUBLIC_EXTERNAL_AUDIO_BASE_URL;

const AUDIO_ROUTES = {
    CONVERTER: `${AUDIO_BASE}/convert-audio`,
    EXTRACT_METADATA: `${AUDIO_BASE}/extract-metadata`,
    EDIT_META_TAGS: `${AUDIO_BASE}/edit-metadata`,
} as const;

export default AUDIO_ROUTES;
