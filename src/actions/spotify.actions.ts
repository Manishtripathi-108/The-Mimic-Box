'use server';

import { auth } from '@/auth';
import spotifyServices from '@/lib/services/spotify/index.spotify.services';
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

/* --------------------------- User --------------------------- */
export const spotifyGetUserPlaylists = async () => withSpotifyAuth((token) => spotifyServices.playlists.getMyPlaylists(token));

export const spotifyGetUserTopArtists = async (limit = 50) => withSpotifyAuth((token) => spotifyServices.users.getTopArtists(token, limit));

export const spotifyGetUserTopTracks = async (limit = 50) => withSpotifyAuth((token) => spotifyServices.users.getTopTracks(token, limit));

/* -------------------------- Player -------------------------- */
export const spotifyGetRecentTracks = async (limit = 50) => withSpotifyAuth((token) => spotifyServices.player.getRecentTracks(token, limit));

export const spotifyGetRecentPlaylists = async () =>
    withSpotifyAuth(async (token) => {
        const res = await spotifyServices.player.getRecentTracks(token);
        if (!res.success) {
            return createErrorReturn(res.message || 'Failed to fetch recently played tracks', res.error);
        }

        const playlistIds = extractRecentPlaylists(res.payload.items);
        const playlists = await Promise.all(
            playlistIds.map(async (id) => {
                const meta = await spotifyServices.playlists.getPlaylist(token, id);
                return meta.success ? meta.payload : null;
            })
        );

        return createSuccessReturn('Recently played playlists fetched!', playlists.filter(Boolean));
    });

/* -------------------------- Playlist -------------------------- */
export const spotifyGetPlaylist = async (playlistId: string) =>
    withSpotifyAuth(async (token) => {
        const res = await spotifyServices.playlists.getPlaylist(token, playlistId);
        return res.success
            ? createSuccessReturn('Playlist fetched!', res.payload)
            : createErrorReturn(res.message || 'Failed to fetch playlist', res.error);
    });

/* -------------------------- Album -------------------------- */
export const spotifyGetAlbum = async (albumId: string) => withSpotifyAuth((token) => spotifyServices.albums.getAlbum(token, albumId));

/* -------------------------- Track -------------------------- */
export const spotifyGetTrack = async (trackId: string) => withSpotifyAuth((token) => spotifyServices.tracks.getTrack(token, trackId));

export const spotifyGetTracks = async (ids: string[]) => withSpotifyAuth((token) => spotifyServices.tracks.getTracks(token, ids));

/* -------------------------- Artist -------------------------- */
export const spotifyGetArtist = async (artistId: string) => withSpotifyAuth((token) => spotifyServices.artists.getArtist(token, artistId));

export const spotifyGetArtistTopTracks = async (artistId: string) =>
    withSpotifyAuth((token) => spotifyServices.artists.getArtistTopTracks(token, artistId));

export const spotifyGetArtistAlbums = async (artistId: string, limit = 10) =>
    withSpotifyAuth((token) => spotifyServices.artists.getArtistAlbums(token, artistId, limit));

/* ---------------------- Generic Fetch ----------------------- */
export const spotifyGetByUrl = async <T>(url: string) =>
    withSpotifyAuth(async (token) => {
        const [error, res] = await spotifyServices.fetchSpotifyData<T>({ token, url });
        return error ? createErrorReturn('Failed to fetch Spotify data', error) : createSuccessReturn('Data fetched!', res);
    });

/* ------------------ Paginated Fetching --------------------- */
export const spotifyGetPaginatedItems = async <T>(token: string, initialPage: T_SpotifyPaging<T>): Promise<T[]> => {
    const items: T[] = [...initialPage.items];
    let nextUrl: string | null = initialPage.next;

    while (nextUrl) {
        const [error, response] = await spotifyServices.fetchSpotifyData<T_SpotifyPaging<T>>({ token, url: nextUrl });
        if (error) break;
        items.push(...response.items);
        nextUrl = response.next;
    }

    return items;
};

/* ----------------- Tracks from Any Entity ------------------ */
export const spotifyGetEntityTracks = async (id: string, type: 'album' | 'playlist' | 'track' | 'artist') => {
    const token = await auth().then((session) => session?.user?.linkedAccounts?.spotify?.accessToken);

    if (!token) return createErrorReturn('Spotify access token not found');
    if (!id || !type) return createErrorReturn('Invalid parameters');

    try {
        let tracks: T_SpotifySimplifiedTrack[] = [];

        switch (type) {
            case 'album': {
                const res = await spotifyServices.albums.getAlbumTracks(token, id);
                if (!res.success) throw new Error(res.message);
                tracks = await spotifyGetPaginatedItems(token, res.payload);
                break;
            }
            case 'playlist': {
                const res = await spotifyServices.playlists.getPlaylistItems(token, id);
                if (!res.success) throw new Error(res.message);
                const paginated = await spotifyGetPaginatedItems(token, res.payload);
                tracks = paginated.map(({ track }) => (track && !('show' in track) ? track : null)).filter((t) => t !== null);
                break;
            }
            case 'track': {
                const res = await spotifyServices.tracks.getTrack(token, id);
                if (!res.success) throw new Error(res.message);
                tracks = [res.payload];
                break;
            }
            case 'artist': {
                const res = await spotifyServices.artists.getArtistTopTracks(token, id);
                if (!res.success) throw new Error(res.message);
                tracks = res.payload;
                break;
            }
            default:
                throw new Error('Invalid type');
        }

        if (!tracks.length) throw new Error('No valid tracks found');

        return createSuccessReturn('Tracks fetched!', tracks);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error fetching entity tracks';
        return createErrorReturn(message, { error: err });
    }
};
