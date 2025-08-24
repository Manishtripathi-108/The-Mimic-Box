import { AxiosProgressEvent } from 'axios';

import IconSet from '@/constants/icons.constants';

export type FileTypesMap = Record<
    string,
    | 'audio'
    | 'video'
    | 'image'
    | 'document'
    | 'archive'
    | 'executable'
    | 'font'
    | 'code'
    | 'markup'
    | 'spreadsheet'
    | 'presentation'
    | 'email'
    | 'database'
    | 'vector'
    | '3d'
    | 'script'
    | 'text'
    | 'diskImage'
>;

export type T_IconType = keyof typeof IconSet;

export type T_UploadState = {
    formattedLoaded: string;
    formattedTotal: string;
    formattedProgress: string;
    formattedRate: string;
    formattedEstimated: string;
} & AxiosProgressEvent;

/* -------------------------------------------------------------------------- */
/*                                    Audio                                   */
/* -------------------------------------------------------------------------- */
export type T_AudioEntityLink = {
    id: string;
    name: string;
    link: string;
};

type T_AudioEntityType = 'album' | 'playlist' | 'track' | 'artist';
export type T_AudioSource = 'spotify' | 'saavn' | 'youtube';

export type T_AudioSourceContext = {
    snapshotId?: string;
    source: T_AudioSource;
    type: T_AudioEntityType;
    id: string;
};

export type T_AudioPlayerTrack = {
    id: string;
    urls: { quality: '12kbps' | '48kbps' | '96kbps' | '160kbps' | '320kbps'; url: string }[];
    title: string;
    album: string | null;
    year: string | null;
    duration: number | null;
    language?: string;
    artists: string;
    covers: { quality: '50x50' | '150x150' | '500x500'; url: string }[];
};

export type T_AudioPlayerState = {
    playbackContext: T_AudioSourceContext | null;
    currentTrackIndex: number;
    playbackOrder: number[];
    queue: T_AudioPlayerTrack[];
    isShuffled: boolean;
};

export type T_AudioPlayerAction =
    | { type: 'SET_QUEUE'; payload: { tracks: T_AudioPlayerTrack[]; context: T_AudioSourceContext | null } }
    | { type: 'ADD_TO_QUEUE'; payload: { tracks: T_AudioPlayerTrack[]; context: T_AudioSourceContext | null } }
    | { type: 'CLEAR_QUEUE' }
    | { type: 'PLAY_INDEX'; payload: number }
    | { type: 'PLAY_ID'; payload: string }
    | { type: 'TOGGLE_SHUFFLE' }
    | { type: 'NEXT_TRACK' }
    | { type: 'PREV_TRACK' };

type T_DownloadStatus = 'pending' | 'processing' | 'downloading' | 'ready' | 'failed' | 'cancelled';

export type T_AudioDownloadFile = {
    id: string;
    url: string;
    title: string;
    cover?: string;
    progress?: number;
    error?: string;
    status: T_DownloadStatus;
    blobUrl?: string;
    metadata: Record<string, string | number>;
};

export type T_AudioFile = {
    filename?: string;
    src: string;
    cover?: string;
    metadata: Record<string, string | number>;
};
