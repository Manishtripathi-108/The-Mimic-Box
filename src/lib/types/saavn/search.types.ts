import { T_SaavnArtistBase } from '@/lib/types/saavn/artists.type';
import {
    T_SaavnEntityBase,
    T_SaavnImageLink,
    T_SaavnNormalizedEntityBase,
    T_SaavnSearchAPIResponseSection,
    T_SaavnSearchSection,
} from '@/lib/types/saavn/global.types';
import { T_SaavnSong, T_SaavnSongAPIResponse } from '@/lib/types/saavn/song.types';

type T_SaavnAlbumRaw = T_SaavnEntityBase & {
    more_info: {
        music: string;
        ctr: number;
        year: string;
        is_movie: string;
        language: string;
        song_pids: string;
    };
};

type T_SaavnSongRaw = T_SaavnEntityBase & {
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

type T_SaavnPlaylistRaw = T_SaavnEntityBase & {
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

type T_SaavnArtistRaw = Omit<T_SaavnEntityBase, 'explicit_content' | 'perma_url'> & {
    extra: string;
    name: string;
    isRadioPresent: boolean;
    ctr: number;
    entity: number;
    position: number;
};

export type T_SaavnSearchAPIResponse = {
    albums: T_SaavnSearchAPIResponseSection<T_SaavnAlbumRaw>;
    songs: T_SaavnSearchAPIResponseSection<T_SaavnSongRaw>;
    playlists: T_SaavnSearchAPIResponseSection<T_SaavnPlaylistRaw>;
    artists: T_SaavnSearchAPIResponseSection<T_SaavnArtistRaw>;
    topquery: T_SaavnSearchAPIResponseSection<T_SaavnSongRaw>;
};

/* --------------------- Search API Normalized Response --------------------- */
export type T_SaavnSearchResponse = {
    albums: T_SaavnSearchSection<
        T_SaavnNormalizedEntityBase & {
            artist: string;
            url: string;
            year: string;
            language: string;
            songIds: string;
        }
    >;
    songs: T_SaavnSearchSection<
        T_SaavnNormalizedEntityBase & {
            album: string;
            url: string;
            primaryArtists: string;
            singers: string;
            language: string;
        }
    >;
    artists: T_SaavnSearchSection<T_SaavnNormalizedEntityBase>;
    playlists: T_SaavnSearchSection<
        T_SaavnNormalizedEntityBase & {
            url: string;
            language: string;
        }
    >;
    topQuery: T_SaavnSearchSection<
        T_SaavnNormalizedEntityBase & {
            album: string;
            url: string;
            primaryArtists: string;
            singers: string;
            language: string;
        }
    >;
};

export type T_SaavnSearchPlaylistAPIResponse = {
    total: number;
    start: number;
    results: Array<
        T_SaavnPlaylistRaw & {
            more_info: T_SaavnPlaylistRaw['more_info'] & {
                uid: string;
                song_count: string;
            };
            numsongs: unknown;
        }
    >;
};

export type T_SaavnSearchPlaylist = {
    total: number;
    start: number;
    results: {
        id: string;
        name: string;
        type: string;
        image: T_SaavnImageLink[];
        url: string;
        songCount: number | null;
        language: string;
        explicitContent: boolean;
    }[];
};

export type T_SaavnSearchArtistAPIResponse = {
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

export type T_SaavnSearchArtist = {
    total: number;
    start: number;
    results: T_SaavnArtistBase[];
};

export type T_SaavnSearchSongAPIResponse = {
    total: number;
    start: number;
    results: T_SaavnSongAPIResponse[];
};

export type T_SaavnSearchSong = {
    total: number;
    start: number;
    results: T_SaavnSong[];
};
