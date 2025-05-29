import crypto from 'node-forge';

import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { T_Album, T_AlbumAPIResponse, T_SearchAlbum, T_SearchAlbumAPIResponse } from '@/lib/types/jio-saavn/albums.types';
import { T_Artist, T_ArtistAPIResponse, T_ArtistBase, T_ArtistBaseAPIResponse } from '@/lib/types/jio-saavn/artists.type';
import { T_Playlist, T_PlaylistAPIResponse } from '@/lib/types/jio-saavn/playlist.types';
import { T_SearchAPIResponse, T_SearchPlaylist, T_SearchPlaylistAPIResponse, T_SearchResponse } from '@/lib/types/jio-saavn/search.types';
import { T_Song, T_SongAPIResponse } from '@/lib/types/jio-saavn/song.types';

const QUALITIES = [
    { id: '_12', bitrate: '12kbps' },
    { id: '_48', bitrate: '48kbps' },
    { id: '_96', bitrate: '96kbps' },
    { id: '_160', bitrate: '160kbps' },
    { id: '_320', bitrate: '320kbps' },
] as const;

const IMAGE_SIZES = ['50x50', '150x150', '500x500'] as const;
const QUALITY_REGEX = /150x150|50x50/;
const PROTOCOL_REGEX = /^http:\/\//;
const DES_KEY = '38346591';
const DES_IV = '00000000';

export const createDownloadLinks = (encryptedMediaUrl: string) => {
    if (!encryptedMediaUrl) return [];

    const encrypted = crypto.util.decode64(encryptedMediaUrl);
    const decipher = crypto.cipher.createDecipher('DES-ECB', crypto.util.createBuffer(DES_KEY));
    decipher.start({ iv: crypto.util.createBuffer(DES_IV) });
    decipher.update(crypto.util.createBuffer(encrypted));
    decipher.finish();

    const decryptedLink = decipher.output.getBytes();

    return QUALITIES.map(({ id, bitrate }) => ({
        quality: bitrate,
        url: decryptedLink.replace('_96', id).replace(PROTOCOL_REGEX, 'https://'),
    }));
};

export const createImageLinks = (link: string) => {
    if (!link || link.includes('default')) {
        return IMAGE_SIZES.map((size) => ({
            quality: size,
            url: IMAGE_FALLBACKS.AUDIO_COVER,
        }));
    }

    return IMAGE_SIZES.map((quality) => ({
        quality,
        url: link.replace(QUALITY_REGEX, quality).replace(PROTOCOL_REGEX, 'https://'),
    }));
};

export const createArtistBasePayload = (artist: T_ArtistBaseAPIResponse): T_ArtistBase => ({
    id: artist.id,
    name: artist.name,
    role: artist.role,
    image: createImageLinks(artist.image),
    type: artist.type,
    url: artist.perma_url,
});

export const createSongPayload = (song: T_SongAPIResponse): T_Song => ({
    id: song.id,
    name: song.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"'),
    type: song.type,
    year: song.year || null,
    releaseDate: song.more_info?.release_date || null,
    duration: song.more_info?.duration ? Number(song.more_info.duration) : null,
    label: song.more_info?.label || null,
    explicitContent: song.explicit_content === '1',
    playCount: song.play_count ? Number(song.play_count) : null,
    language: song.language,
    hasLyrics: song.more_info?.has_lyrics === 'true',
    lyricsId: song.more_info?.lyrics_id || null,
    lyricsSnippet: song.more_info?.lyrics_snippet || null,
    url: song.perma_url,
    copyright: song.more_info?.copyright_text || null,
    album: {
        id: song.more_info?.album_id || null,
        name: song.more_info?.album.replace(/&amp;/g, '&').replace(/&quot;/g, '"') || null,
        url: song.more_info?.album_url || null,
    },
    artists: {
        primary: song.more_info?.artistMap?.primary_artists?.map(createArtistBasePayload),
        featured: song.more_info?.artistMap?.featured_artists?.map(createArtistBasePayload),
        all: song.more_info?.artistMap?.artists?.map(createArtistBasePayload),
    },
    image: createImageLinks(song.image),
    downloadUrl: createDownloadLinks(song.more_info?.encrypted_media_url),
});

export const createArtistPayload = (artist: T_ArtistAPIResponse): T_Artist => ({
    id: artist.artistId || artist.id,
    name: artist.name,
    url: artist.urls?.overview || artist.perma_url,
    type: artist.type,
    followerCount: artist.follower_count ? Number(artist.follower_count) : null,
    fanCount: artist.fan_count || null,
    isVerified: artist.isVerified || null,
    dominantLanguage: artist.dominantLanguage || null,
    dominantType: artist.dominantType || null,
    bio: artist.bio ? JSON.parse(artist.bio) : null,
    dob: artist.dob || null,
    fb: artist.fb || null,
    twitter: artist.twitter || null,
    wiki: artist.wiki || null,
    availableLanguages: artist.availableLanguages || null,
    isRadioPresent: artist.isRadioPresent || null,
    image: createImageLinks(artist.image),
    topSongs: artist.topSongs?.map(createSongPayload) || null,
    topAlbums: artist.topAlbums?.map(createAlbumPayload) || null,
    singles: artist.singles?.map(createSongPayload) || null,
    similarArtists:
        artist.similarArtists?.map((a) => ({
            id: a.id,
            name: a.name,
            url: a.perma_url,
            image: createImageLinks(a.image),
            languages: a.languages ? JSON.parse(a.languages) : null,
            wiki: a.wiki,
            dob: a.dob,
            fb: a.fb,
            twitter: a.twitter,
            isRadioPresent: a.isRadioPresent,
            type: a.type,
            dominantType: a.dominantType,
            aka: a.aka,
            bio: a.bio ? JSON.parse(a.bio) : null,
            similarArtists: a.similar ? JSON.parse(a.similar) : null,
        })) || null,
});

export const createSearchPayload = (search: T_SearchAPIResponse): T_SearchResponse => ({
    topQuery: {
        results: search?.topquery?.data.map((item) => ({
            id: item?.id,
            title: item?.title,
            image: createImageLinks(item?.image),
            album: item?.more_info?.album,
            url: item?.perma_url,
            type: item?.type,
            language: item?.more_info?.language,
            description: item?.description,
            primaryArtists: item?.more_info?.primary_artists,
            singers: item?.more_info?.singers,
        })),
        position: search?.topquery?.position,
    },
    songs: {
        results: search?.songs?.data.map((song) => ({
            id: song?.id,
            title: song?.title,
            image: createImageLinks(song?.image),
            album: song?.more_info.album,
            url: song?.perma_url,
            type: song?.type,
            description: song?.description,
            primaryArtists: song?.more_info?.primary_artists,
            singers: song?.more_info?.singers,
            language: song?.more_info?.language,
        })),
        position: search.songs.position,
    },
    albums: {
        results: search?.albums?.data.map((album) => ({
            id: album?.id,
            title: album?.title,
            image: createImageLinks(album.image),
            artist: album?.more_info.music,
            url: album?.perma_url,
            type: album?.type,
            description: album?.description,
            year: album?.more_info?.year,
            songIds: album?.more_info?.song_pids,
            language: album?.more_info?.language,
        })),
        position: search?.albums?.position,
    },
    artists: {
        results: search?.artists?.data.map((artist) => ({
            id: artist?.id,
            title: artist?.title,
            name: artist?.name,
            image: createImageLinks(artist?.image),
            type: artist?.type,
            description: artist?.description,
        })),
        position: search?.artists?.position,
    },
    playlists: {
        results: search?.playlists?.data.map((playlist) => ({
            id: playlist?.id,
            title: playlist?.title,
            image: createImageLinks(playlist.image),
            url: playlist?.perma_url,
            type: playlist?.type,
            language: playlist?.more_info?.language,
            description: playlist?.description,
        })),
        position: search?.playlists?.position,
    },
});

export const createSearchPlaylistPayload = (playlist: T_SearchPlaylistAPIResponse): T_SearchPlaylist => ({
    total: Number(playlist.total),
    start: Number(playlist.start),
    results: playlist.results.map((item) => ({
        id: item.id,
        name: item.title,
        type: item.type,
        image: createImageLinks(item.image),
        url: item.perma_url,
        songCount: item.more_info.song_count ? Number(item.more_info.song_count) : null,
        language: item.more_info.language,
        explicitContent: item.explicit_content === '1',
    })),
});

export const createSearchAlbumPayload = (album: T_SearchAlbumAPIResponse): T_SearchAlbum => ({
    total: Number(album.total),
    start: Number(album.start),
    results: album.results.map((item) => ({
        id: item.id,
        name: item.title,
        description: item.header_desc,
        url: item.perma_url,
        year: item.year ? Number(item.year) : null,
        type: item.type,
        playCount: item.play_count ? Number(item.play_count) : null,
        language: item.language,
        explicitContent: item.explicit_content === '1',
        artists: {
            primary: item.more_info?.artistMap?.primary_artists?.map(createArtistBasePayload),
            featured: item.more_info?.artistMap?.featured_artists?.map(createArtistBasePayload),
            all: item.more_info?.artistMap?.artists?.map(createArtistBasePayload),
        },
        image: createImageLinks(item.image),
    })),
});

export const createAlbumPayload = (album: T_AlbumAPIResponse): T_Album => ({
    id: album.id,
    name: album.title,
    description: album.header_desc,
    type: album.type,
    year: album.year ? Number(album.year) : null,
    playCount: album.play_count ? Number(album.play_count) : null,
    language: album.language,
    explicitContent: album.explicit_content === '1',
    url: album.perma_url,
    songCount: album.more_info.song_count ? Number(album.more_info.song_count) : null,
    artists: {
        primary: album.more_info?.artistMap?.primary_artists?.map(createArtistBasePayload),
        featured: album.more_info?.artistMap?.featured_artists?.map(createArtistBasePayload),
        all: album.more_info?.artistMap?.artists?.map(createArtistBasePayload),
    },
    image: createImageLinks(album.image),
    songs: album.list?.map(createSongPayload) || null,
});

export const createPlaylistPayload = (playlist: T_PlaylistAPIResponse): T_Playlist => ({
    id: playlist.id,
    name: playlist.title,
    description: playlist.header_desc,
    type: playlist.type,
    year: playlist.year ? Number(playlist.year) : null,
    playCount: playlist.play_count ? Number(playlist.play_count) : null,
    language: playlist.language,
    explicitContent: playlist.explicit_content === '1',
    url: playlist.perma_url,
    songCount: playlist.list_count ? Number(playlist.list_count) : null,
    artists: playlist.more_info.artists?.map(createArtistBasePayload) || null,
    image: createImageLinks(playlist.image),
    songs: (playlist.list && playlist.list?.map(createSongPayload)) || null,
});
