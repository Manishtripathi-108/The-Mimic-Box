import { T_SaavnArtistBase, T_SaavnArtistBaseAPIResponse } from '@/lib/types/saavn/artists.type';
import { T_SaavnDownloadLink, T_SaavnEntityBase, T_SaavnImageLink } from '@/lib/types/saavn/global.types';

export type T_SaavnSongAPIResponse = T_SaavnEntityBase & {
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
            primary_artists: T_SaavnArtistBaseAPIResponse[];
            featured_artists: T_SaavnArtistBaseAPIResponse[];
            artists: T_SaavnArtistBaseAPIResponse[];
        };
    };
};

export type T_SaavnSong = {
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
    image: T_SaavnImageLink[];
    downloadUrl: T_SaavnDownloadLink[];
    album: {
        id: string | null;
        name: string | null;
        url: string | null;
    };
    artists: {
        primary: T_SaavnArtistBase[];
        featured: T_SaavnArtistBase[];
        all: T_SaavnArtistBase[];
    };
};

type T_SaavnSongStationAPIResponse = Record<string, { song: T_SaavnSongAPIResponse }>;

export type T_SaavnSongSuggestionAPIResponse = {
    stationid: string;
} & T_SaavnSongStationAPIResponse;
