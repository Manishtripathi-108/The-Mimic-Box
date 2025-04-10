import { FileTypesMap } from '@/lib/types/client.types';

export const IMAGE_URL = {
    APP_LOGO: 'https://res.cloudinary.com/dra73suxl/image/upload/v1744229205/mimic_logo_tb4e9r.png',
    PROFILE: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742410227/profile_nes8vp.png',
    BANNER: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742811780/scene-night-tree_raa1zn.jpg',
    NO_DATA: 'https://res.cloudinary.com/dra73suxl/image/upload/v1742810700/nodata_vyixzn.png',
    AUDIO_COVER_FALLBACK: 'https://res.cloudinary.com/dra73suxl/image/upload/v1744229654/no_cover_image_fallback_jhsdj.png',
};

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

/* -------------------------------------------------------------------------- */
/*                                   Anilist                                  */
/* -------------------------------------------------------------------------- */
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
