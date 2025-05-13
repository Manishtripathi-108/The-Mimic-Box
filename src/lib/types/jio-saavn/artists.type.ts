import { T_Album, T_AlbumAPIResponse } from '@/lib/types/jio-saavn/albums.types';
import { T_ImageLink } from '@/lib/types/jio-saavn/global.types';
import { T_Song, T_SongAPIResponse } from '@/lib/types/jio-saavn/song.types';

type T_SocialLinks = {
    dob: string | null;
    fb: string | null;
    twitter: string | null;
    wiki: string | null;
};

type T_BioBlock = {
    text: string | null;
    title: string | null;
    sequence: number | null;
};

type T_ArtistURLs = {
    albums: string;
    bio: string;
    comments: string;
    songs: string;
    overview: string;
};

type T_ArtistPlaylistApiResponse = T_ArtistBaseAPIResponse & {
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

type T_SimilarArtistApiResponse = Omit<T_ArtistBaseAPIResponse, 'role'> &
    T_SocialLinks & {
        languages: string | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similar: string | null;
    };

type T_SimilarArtist = Omit<T_ArtistBase, 'role'> &
    T_SocialLinks & {
        languages: Record<string, string> | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similarArtists: { id: string; name: string }[] | null;
    };

export type T_ArtistBase = {
    id: string;
    name: string;
    role?: string;
    type: string;
    image: T_ImageLink[];
    url?: string;
};

export type T_ArtistBaseAPIResponse = Omit<T_ArtistBase, 'image' | 'url'> & {
    image: string;
    perma_url: string;
};

export type T_ArtistAPIResponse = T_ArtistBaseAPIResponse &
    T_SocialLinks & {
        artistId: string;
        subtitle: string;
        follower_count: string;
        isVerified: boolean;
        dominantLanguage: string;
        dominantType: string;
        topSongs: T_SongAPIResponse[];
        topAlbums: T_AlbumAPIResponse[];
        singles: T_SongAPIResponse[];
        dedicated_artist_playlist: T_ArtistPlaylistApiResponse[];
        featured_artist_playlist: T_ArtistPlaylistApiResponse[];
        similarArtists: T_SimilarArtistApiResponse[];
        isRadioPresent: boolean;
        bio: string;
        urls: T_ArtistURLs;
        availableLanguages: string[];
        fan_count: string;
        topEpisodes: string[];
        is_followed: boolean;
    };

export type T_Artist = T_SocialLinks & {
    id: string;
    name: string;
    url: string;
    type: string;
    image: T_ImageLink[];
    followerCount: number | null;
    fanCount: string | null;
    isVerified: boolean | null;
    dominantLanguage: string | null;
    dominantType: string | null;
    bio: T_BioBlock[] | null;
    availableLanguages: string[];
    isRadioPresent: boolean | null;
    topSongs: T_Song[] | null;
    topAlbums: T_Album[] | null;
    singles: T_Song[] | null;
    similarArtists: T_SimilarArtist[] | null;
};

export type T_ArtistSongAPIResponse = {
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
        songs: T_SongAPIResponse[];
        total: number;
    };
};

export type T_ArtistSong = {
    total: number;
    songs: T_Song[];
};

export type T_ArtistAlbumAPIResponse = {
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
        albums: T_AlbumAPIResponse[];
        total: number;
    };
};

export type T_ArtistAlbum = {
    total: number;
    albums: T_Album[];
};
