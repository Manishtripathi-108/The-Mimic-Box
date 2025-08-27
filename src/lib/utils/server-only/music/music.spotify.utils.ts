import {
    T_SpotifyAlbum,
    T_SpotifyArtist,
    T_SpotifyEpisode,
    T_SpotifyImage,
    T_SpotifySimplifiedAlbum,
    T_SpotifySimplifiedArtist,
    T_SpotifySimplifiedTrack,
    T_SpotifyTrack,
} from '@/lib/types/spotify.types';

type NormalizedTrack = {
    title: string;
    durationMs: number;
    trackNumber: number;
    discNumber: number;
    explicit: boolean;
    spotifyId: string;
};

type NormalizedAlbum = {
    title: string;
    releaseDate: Date;
    totalTracks: number;
    popularity: number;
    spotifyId: string;
};

type NormalizedArtist = {
    name: string;
    spotifyId: string;
    popularity: number;
};

type ImageSizes = {
    sm?: string;
    md?: string;
    lg?: string;
};

type NormalizedTrackResult =
    | (NormalizedTrack & {
          album?: NormalizedAlbumResult;
          artists?: NormalizedArtistResult[];
      })
    | null;

type NormalizedAlbumResult =
    | (NormalizedAlbum & {
          artists?: NormalizedArtistResult[];
          tracks?: NormalizedTrackResult[];
          image?: ImageSizes | null;
      })
    | null;

type NormalizedArtistResult =
    | (NormalizedArtist & {
          image?: ImageSizes | null;
      })
    | null;

const IMAGE_SIZE_MAP = {
    160: 'sm',
    320: 'md',
    640: 'lg',
} as const;

// ---------------- Normalizers ----------------

/**
 *  Normalize Spotify Images → Prisma-compatible shape
 */
export const normalizeSpotifyImage = (images: T_SpotifyImage[]): ImageSizes | null => {
    if (!images?.length) return null;

    const result: ImageSizes = {};

    for (const image of images) {
        const sizeKey = IMAGE_SIZE_MAP[image.width as keyof typeof IMAGE_SIZE_MAP];
        if (sizeKey && !result[sizeKey]) {
            result[sizeKey] = image.url;
        }
    }

    return Object.keys(result).length ? result : null;
};

/**
 *  Normalize Spotify Track → Prisma-compatible shape
 */
export const normalizeSpotifyTrack = (
    track: T_SpotifySimplifiedTrack | T_SpotifyTrack | T_SpotifyEpisode,
    options = { withAlbum: true }
): NormalizedTrackResult => {
    if (!track || track.type === 'episode') return null;

    const normalized: NormalizedTrack = {
        title: track.name,
        durationMs: track.duration_ms,
        explicit: track.explicit,
        discNumber: track.disc_number,
        spotifyId: track.id,
        trackNumber: track.track_number,
    };

    const album = options.withAlbum && 'album' in track ? normalizeSpotifyAlbum(track.album, { withTracks: false }) : undefined;
    const artists = track.artists?.length
        ? track.artists.map((a) => normalizeSpotifyArtist(a)).filter((a): a is NonNullable<typeof a> => !!a)
        : undefined;

    return { ...normalized, album, artists };
};

/**
 *  Normalize Spotify Album → Prisma-compatible shape
 */
export const normalizeSpotifyAlbum = (album: T_SpotifyAlbum | T_SpotifySimplifiedAlbum, options = { withTracks: true }): NormalizedAlbumResult => {
    if (!album) return null;

    const normalized: NormalizedAlbum = {
        title: album.name,
        releaseDate: new Date(album.release_date ?? Date.now()),
        totalTracks: album.total_tracks,
        spotifyId: album.id,
        popularity: 'popularity' in album ? album.popularity : 0,
    };

    let tracks: NormalizedTrackResult[] | undefined;
    if (options.withTracks && 'tracks' in album) {
        tracks = album.tracks.items.map((t) => normalizeSpotifyTrack(t, { withAlbum: false })).filter((t): t is NonNullable<typeof t> => !!t);
    }

    const artists = album.artists?.length
        ? album.artists.map((a) => normalizeSpotifyArtist(a)).filter((a): a is NonNullable<typeof a> => !!a)
        : undefined;

    const image = 'images' in album ? normalizeSpotifyImage(album.images) : undefined;

    return { ...normalized, tracks, artists, image };
};

/**
 *  Normalize Spotify Artist → Prisma-compatible shape
 */
export const normalizeSpotifyArtist = (artist: T_SpotifyArtist | T_SpotifySimplifiedArtist): NormalizedArtistResult => {
    if (!artist) return null;

    const normalized: NormalizedArtist = {
        name: artist.name,
        spotifyId: artist.id,
        popularity: 'popularity' in artist ? artist.popularity : 0,
    };

    const image = 'images' in artist ? normalizeSpotifyImage(artist.images) : undefined;

    return { ...normalized, image };
};
