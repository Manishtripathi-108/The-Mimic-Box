import { T_SaavnArtistBase, T_SaavnArtistBaseAPIResponse } from '@/lib/types/saavn/artists.type';
import { T_SaavnEntityBase, T_SaavnImageLink } from '@/lib/types/saavn/global.types';
import { T_SaavnSong, T_SaavnSongAPIResponse } from '@/lib/types/saavn/song.types';

export type T_SaavnSearchAlbumAPIResponse = {
    total: number;
    start: number;
    results: {
        id: string;
        title: string;
        subtitle: string;
        header_desc: string;
        type: string;
        perma_url: string;
        image: string;
        language: string;
        year: string;
        play_count: string;
        explicit_content: string;
        list_count: string;
        list_type: string;
        list: T_SaavnSong[];
        more_info: {
            query: string;
            text: string;
            music: string;
            song_count: string;
            artistMap: {
                primary_artists: T_SaavnArtistBaseAPIResponse[];
                featured_artists: T_SaavnArtistBaseAPIResponse[];
                artists: T_SaavnArtistBaseAPIResponse[];
            };
        };
    }[];
};

export type T_SaavnSearchAlbum = {
    total: number;
    start: number;
    results: {
        id: string;
        name: string;
        description: string;
        year: number | null;
        type: string;
        playCount: number | null;
        language: string;
        explicitContent: boolean;
        artists: {
            primary: T_SaavnArtistBase[];
            featured: T_SaavnArtistBase[];
            all: T_SaavnArtistBase[];
        };
        url: string;
        image: T_SaavnImageLink[];
    }[];
};

export type T_SaavnAlbumAPIResponse = T_SaavnEntityBase & {
    header_desc: string;
    play_count: string;
    list_count: string;
    list_type: string;
    year: string;
    language: string;
    list: T_SaavnSongAPIResponse[];
    more_info: {
        artistMap: T_SaavnSongAPIResponse['more_info']['artistMap'];
        song_count: string;
        copyright_text: string;
        is_dolby_content: boolean;
        label_url: string;
    };
};

export type T_SaavnAlbum = {
    id: string;
    name: string;
    description: string;
    year: number | null;
    type: string;
    playCount: number | null;
    language: string;
    explicitContent: boolean;
    artists: T_SaavnSong['artists'];
    songCount: number | null;
    url: string;
    image: T_SaavnImageLink[];
    songs: T_SaavnSong[] | null;
};
