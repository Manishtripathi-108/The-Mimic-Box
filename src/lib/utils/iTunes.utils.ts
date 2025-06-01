import { T_ITunesMusicTrack, T_ITunesMusicTrackApiRes } from '@/lib/types/iTunes/track.types';

export const createITunesTrack = (track: T_ITunesMusicTrackApiRes[]): T_ITunesMusicTrack[] => {
    return track?.map((track) => ({
        id: track.trackId?.toString(),
        title: track.trackName,
        artistId: track.artistId?.toString(),
        artist: track.artistName,
        albumId: track.collectionId?.toString(),
        album: track.collectionName || 'unknown',
        releaseDate: new Date(track.releaseDate).toISOString().split('T')[0],
        year: new Date(track.releaseDate).getFullYear(),
        genre: track.primaryGenreName,
        track: track.trackNumber || 1,
        disc: track.discNumber || 1,
        duration_ms: track.trackTimeMillis || 0,
        artwork: track.artworkUrl100,
    }));
};
