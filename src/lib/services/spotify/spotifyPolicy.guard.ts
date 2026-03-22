import { spotifyPolicyConfig } from '@/lib/config/spotify-policy.config';
import { createError } from '@/lib/utils/createResponse.utils';

type T_DeprecatedSpotifyFeature =
    | 'artist.topTracks'
    | 'artist.getArtists'
    | 'album.getAlbums'
    | 'album.getNewReleases'
    | 'playlist.getUserPlaylists'
    | 'track.getTracks'
    | 'user.getUser'
    | 'user.following'
    | 'user.followPlaylist';

const deprecatedFeatureMessages: Record<T_DeprecatedSpotifyFeature, string> = {
    'artist.topTracks': 'Get Artist Top Tracks was removed by Spotify in February 2026.',
    'artist.getArtists': 'Get Several Artists was removed by Spotify in February 2026.',
    'album.getAlbums': 'Get Several Albums was removed by Spotify in February 2026.',
    'album.getNewReleases': 'Get New Releases was removed by Spotify in February 2026.',
    'playlist.getUserPlaylists': "Get User's Playlists by user id was removed by Spotify in February 2026.",
    'track.getTracks': 'Get Several Tracks was removed by Spotify in February 2026.',
    'user.getUser': "Get User's Profile by user id was removed by Spotify in February 2026.",
    'user.following': 'Following endpoints moved to library endpoints in February 2026 and are disabled here until remapped.',
    'user.followPlaylist': 'Playlist follower endpoints moved to library endpoints in February 2026 and are disabled here until remapped.',
};

const createPolicyBlockedResponse = (featureName: string, reason: string) =>
    createError('Spotify policy changed: feature deactivated.', {
        status: 403,
        code: 'access_denied',
        details: {
            feature: featureName,
            reason,
            premiumRequired: true,
            action: 'Set SPOTIFY_PREMIUM_MEMBER=true to re-enable allowed Spotify features.',
        },
    });

export const ensureSpotifyPremiumAccess = (featureName = 'Spotify feature') => {
    if (spotifyPolicyConfig.isSpotifyAccessEnabled) return null;

    return createPolicyBlockedResponse(
        featureName,
        'Spotify Development Mode now requires a Premium account. Spotify integration is currently disabled by policy config.'
    );
};

export const ensureSpotifyFeatureAvailable = (feature: T_DeprecatedSpotifyFeature) => {
    if (!spotifyPolicyConfig.disableRemovedFeatures) return null;

    return createPolicyBlockedResponse(feature, deprecatedFeatureMessages[feature]);
};

const removedEndpointPatterns = [
    /^\/artists\/[^/]+\/top-tracks$/,
    /^\/artists$/,
    /^\/albums$/,
    /^\/browse\/new-releases$/,
    /^\/users\/[^/]+\/playlists$/,
    /^\/users\/[^/]+$/,
    /^\/tracks$/,
    /^\/me\/following(?:\/contains)?$/,
    /^\/playlists\/[^/]+\/followers(?:\/contains)?$/,
    /^\/markets$/,
    /^\/browse\/categories(?:\/[^/]+)?$/,
    /^\/episodes$/,
    /^\/shows$/,
    /^\/chapters$/,
    /^\/audiobooks$/,
] as const;

const normalizeSpotifyPath = (url: string) => {
    const parsed = new URL(url, 'https://api.spotify.com');
    return parsed.pathname.replace(/^\/v1/, '') || '/';
};

export const ensureSpotifyUrlAvailable = (url: string) => {
    if (!spotifyPolicyConfig.disableRemovedFeatures) return null;

    const path = normalizeSpotifyPath(url);
    const isRemoved = removedEndpointPatterns.some((pattern) => pattern.test(path));

    if (!isRemoved) return null;

    return createPolicyBlockedResponse(path, 'This Spotify endpoint is no longer available under the February 2026 platform changes.');
};
