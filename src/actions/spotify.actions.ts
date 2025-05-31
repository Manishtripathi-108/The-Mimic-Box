'use server';

import { auth } from '@/auth';
import spotifyApi from '@/lib/services/spotify.service';
import { T_SpotifyPaging, T_SpotifySimplifiedTrack } from '@/lib/types/spotify.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { extractRecentPlaylists } from '@/lib/utils/server.utils';

// Wrapper for checking Spotify auth token
const withSpotifyAuth = async <T>(callback: (accessToken: string) => Promise<T>) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;

    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    return callback(accessToken);
};

/* --------------------------- User-based actions --------------------------- */
export const getSpotifyUserPlaylists = async () => withSpotifyAuth((token) => spotifyApi.getUserPlaylists(token));

export const getSpotifyUserRecentlyPlayedTracks = async (limit = 50) =>
    withSpotifyAuth((token) => spotifyApi.getUserRecentlyPlayedTracks(token, limit));

export const getSpotifyUserRecentlyPlayedPlaylists = async () =>
    withSpotifyAuth(async (token) => {
        const res = await spotifyApi.getUserRecentlyPlayedTracks(token);
        if (!res.success) {
            return createErrorReturn(res.message || 'Failed to fetch recently played tracks', res.error);
        }

        const playlistIds = extractRecentPlaylists(res.payload.items);
        const playlists = await Promise.all(
            playlistIds.map(async (id) => {
                const meta = await spotifyApi.getPlaylistDetails(token, id);
                return meta.success ? meta.payload : null;
            })
        );

        return createSuccessReturn('User recently played playlists fetched successfully!', playlists.filter(Boolean));
    });

export const getSpotifyUserTopArtists = async (limit = 50) => withSpotifyAuth((token) => spotifyApi.getUserTopArtists(token, limit));

export const getSpotifyUserTopTracks = async (limit = 50) => withSpotifyAuth((token) => spotifyApi.getUserTopTracks(token, limit));

/* -------------------------------- Playlist -------------------------------- */
export const getSpotifyPlaylistDetails = async (playlistId: string) =>
    withSpotifyAuth(async (token) => {
        const res = await spotifyApi.getPlaylistDetails(token, playlistId);
        return res.success
            ? createSuccessReturn('Playlist details fetched successfully!', res.payload)
            : createErrorReturn(res.message || 'Failed to fetch playlist details', res.error);
    });

/* ---------------------------------- Album --------------------------------- */
export const getSpotifyAlbumDetails = async (albumId: string) => withSpotifyAuth((token) => spotifyApi.getAlbumDetails(token, albumId));

/* ---------------------------------- Track --------------------------------- */
export const getSpotifyTrackDetails = async (trackId: string) => withSpotifyAuth((token) => spotifyApi.getTrackDetails(token, trackId));

export const getSpotifyMultipleTracksDetails = async (ids: string[]) => withSpotifyAuth((token) => spotifyApi.getMultipleTracksDetails(token, ids));

/* --------------------------------- Artist --------------------------------- */
export const getSpotifyArtistDetails = async (artistId: string) => withSpotifyAuth((token) => spotifyApi.getArtistDetails(token, artistId));

export const getSpotifyArtistTopTracks = async (artistId: string) => withSpotifyAuth((token) => spotifyApi.getArtistTopTracks(token, artistId));

export const getSpotifyArtistAlbums = async (artistId: string, limit = 10) =>
    withSpotifyAuth((token) => spotifyApi.getArtistAlbums(token, artistId, limit));

/* ------------------------------ Generic fetch ----------------------------- */
export const fetchSpotifyDataByUrl = async <T>(url: string) =>
    withSpotifyAuth(async (token) => {
        const [error, res] = await spotifyApi.fetchSpotifyData<T>({ token, url });
        return error ? createErrorReturn('Failed to fetch Spotify data', error) : createSuccessReturn('Spotify data fetched successfully!', res);
    });

/* --------------------------- Paginated fetching --------------------------- */
export const fetchAllSpotifyPaginatedItems = async <T>(token: string, initialPage: T_SpotifyPaging<T>): Promise<T[]> => {
    const items: T[] = [...initialPage.items];
    let nextUrl: string | null = initialPage.next;
    let i = 0;
    while (nextUrl) {
        console.log(`Fetching next page: ${nextUrl}`, i++);

        const [error, response] = await spotifyApi.fetchSpotifyData<T_SpotifyPaging<T>>({ token, url: nextUrl });
        if (error) break;
        items.push(...response.items);
        nextUrl = response.next;
    }

    return items;
};

/* -------------------------- Entity track resolver ------------------------- */
export const getSpotifyEntityTracks = async (id: string, type: 'album' | 'playlist' | 'track' | 'artist') => {
    const token = await auth().then((session) => session?.user?.linkedAccounts?.spotify?.accessToken);

    if (!token) {
        return createErrorReturn('Spotify access token not found');
    }

    try {
        let tracks: T_SpotifySimplifiedTrack[] = [];

        switch (type) {
            case 'album': {
                const res = await spotifyApi.getAlbumTracks(token, id);
                if (!res.success) throw new Error('Failed to fetch album tracks: ' + res.error);
                tracks = await fetchAllSpotifyPaginatedItems(token, res.payload);
                break;
            }

            case 'playlist': {
                const res = await spotifyApi.getPlaylistTracks(token, id);
                if (!res.success) throw new Error('Failed to fetch playlist tracks: ' + res.error);
                const paginated = await fetchAllSpotifyPaginatedItems(token, res.payload);

                tracks = paginated.map(({ track }) => (track && !('show' in track) ? track : null)).filter((t) => t !== null);
                break;
            }

            case 'track': {
                const res = await spotifyApi.getTrackDetails(token, id);
                if (!res.success) throw new Error('Failed to fetch track details: ' + res.error);
                tracks = [res.payload];
                break;
            }

            case 'artist': {
                const res = await spotifyApi.getArtistTopTracks(token, id);
                if (!res.success) throw new Error('Failed to fetch artist top tracks: ' + res.error);
                tracks = res.payload;
                break;
            }

            default:
                throw new Error('Invalid type provided for fetching tracks');
        }

        if (!tracks.length) {
            throw new Error('No valid tracks found for selected entity');
        }

        return createSuccessReturn('Tracks fetched successfully!', tracks);
    } catch (err) {
        return createErrorReturn('Unexpected error fetching tracks from entity', { error: err });
    }
};
