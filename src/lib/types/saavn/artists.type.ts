import { T_SaavnAlbum, T_SaavnAlbumAPIResponse } from '@/lib/types/saavn/albums.types';
import { T_SaavnImageLink } from '@/lib/types/saavn/global.types';
import { T_SaavnSong, T_SaavnSongAPIResponse } from '@/lib/types/saavn/song.types';

type T_SaavnSocialLinks = {
    dob: string | null;
    fb: string | null;
    twitter: string | null;
    wiki: string | null;
};

type T_SaavnBioBlock = {
    text: string | null;
    title: string | null;
    sequence: number | null;
};

type T_SaavnArtistURLs = {
    albums: string;
    bio: string;
    comments: string;
    songs: string;
    overview: string;
};

type T_SaavnArtistPlaylistApiResponse = T_SaavnArtistBaseAPIResponse & {
    title: string;
    subtitle: string;
    explicit_content: string;
    mini_obj: boolean;
    numsongs: number;
    more_info: {
        uid: string;
        firstname: string;
        artist_name: string[];
        entity_type: string;
        entity_sub_type: string;
        video_available: boolean;
        is_dolby_content: boolean;
        sub_types: string;
        images: string;
        lastname: string;
        song_count: string;
        language: string;
    };
};

type T_SaavnSimilarArtistApiResponse = Omit<T_SaavnArtistBaseAPIResponse, 'role'> &
    T_SaavnSocialLinks & {
        languages: string | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similar: string | null;
    };

type T_SaavnSimilarArtist = Omit<T_SaavnArtistBase, 'role'> &
    T_SaavnSocialLinks & {
        languages: Record<string, string> | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similarArtists: { id: string; name: string }[] | null;
    };

export type T_SaavnArtistBase = {
    id: string;
    name: string;
    role?: string;
    type: string;
    image: T_SaavnImageLink[];
    url?: string;
};

export type T_SaavnArtistBaseAPIResponse = Omit<T_SaavnArtistBase, 'image' | 'url'> & {
    image: string;
    perma_url: string;
};

export type T_SaavnArtistAPIResponse = T_SaavnArtistBaseAPIResponse &
    T_SaavnSocialLinks & {
        artistId: string;
        subtitle: string;
        follower_count: string;
        isVerified: boolean;
        dominantLanguage: string;
        dominantType: string;
        topSongs: T_SaavnSongAPIResponse[];
        topAlbums: T_SaavnAlbumAPIResponse[];
        singles: T_SaavnSongAPIResponse[];
        dedicated_artist_playlist: T_SaavnArtistPlaylistApiResponse[];
        featured_artist_playlist: T_SaavnArtistPlaylistApiResponse[];
        similarArtists: T_SaavnSimilarArtistApiResponse[];
        isRadioPresent: boolean;
        bio: string;
        urls: T_SaavnArtistURLs;
        availableLanguages: string[];
        fan_count: string;
        topEpisodes: string[];
        is_followed: boolean;
    };

export type T_SaavnArtist = T_SaavnSocialLinks & {
    id: string;
    name: string;
    url: string;
    type: string;
    image: T_SaavnImageLink[];
    followerCount: number | null;
    fanCount: string | null;
    isVerified: boolean | null;
    dominantLanguage: string | null;
    dominantType: string | null;
    bio: T_SaavnBioBlock[] | null;
    availableLanguages: string[];
    isRadioPresent: boolean | null;
    topSongs: T_SaavnSong[] | null;
    topAlbums: T_SaavnAlbum[] | null;
    singles: T_SaavnSong[] | null;
    similarArtists: T_SaavnSimilarArtist[] | null;
};

export type T_SaavnArtistSongAPIResponse = {
    artistId: string;
    name: string;
    subtitle: string;
    image: string;
    follower_count: string;
    type: string;
    isVerified: boolean;
    dominantLanguage: string;
    dominantType: string;
    topSongs: {
        songs: T_SaavnSongAPIResponse[];
        total: number;
    };
};

export type T_SaavnArtistSong = {
    total: number;
    songs: T_SaavnSong[];
};

export type T_SaavnArtistAlbumAPIResponse = {
    artistId: string;
    name: string;
    subtitle: string;
    image: string;
    follower_count: string;
    type: string;
    isVerified: boolean;
    dominantLanguage: string;
    dominantType: string;
    topAlbums: {
        albums: T_SaavnAlbumAPIResponse[];
        total: number;
    };
};

export type T_SaavnArtistAlbum = {
    total: number;
    albums: T_SaavnAlbum[];
};
