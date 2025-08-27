import { db } from '@/lib/db';
import { DiscoUnion } from '@/lib/types/helper.type';
import { T_SpotifyEpisode, T_SpotifySimplifiedTrack, T_SpotifyTrack } from '@/lib/types/spotify.types';
import { normalizeSpotifyTrack } from '@/lib/utils/server-only/music/music.spotify.utils';

type T_AddTrack = {
    spotify: {
        tracks: (T_SpotifySimplifiedTrack | T_SpotifyTrack | T_SpotifyEpisode)[];
    };
    saavan: {
        tracks: (T_SpotifySimplifiedTrack | T_SpotifyTrack | T_SpotifyEpisode)[];
    };
};

type T_AddTrackUnion = DiscoUnion<T_AddTrack>;

/** Helper: deduplicate array of objects by key */
const dedupeBy = <T, K extends keyof never>(arr: T[], keyFn: (item: T) => K) => {
    const seen = new Map<K, T>();
    for (const item of arr) {
        const key = keyFn(item);
        if (!seen.has(key)) seen.set(key, item);
    }
    return Array.from(seen.values());
};

export const addTracks = async ({ type, tracks }: T_AddTrackUnion) => {
    let normalized: NonNullable<ReturnType<typeof normalizeSpotifyTrack>>[] = [];

    switch (type) {
        case 'spotify': {
            normalized = (tracks as (T_SpotifySimplifiedTrack | T_SpotifyTrack)[])
                .map((t) => normalizeSpotifyTrack(t))
                .filter((t): t is NonNullable<typeof t> => !!t);
            break;
        }

        case 'saavan': {
            // TODO: implement when Saavan API ready
            return;
        }

        default:
            return;
    }

    if (!normalized.length) return;

    // Collect & dedupe entities
    const allArtists = normalized.flatMap((t) => t.artists ?? []);
    const allAlbums = normalized.flatMap((t) => (t.album ? [t.album] : []));
    const albumArtists = allAlbums.flatMap((a) => a.artists ?? []);

    const uniqueArtists = dedupeBy([...allArtists, ...albumArtists], (a) => a!.spotifyId).filter(Boolean);
    const uniqueAlbums = dedupeBy(allAlbums, (a) => a.spotifyId).filter(Boolean);
    const uniqueTracks = dedupeBy(normalized, (t) => t.spotifyId).filter(Boolean);

    // -----------------------------------
    // 1. Query existing DB records
    // -----------------------------------
    const [existingArtists, existingAlbums, existingTracks] = await Promise.all([
        db.artist.findMany({ where: { spotifyId: { in: uniqueArtists.map((a) => a!.spotifyId) } }, select: { spotifyId: true } }),
        db.album.findMany({ where: { spotifyId: { in: uniqueAlbums.map((a) => a.spotifyId) } }, select: { spotifyId: true } }),
        db.track.findMany({ where: { spotifyId: { in: uniqueTracks.map((t) => t.spotifyId) } }, select: { spotifyId: true } }),
    ]);

    const existingArtistIds = new Set(existingArtists.map((a) => a.spotifyId));
    const existingAlbumIds = new Set(existingAlbums.map((a) => a.spotifyId));
    const existingTrackIds = new Set(existingTracks.map((t) => t.spotifyId));

    // -----------------------------------
    // 2. Insert new records (skip existing)
    // -----------------------------------
    if (uniqueArtists.length) {
        const newArtists = uniqueArtists
            .filter((a) => !existingArtistIds.has(a!.spotifyId))
            .map((a) => ({
                spotifyId: a!.spotifyId,
                name: a!.name,
                popularity: a!.popularity,
                image: a!.image ? { create: a!.image } : undefined,
            }));

        if (newArtists.length) {
            await db.artist.createMany({
                data: newArtists.map(({ image, ...rest }) => rest), // can't create nested with createMany
                skipDuplicates: true,
            });
            // TODO: images need to be handled separately since createMany doesn’t support nested
        }
    }

    if (uniqueAlbums.length) {
        const newAlbums = uniqueAlbums
            .filter((a) => !existingAlbumIds.has(a.spotifyId))
            .map((a) => ({
                spotifyId: a.spotifyId,
                title: a.title,
                releaseDate: a.releaseDate,
                totalTracks: a.totalTracks,
                popularity: a.popularity,
                image: a.image ? { create: a.image } : undefined,
            }));

        if (newAlbums.length) {
            await db.album.createMany({
                data: newAlbums.map(({ image, ...rest }) => rest),
                skipDuplicates: true,
            });
            // TODO: images handled separately
        }
    }

    if (uniqueTracks.length) {
        const newTracks = uniqueTracks
            .filter((t) => !existingTrackIds.has(t.spotifyId))
            .map((t) => ({
                spotifyId: t.spotifyId,
                title: t.title,
                durationMs: t.durationMs,
                explicit: t.explicit,
                discNumber: t.discNumber,
                trackNumber: t.trackNumber,
            }));

        if (newTracks.length) {
            await db.track.createMany({
                data: newTracks,
                skipDuplicates: true,
            });
        }
    }

    // -----------------------------------
    // 3. Relations (artists ↔ albums, artists ↔ tracks, album ↔ tracks)
    //    These require connect since createMany doesn’t support nested.
    // -----------------------------------
    await Promise.all([
        ...uniqueAlbums.map((album) =>
            db.album.update({
                where: { spotifyId: album.spotifyId },
                data: {
                    artists: {
                        connect: album.artists?.map((a) => ({ spotifyId: a!.spotifyId })),
                    },
                    image: album.image ? { upsert: { create: album.image, update: album.image } } : undefined,
                },
            })
        ),
        ...uniqueTracks.map((track) =>
            db.track.update({
                where: { spotifyId: track.spotifyId },
                data: {
                    artists: {
                        connect: track.artists?.map((a) => ({ spotifyId: a!.spotifyId })),
                    },
                    album: track.album ? { connect: { spotifyId: track.album.spotifyId } } : undefined,
                },
            })
        ),
    ]);
};
