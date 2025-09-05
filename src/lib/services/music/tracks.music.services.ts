import { db } from '@/lib/db';
import { DiscoUnion } from '@/lib/types/helper.type';
import { T_SpotifySimplifiedTrack, T_SpotifyTrack } from '@/lib/types/spotify.types';
import { normalizeSpotifyTrackFull, normalizeSpotifyTrackLight } from '@/lib/utils/server-only/music/music.spotify.utils';

// ---------------- Types ----------------
type T_AddTrack = {
    spotify: {
        tracks: (T_SpotifySimplifiedTrack | T_SpotifyTrack)[];
    };
    saavan: {
        tracks: T_SpotifySimplifiedTrack[]; // TODO: adjust when Saavan schema ready
    };
};

type T_AddTrackUnion = DiscoUnion<T_AddTrack>;

type T_NormalizedTrack = NonNullable<ReturnType<typeof normalizeSpotifyTrackLight>> | NonNullable<ReturnType<typeof normalizeSpotifyTrackFull>>;

// ---------------- Main ----------------
export const syncProviderTracks = async ({ type, tracks }: T_AddTrackUnion) => {
    let normalized: T_NormalizedTrack[] = [];

    if (type === 'spotify') {
        normalized = tracks.map((t) => ('album' in t ? normalizeSpotifyTrackFull(t) : normalizeSpotifyTrackLight(t)));
    } else if (type === 'saavan') {
        // TODO: implement when Saavan API ready
        return;
    }

    if (!normalized.length) return;

    const res = await db.$transaction(
        normalized.map((track) =>
            db.track.upsert({
                where: { spotifyId: track.spotifyId },
                update: track._update,
                create: track._create,
            })
        )
    );

    return res;
};
