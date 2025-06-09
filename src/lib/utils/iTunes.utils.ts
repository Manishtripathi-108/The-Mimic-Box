import { T_ITunesAlbumCollectionResponse, T_ITunesTrackResponse } from '@/lib/types/iTunes/api.types';
import { T_ITunesAlbum, T_ITunesTrack } from '@/lib/types/iTunes/normalized.types';

export const createITunesTrack = (track: T_ITunesTrackResponse): T_ITunesTrack => ({
    id: track.trackId?.toString(),
    title: track.trackName,

    artist: track.artistName,
    artistId: track.artistId?.toString(),

    album: track.collectionName,
    albumId: track.collectionId?.toString(),
    albumArtistName: track.collectionArtistName,
    albumArtistId: track.collectionArtistId?.toString(),

    releaseDate: new Date(track.releaseDate).toISOString().split('T')[0],
    year: new Date(track.releaseDate).getFullYear(),
    genre: track.primaryGenreName,
    track: track.trackNumber || 1,
    disc: track.discNumber || 1,
    duration_ms: track.trackTimeMillis || 0,
    artwork: track.artworkUrl100,
});

export const createItunesAlbum = (album: T_ITunesAlbumCollectionResponse): T_ITunesAlbum => ({
    id: album.collectionId?.toString(),
    title: album.collectionName,
    artist: album.artistName,
    artistId: album.artistId?.toString(),
    copyright: album.copyright,
    releaseDate: new Date(album.releaseDate).toISOString().split('T')[0],
    year: new Date(album.releaseDate).getFullYear(),
    genre: album.primaryGenreName,
    trackCount: album.trackCount,
    artwork: album.artworkUrl100,
});
