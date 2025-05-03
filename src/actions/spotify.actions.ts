'use server';

import { auth } from '@/auth';
import spotifyApi from '@/lib/services/spotify.service';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { extractRecentPlaylists } from '@/lib/utils/server.utils';

const withSpotifyAuth = async <T>(callback: (accessToken: string) => Promise<T>) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }
    return callback(accessToken);
};

export const getSpotifyCurrentUserPlaylists = async () => withSpotifyAuth((token) => spotifyApi.getUserPlaylists(token));

export const getSpotifyPlaylistDetails = async (playlistId: string) =>
    withSpotifyAuth(async (token) => {
        const res = await spotifyApi.getPlaylistDetails(token, playlistId);
        return res.success
            ? createSuccessReturn('Playlist details fetched successfully!', res.payload)
            : createErrorReturn(res.message || 'Failed to fetch playlist details', res.error);
    });

export const getSpotifyData = async <T>(url: string) =>
    withSpotifyAuth(async (token) => {
        const [error, res] = await spotifyApi.fetchSpotifyData<T>({ token, url });
        return error
            ? createErrorReturn(error.message || 'Failed to fetch Spotify data', error)
            : createSuccessReturn('Spotify data fetched successfully!', res);
    });

export const getSpotifyRecentlyPlayedPlaylists = async () =>
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

export const getSpotifyRecentlyPlayedTracks = async (limit = 50) => withSpotifyAuth((token) => spotifyApi.getUserRecentlyPlayedTracks(token, limit));

export const getSpotifyTopArtists = async (limit = 50) => withSpotifyAuth((token) => spotifyApi.getUserTopArtists(token, limit));

export const getSpotifyTopTracks = async (limit = 50) => withSpotifyAuth((token) => spotifyApi.getUserTopTracks(token, limit));

export const getSpotifyTrackDetails = async (trackId: string) => withSpotifyAuth((token) => spotifyApi.getTrackDetails(token, trackId));

export const getMultipleTracksDetails = async (ids: string[]) => withSpotifyAuth((token) => spotifyApi.getMultipleTracksDetails(token, ids));

export const getSpotifyAlbumDetails = async (albumId: string) => withSpotifyAuth((token) => spotifyApi.getAlbumDetails(token, albumId));

export const getSpotifyArtistDetails = async (artistId: string) => withSpotifyAuth((token) => spotifyApi.getArtistDetails(token, artistId));

export const getSpotifyArtistTopTracks = async (artistId: string) => withSpotifyAuth((token) => spotifyApi.getArtistTopTracks(token, artistId));

export const getSpotifyArtistAlbums = async (artistId: string, limit = 10) =>
    withSpotifyAuth((token) => spotifyApi.getArtistAlbums(token, artistId, limit));
