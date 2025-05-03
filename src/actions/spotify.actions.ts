'use server';

import { auth } from '@/auth';
import spotifyApi from '@/lib/services/spotify.service';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { extractRecentPlaylists } from '@/lib/utils/server.utils';

export const getSpotifyCurrentUserPlaylists = async () => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const res = await spotifyApi.getUserPlaylists(accessToken);
    return res;
};

export const getSpotifyPlaylistDetails = async (playlistId: string) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const res = await spotifyApi.getPlaylistDetails(accessToken, playlistId);
    if (!res.success) {
        return createErrorReturn(res.message || 'Failed to fetch playlist details', res.error);
    }
    return createSuccessReturn('Playlist details fetched successfully!', res.payload);
};

export const getSpotifyData = async <T>(url: string) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const [error, res] = await spotifyApi.fetchSpotifyData<T>({ token: accessToken, url });
    if (error) {
        return createErrorReturn(error.message || 'Failed to fetch Spotify data', error);
    }

    return createSuccessReturn('Spotify data fetched successfully!', res);
};

export const getSpotifyRecentlyPlayedPlaylists = async () => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getUserRecentlyPlayedTracks(accessToken);
    if (!tracksRes.success) {
        return createErrorReturn(tracksRes.message || 'Failed to fetch user recently played tracks', tracksRes.error);
    }

    const playlistIds = extractRecentPlaylists(tracksRes.payload.items);

    const playlists = [];
    for (const id of playlistIds) {
        const metadata = await spotifyApi.getPlaylistDetails(accessToken, id);
        if (metadata.success) {
            playlists.push(metadata.payload);
        }
    }

    return createSuccessReturn('User recently played playlists fetched successfully!', playlists);
};

export const getSpotifyRecentlyPlayedTracks = async (limit: number = 50) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getUserRecentlyPlayedTracks(accessToken, limit);
    return tracksRes;
};

export const getSpotifyTopArtists = async (limit: number = 50) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const artistsRes = await spotifyApi.getUserTopArtists(accessToken, limit);
    return artistsRes;
};

export const getSpotifyTopTracks = async (limit: number = 50) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getUserTopTracks(accessToken, limit);
    return tracksRes;
};

export const getSpotifyTrackDetails = async (ids: string) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getTrackDetails(accessToken, ids);
    return tracksRes;
};

export const getMultipleTracksDetails = async (ids: string[]) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getMultipleTracksDetails(accessToken, ids);
    return tracksRes;
};

export const getSpotifyAlbumDetails = async (ids: string) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getAlbumDetails(accessToken, ids);
    return tracksRes;
};

export const getSpotifyArtistDetails = async (ids: string) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getArtistDetails(accessToken, ids);
    return tracksRes;
};

export const getSpotifyArtistTopTracks = async (ids: string) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getArtistTopTracks(accessToken, ids);
    return tracksRes;
};

export const getSpotifyArtistAlbums = async (ids: string, limit: number = 10) => {
    const session = await auth();
    const accessToken = session?.user?.linkedAccounts?.spotify?.accessToken;
    if (!accessToken) {
        return createErrorReturn('Spotify access token not found');
    }

    const tracksRes = await spotifyApi.getArtistAlbums(accessToken, ids, limit);
    return tracksRes;
};
