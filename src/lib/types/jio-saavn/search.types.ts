import { T_ArtistBase } from '@/lib/types/jio-saavn/artists.type';
import {
    T_DownloadLink,
    T_EntityBase,
    T_NormalizedEntityBase,
    T_SearchAPIResponseSection,
    T_SearchSection,
} from '@/lib/types/jio-saavn/global.types';
import { T_Song, T_SongAPIResponse } from '@/lib/types/jio-saavn/song.types';

type T_AlbumRaw = T_EntityBase & {
    more_info: {
        music: string;
        ctr: number;
        year: string;
        is_movie: string;
        language: string;
        song_pids: string;
    };
};

type T_SongRaw = T_EntityBase & {
    more_info: {
        album: string;
        ctr: number;
        score?: string;
        vcode: string;
        vlink?: string;
        primary_artists: string;
        singers: string;
        video_available: boolean;
        triller_available: boolean;
        language: string;
    };
};

type T_PlaylistRaw = T_EntityBase & {
    more_info: {
        firstname: string;
        artist_name: string[];
        entity_type: string;
        entity_sub_type: string;
        video_available: boolean;
        is_dolby_content: boolean;
        sub_types: unknown;
        images: Record<string, unknown>;
        lastname: string;
        language: string;
    };
};

type T_ArtistRaw = Omit<T_EntityBase, 'explicit_content' | 'perma_url'> & {
    extra: string;
    name: string;
    isRadioPresent: boolean;
    ctr: number;
    entity: number;
    position: number;
};

export type T_SearchAPIResponse = {
    albums: T_SearchAPIResponseSection<T_AlbumRaw>;
    songs: T_SearchAPIResponseSection<T_SongRaw>;
    playlists: T_SearchAPIResponseSection<T_PlaylistRaw>;
    artists: T_SearchAPIResponseSection<T_ArtistRaw>;
    topquery: T_SearchAPIResponseSection<T_SongRaw>;
};

/* --------------------- Search API Normalized Response --------------------- */
export type T_SearchResponse = {
    albums: T_SearchSection<
        T_NormalizedEntityBase & {
            artist: string;
            url: string;
            year: string;
            language: string;
            songIds: string;
        }
    >;
    songs: T_SearchSection<
        T_NormalizedEntityBase & {
            album: string;
            url: string;
            primaryArtists: string;
            singers: string;
            language: string;
        }
    >;
    artists: T_SearchSection<T_ArtistBase & { position: number }>;
    playlists: T_SearchSection<
        T_NormalizedEntityBase & {
            url: string;
            language: string;
        }
    >;
    topQuery: T_SearchSection<
        T_NormalizedEntityBase & {
            album: string;
            url: string;
            primaryArtists: string;
            singers: string;
            language: string;
        }
    >;
};

export type T_SearchPlaylistAPIResponse = {
    total: number;
    start: number;
    results: Array<
        T_PlaylistRaw & {
            more_info: T_PlaylistRaw['more_info'] & {
                uid: string;
                song_count: string;
            };
            numsongs: unknown;
        }
    >;
};

export type T_SearchPlaylist = {
    total: number;
    start: number;
    results: {
        id: string;
        name: string;
        type: string;
        image: T_DownloadLink[];
        url: string;
        songCount: number | null;
        language: string;
        explicitContent: boolean;
    }[];
};

export type T_SearchArtistAPIResponse = {
    total: number;
    start: number;
    results: {
        name: string;
        id: string;
        ctr: number;
        entity: number;
        image: string;
        role: string;
        perma_url: string;
        type: string;
        mini_obj: boolean;
        isRadioPresent: boolean;
        is_followed: boolean;
    }[];
};

export type T_SearchArtist = {
    total: number;
    start: number;
    results: T_ArtistBase[];
};

export type T_SearchSongAPIResponse = {
    total: number;
    start: number;
    results: T_SongAPIResponse[];
};

export type T_SearchSong = {
    total: number;
    start: number;
    results: T_Song[];
};
