import axios from 'axios';
import stringSimilarity from 'string-similarity';

import API_ROUTES from '@/constants/routes/api.routes';
import { T_AudioFile, T_AudioPlayerTrack, T_AudioSourceContext } from '@/lib/types/client.types';
import { T_ITunesTrack } from '@/lib/types/iTunes/normalized.types';
import { SuccessResponseOutput } from '@/lib/types/response.types';

export const buildAudioCacheKey = (context: T_AudioSourceContext) => `${context.source}:${context.type}:${context.id}`;

export const buildAudioFileFromTrack = (track: T_AudioPlayerTrack, quality: string): T_AudioFile | null => {
    const url = track.urls.find((u) => u.quality === quality);
    if (!url) return null;

    return {
        src: url.url,
        filename: track.title,
        cover: track.covers?.find((c) => c.quality === '500x500')?.url,
        metadata: {
            title: track.title,
            artist: track.artists,
            album: track.album || ' ',
            date: track.year || ' ',
            language: track.language || ' ',
            duration: track.duration || ' ',
        },
    };
};

export const getLyrics = async (musicTrack: { track: string; artist: string; album: string; duration: string | number }) => {
    try {
        const res = await axios.get<SuccessResponseOutput<string>>(API_ROUTES.LYRICS.GET, {
            params: {
                ...musicTrack,
                lyricsOnly: 'true',
            },
        });
        return res.data.success ? String(res.data.payload) : null;
    } catch {
        return null;
    }
};

export const searchMetadata = async (metadata: Record<string, string | number>): Promise<Record<string, string | number>> => {
    try {
        const res = await axios.get<SuccessResponseOutput<T_ITunesTrack[]>>(API_ROUTES.ITUNES.SEARCH.TRACKS, {
            params: {
                track: metadata.title,
                artist: metadata.artist,
                album: metadata.album,
            },
        });

        if (!res.data.success) throw new Error('Failed to fetch metadata');

        let bestMatch: T_ITunesTrack | null = null;
        let bestScore = 0;

        for (const track of res.data.payload) {
            const titleScore = stringSimilarity.compareTwoStrings(track.title.toLowerCase(), metadata.title.toString().toLowerCase());
            const artistScore = stringSimilarity.compareTwoStrings(track.artist.toLowerCase(), metadata.artist.toString().toLowerCase());
            const albumScore = stringSimilarity.compareTwoStrings((track.album ?? '').toLowerCase(), metadata.album.toString().toLowerCase());

            if (titleScore < 0.7) continue;
            const score = titleScore * 0.5 + artistScore * 0.3 + albumScore * 0.2;

            if (score > bestScore) {
                bestScore = score;
                bestMatch = track;
            }
        }

        return bestMatch
            ? {
                  ...metadata,
                  genre: bestMatch.genre,
                  track: bestMatch.track,
                  album_artist: bestMatch.albumArtistName || metadata.artist,
                  disc: bestMatch.disc,
              }
            : metadata;
    } catch {
        return metadata;
    }
};
