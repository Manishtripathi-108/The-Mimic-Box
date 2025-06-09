export type T_ITunesTrack = {
    id: string;
    title: string;
    artist: string;
    artistId: string;

    albumId?: string;
    album?: string;
    albumArtistId?: string;
    albumArtistName?: string;

    releaseDate: string;
    year: number;
    genre: string;

    track: number;
    disc: number;

    duration_ms: number;
    artwork?: string;
};

export type T_ITunesAlbum = {
    id: string;
    title: string;
    artist: string;
    artistId: string;

    copyright?: string;
    releaseDate: string;
    year: number;
    genre: string;

    trackCount: number;

    artwork?: string;
};

export type ITunesMusicAlbumTracks = T_ITunesAlbum & {
    songs: T_ITunesTrack[];
};
