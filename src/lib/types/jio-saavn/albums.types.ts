import { T_ArtistBase, T_ArtistBaseAPIResponse } from '@/lib/types/jio-saavn/artists.type';
import { T_EntityBase, T_ImageLink } from '@/lib/types/jio-saavn/global.types';
import { T_Song, T_SongAPIResponse } from '@/lib/types/jio-saavn/song.types';

export type T_SearchAlbumAPIResponse = {
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
        list: T_Song[];
        more_info: {
            query: string;
            text: string;
            music: string;
            song_count: string;
            artistMap: {
                primary_artists: T_ArtistBaseAPIResponse[];
                featured_artists: T_ArtistBaseAPIResponse[];
                artists: T_ArtistBaseAPIResponse[];
            };
        };
    }[];
};

export type T_SearchAlbum = {
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
            primary: T_ArtistBase[];
            featured: T_ArtistBase[];
            all: T_ArtistBase[];
        };
        url: string;
        image: T_ImageLink[];
    }[];
};

export type T_AlbumAPIResponse = T_EntityBase & {
    header_desc: string;
    play_count: string;
    list_count: string;
    list_type: string;
    year: string;
    language: string;
    list: T_SongAPIResponse[];
    more_info: {
        artistMap: T_SongAPIResponse['more_info']['artistMap'];
        song_count: string;
        copyright_text: string;
        is_dolby_content: boolean;
        label_url: string;
    };
};

export type T_Album = {
    id: string;
    name: string;
    description: string;
    year: number | null;
    type: string;
    playCount: number | null;
    language: string;
    explicitContent: boolean;
    artists: T_Song['artists'];
    songCount: number | null;
    url: string;
    image: T_ImageLink[];
    songs: T_Song[] | null;
};
