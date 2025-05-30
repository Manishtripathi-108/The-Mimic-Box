import { T_ArtistBase } from '@/lib/types/saavn/artists.type';
import { T_ImageLink } from '@/lib/types/saavn/global.types';
import { T_Song, T_SongAPIResponse } from '@/lib/types/saavn/song.types';

export type T_PlaylistAPIResponse = {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    image: string;
    perma_url: string;
    explicit_content: string;
    language: string;
    year: string;
    play_count: string;
    list_count: string;
    list_type: string;
    list: T_SongAPIResponse[];
    description: string;
    header_desc: string;
    more_info: {
        uid: string;
        firstname: string;
        lastname: string;
        is_dolby_content: boolean;
        subtype?: string[];
        last_updated: string;
        username: string;
        is_followed: string;
        isFY: boolean;
        follower_count: string;
        fan_count: string;
        playlist_type: string;
        share: string;
        sub_types: string[];
        images: string[];
        H2: string | null;
        subheading: string;
        video_count: string;
        artists: {
            id: string;
            name: string;
            role: string;
            image: string;
            type: string;
            perma_url: string;
        }[];
    };
};

export type T_Playlist = {
    id: string;
    name: string;
    description: string | null;
    year: number | null;
    type: string;
    playCount: number | null;
    language: string;
    explicitContent: boolean;
    songCount: number | null;
    url: string;
    image: T_ImageLink[];
    songs: T_Song[] | null;
    artists: T_ArtistBase[] | null;
};
