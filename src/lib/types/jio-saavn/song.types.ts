import { T_ArtistBase, T_ArtistBaseAPIResponse } from '@/lib/types/jio-saavn/artists.type';
import { T_DownloadLink, T_EntityBase, T_ImageLink } from '@/lib/types/jio-saavn/global.types';

export type T_SongAPIResponse = T_EntityBase & {
    header_desc: string;
    play_count: string;
    list_count: string;
    list_type: string;
    list: string;
    year: string;
    language: string;
    more_info: {
        music: string;
        album_id: string;
        album: string;
        label: string;
        origin: string;
        is_dolby_content: boolean;
        '320kbps': string;
        encrypted_media_url: string;
        encrypted_cache_url: string;
        album_url: string;
        duration: string;
        cache_state: string;
        has_lyrics: string;
        lyrics_snippet: string;
        starred: string;
        copyright_text: string;
        release_date: string;
        label_url: string;
        vcode: string;
        vlink: string;
        triller_available: boolean;
        request_jiotune_flag: boolean;
        webp: string;
        lyrics_id: string;
        rights: {
            code: string;
            cacheable: string;
            delete_cached_object: string;
            reason: string;
        };
        artistMap: {
            primary_artists: T_ArtistBaseAPIResponse[];
            featured_artists: T_ArtistBaseAPIResponse[];
            artists: T_ArtistBaseAPIResponse[];
        };
    };
};

export type T_Song = {
    id: string;
    name: string;
    type: string;
    url: string;
    language: string;
    hasLyrics: boolean;
    lyricsId: string | null;
    lyricsSnippet: string | null;
    label: string | null;
    year: string | null;
    releaseDate: string | null;
    duration: number | null;
    explicitContent: boolean;
    playCount: number | null;
    copyright: string | null;
    image: T_ImageLink[];
    downloadUrl: T_DownloadLink[];
    album: {
        id: string | null;
        name: string | null;
        url: string | null;
    };
    artists: {
        primary: T_ArtistBase[];
        featured: T_ArtistBase[];
        all: T_ArtistBase[];
    };
};

type T_SongStationAPIResponse = Record<string, { song: T_SongAPIResponse }>;

export type T_SongSuggestionAPIResponse = {
    stationid: string;
} & T_SongStationAPIResponse;
