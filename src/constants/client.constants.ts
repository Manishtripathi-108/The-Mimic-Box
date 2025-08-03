import { FileTypesMap } from '@/lib/types/client.types';
import { T_AudioAdvanceSettings, T_AudioMetaTagsRecords } from '@/lib/types/common.types';

export const MAX_FILE_SIZE = {
    image: 5 * 1024 * 1024, // 5MB
    video: 50 * 1024 * 1024, // 50MB
    audio: 50 * 1024 * 1024, // 50MB
    document: 50 * 1024 * 1024, // 50MB
} as const;

export const FILE_TYPES_MAP: FileTypesMap = {
    // Audio
    mp3: 'audio',
    wav: 'audio',
    flac: 'audio',
    aac: 'audio',
    ogg: 'audio',
    wma: 'audio',
    m4a: 'audio',

    // Video
    mp4: 'video',
    avi: 'video',
    mkv: 'video',
    mov: 'video',
    wmv: 'video',
    flv: 'video',

    // Images
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    bmp: 'image',
    tiff: 'image',

    // Documents
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    xls: 'document',
    xlsx: 'document',
    ppt: 'document',
    pptx: 'document',

    // Archives
    zip: 'archive',
    rar: 'archive',
    tar: 'archive',
    gz: 'archive',
    '7z': 'archive',
    bz2: 'archive',
    xz: 'archive',

    // Executables
    exe: 'executable',
    bat: 'executable',
    sh: 'executable',
    msi: 'executable',
    apk: 'executable',

    // Fonts
    ttf: 'font',
    otf: 'font',
    woff: 'font',
    woff2: 'font',
    eot: 'font',

    // Code
    js: 'code',
    html: 'code',
    css: 'code',
    py: 'code',
    java: 'code',
    c: 'code',
    cpp: 'code',

    // Markup
    json: 'markup',
    xml: 'markup',
    yaml: 'markup',
    yml: 'markup',

    // Spreadsheets
    csv: 'spreadsheet',
    ods: 'spreadsheet',

    // Presentations
    odp: 'presentation',

    // Emails
    eml: 'email',
    msg: 'email',
    pst: 'email',
    mbox: 'email',

    // Databases
    sql: 'database',
    db: 'database',
    mdb: 'database',
    accdb: 'database',
    sqlite: 'database',

    // Vectors
    svg: 'vector',
    eps: 'vector',
    ai: 'vector',
    cdr: 'vector',

    // 3D Models
    stl: '3d',
    obj: '3d',
    fbx: '3d',
    '3ds': '3d',
    blend: '3d',

    // Scripts
    pl: 'script',
    rb: 'script',
    php: 'script',

    // Text
    txt: 'text',
    md: 'text',
    log: 'text',
    ini: 'text',

    // Disk Images
    iso: 'disk image',
    dmg: 'disk image',
    bin: 'disk image',
};

/* --------------------------------- Anilist -------------------------------- */
export const ANILIST_GENRES = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Ecchi',
    'Fantasy',
    'Horror',
    'Mahou Shoujo',
    'Mecha',
    'Music',
    'Mystery',
    'Psychological',
    'Romance',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller',
];

/* ---------------------------------- Audio --------------------------------- */
export const AUDIO_BITRATE_OPTIONS = [
    { label: 'Economy (64 kbps)', value: 64 },
    { label: 'Standard (128 kbps)', value: 128 },
    { label: 'Good (192 kbps)', value: 192 },
    { label: 'Ultra (256 kbps)', value: 256 },
    { label: 'Best (320 kbps)', value: 320 },
];

export const AUDIO_CHANNEL_OPTIONS = [
    { label: 'Auto', value: '0' },
    { label: 'Mono', value: '1' },
    { label: 'Stereo', value: '2' },
];

export const AUDIO_ADVANCED_SETTINGS_DEFAULTS: T_AudioAdvanceSettings = {
    audio: {
        format: 'M4A',
        channels: '0',
        volume: 100,
        sampleRate: 'no change',
        bitrate: '128',
    },
    effects: {
        fadeIn: 0,
        fadeOut: 0,
        playbackSpeed: '1.0x (Normal)',
        pitchShift: 0,
        normalize: false,
    },
    trim: {
        trimStart: '00:00:00',
        trimEnd: '00:00:00',
    },
};

export const META_TAGS: T_AudioMetaTagsRecords = {
    title: {
        className: 'order-1 col-span-1 sm:col-span-2',
        placeholder: 'e.g. My Song',
    },
    artist: {
        className: 'order-2 col-span-1',
        placeholder: 'e.g. John Doe',
    },
    album: {
        className: 'order-3 col-span-1',
        placeholder: 'e.g. My Album',
    },
    album_artist: {
        className: 'order-4 col-span-1 md:col-span-2',
        placeholder: 'e.g. John Doe, Jane Doe',
    },
    genre: {
        className: 'order-5 col-span-1 sm:col-span-2 lg:col-span-2',
        placeholder: 'e.g. Pop, Rock, Country',
    },
    date: {
        className: 'order-6 col-span-1',
        placeholder: 'e.g. 2021',
        type: 'number',
    },
    track: {
        className: 'order-7 col-span-1',
        placeholder: 'e.g. 1',
        type: 'number',
    },
    composer: {
        className: 'order-8 col-span-1',
        placeholder: 'e.g. Ludwig van Beethoven',
    },
    lyricist: {
        className: 'order-9 col-span-1',
        placeholder: 'e.g. John Doe',
    },
    lyrics: {
        className: 'order-10 col-span-full',
        placeholder: 'Lyrics here...',
        type: 'textarea',
    },
    comment: {
        className: 'order-11 col-span-1',
        placeholder: 'Additional notes here...',
    },
    publisher: {
        className: 'order-12 col-span-1',
        placeholder: 'e.g. Universal Music',
    },
    isrc: {
        className: 'order-13 col-span-1',
        placeholder: 'e.g. USRC17607839',
    },
    bpm: {
        className: 'order-14 col-span-1',
        placeholder: 'e.g. 120',
        type: 'number',
    },
    language: {
        className: 'order-15 col-span-1',
        placeholder: 'e.g. English',
    },
    conductor: {
        className: 'order-16 col-span-1',
        placeholder: 'e.g. John Smith',
    },
    mood: {
        className: 'order-17 col-span-1',
        placeholder: 'e.g. Happy, Sad',
    },
    rating: {
        className: 'order-18 col-span-1',
        placeholder: 'e.g. 5',
        type: 'number',
    },
    media_type: {
        className: 'order-19 col-span-1',
        placeholder: 'e.g. Digital, Vinyl',
    },
    catalog_number: {
        className: 'order-20 col-span-1',
        placeholder: 'e.g. 123456',
    },
    encoder: {
        className: 'order-21 col-span-1',
        placeholder: 'e.g. LAME 3.99',
    },
    copyright: {
        className: 'order-22 col-span-1',
        placeholder: 'e.g. © 2024',
    },
    url: {
        className: 'order-23 col-span-1',
        placeholder: 'e.g. https://themimicbox.com',
    },
};

/* --------------------------------- lyrics --------------------------------- */
export const LYRICS_UNAVAILABLE_MESSAGES = [
    'The lyric gods are on vacation… probably sipping margaritas on a beach 🎵🏖️',
    'Oops! The lyrics went to get milk and joined a rock band instead 🥛🎸',
    'Lyrics went on a coffee break and forgot to clock back in ☕😅',
    "These lyrics are playing hide and seek… and they're *really* good at it 🙈",
    'Someone forgot to feed the lyrics hamster. Again. 🐹💨',
    "Aliens abducted the lyrics. We hope they're enjoying space karaoke 👽🎤",
    "The lyrics ghosted us… we're left on read 👻📱",
    'The lyrics are currently binge-watching Netflix and ignoring responsibilities 📺🍿',
    'We had the lyrics, but then someone played Free Bird 🕊️🎵',
];
