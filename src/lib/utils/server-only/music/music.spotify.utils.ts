import { Prisma } from '@prisma/client';

import {
    T_SpotifyAlbum,
    T_SpotifyArtist,
    T_SpotifyImage,
    T_SpotifySimplifiedAlbum,
    T_SpotifySimplifiedArtist,
    T_SpotifySimplifiedTrack,
    T_SpotifyTrack,
} from '@/lib/types/spotify.types';

// ---------------- Helpers ----------------
const IMAGE_SIZE_MAP = { 160: 'sm', 320: 'md', 640: 'lg' } as const;

const FALLBACK_IMAGE = {
    sm: 'https://res.cloudinary.com/dra73suxl/image/upload/w_50,h_50,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
    md: 'https://res.cloudinary.com/dra73suxl/image/upload/w_150,h_150,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
    lg: 'https://res.cloudinary.com/dra73suxl/image/upload/w_500,h_500,c_fill/v1744229654/no_cover_image_fallback_jhsdj.png',
} as const;

const normalizeSpotifyImage = (images: T_SpotifyImage[] = []) =>
    images.reduce<Record<keyof typeof FALLBACK_IMAGE, string>>(
        (acc, img) => {
            const sizeKey = IMAGE_SIZE_MAP[img.width as keyof typeof IMAGE_SIZE_MAP];
            if (sizeKey && !acc[sizeKey]) acc[sizeKey] = img.url;
            return acc;
        },
        { ...FALLBACK_IMAGE }
    );

const normalizeDate = (date?: string) => (date ? new Date(date) : new Date());

// ---------------- TRACK ----------------
export const normalizeSpotifyTrackLight = (track: T_SpotifySimplifiedTrack, opts = { skipArtists: false }) => {
    const normalized = {
        title: track.name,
        durationMs: track.duration_ms,
        explicit: track.explicit,
        discNumber: track.disc_number,
        spotifyId: track.id,
        trackNumber: track.track_number,
    };

    const artists = !opts.skipArtists ? (track.artists?.map(normalizeSpotifyArtistLight) ?? []) : [];

    return {
        ...normalized,
        artists,
        _create: {
            ...normalized,
            ...(artists.length && {
                artists: {
                    connectOrCreate: artists.map((artist) => ({
                        where: { spotifyId: artist.spotifyId },
                        create: artist._create,
                    })),
                },
            }),
        } satisfies Prisma.TrackCreateInput,
        _update: {},
    };
};

export const normalizeSpotifyTrackFull = (track: T_SpotifyTrack) => {
    const base = normalizeSpotifyTrackLight(track, { skipArtists: true });
    const artists = track.artists.map(normalizeSpotifyArtistFull);
    const album = normalizeSpotifyAlbumLight(track.album);

    return {
        ...base,
        popularity: track.popularity,
        isrc: track.external_ids.isrc,
        album,
        artists,
        _create: {
            ...base._create,
            popularity: track.popularity,
            isrc: track.external_ids.isrc,
            artists: {
                connectOrCreate: artists.map((artist) => ({
                    where: { spotifyId: artist.spotifyId },
                    create: artist._create,
                })),
            },
            album: {
                connectOrCreate: {
                    where: { spotifyId: album.spotifyId },
                    create: album._create,
                },
            },
        } satisfies Prisma.TrackCreateInput,
        _update: {
            popularity: track.popularity,
            isrc: track.external_ids.isrc,
            artists: {
                connectOrCreate: artists.map((artist) => ({
                    where: { spotifyId: artist.spotifyId },
                    create: artist._create,
                })),
            },
            album: {
                connectOrCreate: {
                    where: { spotifyId: album.spotifyId },
                    create: album._create,
                },
            },
        },
    };
};

// ---------------- ALBUM ----------------
export const normalizeSpotifyAlbumLight = (album: Omit<T_SpotifySimplifiedAlbum, 'album_group'>) => {
    const normalized = {
        title: album.name,
        releaseDate: normalizeDate(album.release_date),
        totalTracks: album.total_tracks,
        spotifyId: album.id,
    };

    const artists = album.artists?.map(normalizeSpotifyArtistLight) ?? [];
    const image = normalizeSpotifyImage(album.images);

    return {
        ...normalized,
        artists,
        image,
        _create: {
            ...normalized,
            ...(artists.length && {
                artists: {
                    connectOrCreate: artists.map((artist) => ({
                        where: { spotifyId: artist.spotifyId },
                        create: artist._create,
                    })),
                },
            }),
            image: { create: image },
        } satisfies Prisma.AlbumCreateInput,
        _update: {},
    };
};

export const normalizeSpotifyAlbumFull = (album: T_SpotifyAlbum) => {
    const base = normalizeSpotifyAlbumLight(album);
    const tracks = album.tracks.items.map((t) => normalizeSpotifyTrackLight(t));

    return {
        ...base,
        tracks,
        _create: {
            ...base._create,
            popularity: album.popularity,
            tracks: {
                connectOrCreate: tracks.map(({ _create }) => ({
                    where: { spotifyId: _create.spotifyId },
                    create: _create,
                })),
            },
        } satisfies Prisma.AlbumCreateInput,
        _update: {
            popularity: album.popularity,
            tracks: {
                connectOrCreate: tracks.map(({ _create }) => ({
                    where: { spotifyId: _create.spotifyId },
                    create: _create,
                })),
            },
        },
    };
};

// ---------------- ARTIST ----------------
export const normalizeSpotifyArtistLight = (artist: T_SpotifySimplifiedArtist) => ({
    name: artist.name,
    spotifyId: artist.id,
    _create: {
        name: artist.name,
        spotifyId: artist.id,
    } satisfies Prisma.ArtistCreateInput,
    _update: {},
});

export const normalizeSpotifyArtistFull = (artist: T_SpotifyArtist) => {
    const base = normalizeSpotifyArtistLight(artist);
    const image = normalizeSpotifyImage(artist.images);
    return {
        ...base,
        image: { create: image },
        popularity: artist.popularity,
        _create: {
            ...base._create,
            image: { create: image },
            popularity: artist.popularity,
        },
        _update: {
            image: { create: image },
            popularity: artist.popularity,
        },
    };
};
