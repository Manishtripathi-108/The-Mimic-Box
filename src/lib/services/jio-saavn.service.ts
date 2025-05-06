import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import jioSaavnConfig from '@/lib/config/jio-saavn.config';
import { T_AlbumAPIResponse, T_SearchAlbumAPIResponse } from '@/lib/types/jio-saavn/albums.types';
import { T_ArtistAPIResponse, T_ArtistAlbumAPIResponse, T_ArtistSongAPIResponse } from '@/lib/types/jio-saavn/artists.type';
import { T_PlaylistAPIResponse } from '@/lib/types/jio-saavn/playlist.types';
import {
    T_SearchAPIResponse,
    T_SearchArtistAPIResponse,
    T_SearchPlaylistAPIResponse,
    T_SearchSongAPIResponse,
} from '@/lib/types/jio-saavn/search.types';
import { T_SongAPIResponse, T_SongSuggestionAPIResponse } from '@/lib/types/jio-saavn/song.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import {
    createAlbumPayload,
    createArtistBasePayload,
    createArtistPayload,
    createPlaylistPayload,
    createSearchAlbumPayload,
    createSearchPayload,
    createSearchPlaylistPayload,
    createSongPayload,
} from '@/lib/utils/jio-saavn.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const searchAll = async (query: string) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SearchAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SEARCH.ALL, {
            params: { query },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch search results', error)
        : createSuccessReturn('Search results fetched successfully!', createSearchPayload(response.data));
};

export const searchSongs = async ({ query, limit, page }: { query: string; page: number; limit: number }) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SearchSongAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SEARCH.SONGS, {
            params: { q: query, p: page, n: limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch search results', error)
        : createSuccessReturn('Search results fetched successfully!', {
              total: response.data.total,
              start: response.data.start,
              results: response.data.results?.map(createSongPayload).slice(0, limit) || [],
          });
};

export const searchAlbums = async ({ query, limit, page }: { query: string; page: number; limit: number }) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SearchAlbumAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SEARCH.ALBUMS, {
            params: { q: query, p: page, n: limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch search results', error)
        : createSuccessReturn('Search results fetched successfully!', createSearchAlbumPayload(response.data));
};

export const searchArtists = async ({ query, limit, page }: { query: string; page: number; limit: number }) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SearchArtistAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SEARCH.ARTISTS, {
            params: { q: query, p: page, n: limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch search results', error)
        : createSuccessReturn('Search results fetched successfully!', {
              total: response.data.total,
              start: response.data.start,
              results: response.data.results?.map(createArtistBasePayload).slice(0, limit) || [],
          });
};

export const searchPlaylists = async ({ query, limit, page }: { query: string; page: number; limit: number }) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SearchPlaylistAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SEARCH.PLAYLISTS, {
            params: { q: query, p: page, n: limit },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch search results', error)
        : createSuccessReturn('Search results fetched successfully!', createSearchPlaylistPayload(response.data));
};

/* -------------------------------------------------------------------------- */
/*                                    Songs                                   */
/* -------------------------------------------------------------------------- */
export const getSongByIds = async (ids: string) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SongAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SONG.ID, {
            params: { pids: ids },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch song', error)
        : createSuccessReturn('Song fetched successfully!', createSongPayload(response.data));
};

export const getSongByLink = async (link: string) => {
    const token = link.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1];

    if (!token) {
        return createErrorReturn('Invalid song link');
    }

    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SongAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SONG.LINK, {
            params: { token, type: 'song' },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch song', error)
        : createSuccessReturn('Song fetched successfully!', createSongPayload(response.data));
};

export const getSongStation = async (id: string) => {
    const encodedSongId = JSON.stringify([encodeURIComponent(id)]);

    const [error, response] = await safeAwait(
        jioSaavnConfig.get<{ stationid: string }>(EXTERNAL_ROUTES.JIO_SAAVN.SONG.STATION, {
            params: {
                entity_id: encodedSongId,
                entity_type: 'queue',
                ctx: 'android',
            },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch song station', error)
        : createSuccessReturn('Song station fetched successfully!', response.data.stationid);
};

export const getSongSuggestions = async ({ id, limit }: { id: string; limit: number }) => {
    const stationsRes = await getSongStation(id);

    if (!stationsRes.success) {
        return createErrorReturn('Failed to fetch song suggestions');
    }

    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_SongSuggestionAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.SONG.SUGGESTIONS, {
            params: {
                stationid: stationsRes.payload,
                k: limit,
                ctx: 'android',
            },
        })
    );

    if (error || !response?.data) {
        return createErrorReturn('Failed to fetch song suggestions', error);
    }

    const rawSuggestions = Object.values(response.data);
    const suggestions = rawSuggestions
        .map((entry) => {
            if (typeof entry === 'object' && entry.song) {
                return createSongPayload(entry.song);
            }
            return null;
        })
        .filter((s) => s !== null)
        .slice(0, limit);

    return createSuccessReturn('Song suggestions fetched successfully!', suggestions);
};

/* -------------------------------------------------------------------------- */
/*                                    Album                                   */
/* -------------------------------------------------------------------------- */
export const getAlbumById = async (id: string) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_AlbumAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.ALBUM.DETAILS, {
            params: { id },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch album', error)
        : createSuccessReturn('Album fetched successfully!', createAlbumPayload(response.data));
};

export const getAlbumByLink = async (link: string) => {
    const token = link.match(/jiosaavn\.com\/album\/[^/]+\/([^/]+)$/)?.[1];

    if (!token) {
        return createErrorReturn('Invalid album link');
    }

    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_AlbumAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.ALBUM.LINK, {
            params: { token, type: 'album' },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch album', error)
        : createSuccessReturn('Album fetched successfully!', createAlbumPayload(response.data));
};

/* -------------------------------------------------------------------------- */
/*                                   Artist                                   */
/* -------------------------------------------------------------------------- */
export const getArtistById = async ({
    id,
    page,
    songCount,
    albumCount,
    sortBy,
    sortOrder,
}: {
    id: string;
    page: number;
    songCount: number;
    albumCount: number;
    sortBy: string;
    sortOrder: string;
}) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_ArtistAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.ARTIST.DETAILS, {
            params: {
                id,
                page,
                n_song: songCount,
                n_album: albumCount,
                sort_order: sortOrder,
                category: sortBy,
            },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch artist', error)
        : createSuccessReturn('Artist fetched successfully!', createArtistPayload(response.data));
};

export const getArtistByLink = async ({
    link,
    page,
    songCount,
    albumCount,
    sortBy,
    sortOrder,
}: {
    link: string;
    page: number;
    songCount: number;
    albumCount: number;
    sortBy: string;
    sortOrder: string;
}) => {
    const token = link.match(/jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/)?.[1];

    if (!token) {
        return createErrorReturn('Invalid artist link');
    }

    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_ArtistAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.ARTIST.LINK, {
            params: {
                token,
                page,
                type: 'artist',
                n_song: songCount,
                n_album: albumCount,
                sort_order: sortOrder,
                category: sortBy,
            },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch artist', error)
        : createSuccessReturn('Artist fetched successfully!', createArtistPayload(response.data));
};

export const getArtistSongs = async ({ id, page, sortBy, sortOrder }: { id: string; page: number; sortBy: string; sortOrder: string }) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_ArtistSongAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.ARTIST.SONGS, {
            params: {
                id,
                page,
                sort_order: sortOrder,
                category: sortBy,
            },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch artist songs', error)
        : createSuccessReturn('Artist songs fetched successfully!', {
              total: response.data.topSongs.total,
              songs: response.data.topSongs.songs.map((song) => createSongPayload(song)),
          });
};

export const getArtistAlbums = async ({ id, page, sortBy, sortOrder }: { id: string; page: number; sortBy: string; sortOrder: string }) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_ArtistAlbumAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.ARTIST.ALBUMS, {
            params: {
                id,
                page,
                sort_order: sortOrder,
                category: sortBy,
            },
        })
    );

    return error || !response
        ? createErrorReturn('Failed to fetch artist albums', error)
        : createSuccessReturn('Artist albums fetched successfully!', {
              total: response.data.topAlbums.total,
              albums: response.data.topAlbums.albums.map((album) => createAlbumPayload(album)),
          });
};

/* -------------------------------------------------------------------------- */
/*                                  Playlist                                  */
/* -------------------------------------------------------------------------- */
export const getPlaylistById = async ({ id, limit, page }: { id: string; page: number; limit: number }) => {
    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_PlaylistAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.PLAYLIST.DETAILS, {
            params: { id, p: page, n: limit },
        })
    );

    if (error || !response) {
        return createErrorReturn('Failed to fetch playlist', error);
    }

    const playlist = createPlaylistPayload(response.data);

    return createSuccessReturn('Playlist fetched successfully!', {
        ...playlist,
        songCount: playlist?.songs?.length || null,
        songs: playlist?.songs?.slice(0, limit) || [],
    });
};

export const getPlaylistByLink = async ({ link, limit, page }: { link: string; page: number; limit: number }) => {
    const token = link.match(/jiosaavn\.com\/playlist\/([^/]+)$/)?.[1];

    if (!token) {
        return createErrorReturn('Invalid playlist link');
    }

    const [error, response] = await safeAwait(
        jioSaavnConfig.get<T_PlaylistAPIResponse>(EXTERNAL_ROUTES.JIO_SAAVN.PLAYLIST.LINK, {
            params: { token, type: 'playlist', p: page, n: limit },
        })
    );

    if (error || !response) {
        return createErrorReturn('Failed to fetch playlist', error);
    }

    const playlist = createPlaylistPayload(response.data);

    return createSuccessReturn('Playlist fetched successfully!', {
        ...playlist,
        songCount: playlist?.songs?.length || null,
        songs: playlist?.songs?.slice(0, limit) || [],
    });
};
