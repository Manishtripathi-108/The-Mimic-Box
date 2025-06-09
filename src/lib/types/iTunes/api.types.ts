export type T_ITunesPayload<T> = {
    resultCount: number;
    results: T[];
};

export type T_ITunesWrapperType = 'track' | 'collection' | 'artist';

export type T_ITunesKind =
    | 'song'
    | 'album'
    | 'all'
    | 'artist'
    | 'book'
    | 'coached-audio'
    | 'feature-movie'
    | 'interactive-booklet'
    | 'music-video'
    | 'pdf'
    | 'podcast'
    | 'podcast-episode'
    | 'software-package'
    | 'tv-episode';

export type T_ITunesTrackResponse = {
    wrapperType: 'track';
    kind: 'song';

    trackId: number;
    trackName: string;
    trackCensoredName: string;

    artistId: number;
    artistName: string;
    artistViewUrl: string;

    collectionId?: number;
    collectionName?: string;
    collectionCensoredName?: string;
    collectionArtistId?: number;
    collectionArtistName?: string;
    collectionArtistViewUrl?: string;

    artworkUrl30?: string;
    artworkUrl60?: string;
    artworkUrl100?: string;

    previewUrl?: string;
    trackViewUrl: string;
    collectionViewUrl?: string;

    collectionPrice?: number;
    trackPrice?: number;

    releaseDate: Date;

    collectionExplicitness: string;
    trackExplicitness: string;

    discCount?: number;
    discNumber?: number;
    trackCount?: number;
    trackNumber?: number;
    trackTimeMillis?: number;

    country: string;
    currency: string;
    primaryGenreName: string;

    isStreamable?: boolean;
};

export type T_ITunesAlbumCollectionResponse = {
    wrapperType: 'collection';
    collectionType: 'Album';

    artistId: number;
    collectionId: number;
    amgArtistId: number;

    artistName: string;
    collectionName: string;
    collectionCensoredName: string;

    artistViewUrl: string;
    collectionViewUrl: string;

    artworkUrl30?: string;
    artworkUrl60?: string;
    artworkUrl100?: string;

    copyright: string;

    collectionPrice?: number;

    collectionExplicitness: string;
    trackCount: number;
    country: string;
    currency: string;
    releaseDate: Date;
    primaryGenreName: string;
};

export type T_ITunesAlbumSongsCOllectionResponse = T_ITunesAlbumCollectionResponse | T_ITunesTrackResponse;
