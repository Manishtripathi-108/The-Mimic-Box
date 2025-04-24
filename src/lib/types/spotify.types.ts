export type T_SpotifyErrorResponse = {
    error: {
        status: 400;
        message: 'string';
    };
};

export type T_SpotifyExternalUrl = {
    spotify: string;
};

export type T_SpotifyImage = {
    url: string;
    height: number | null;
    width: number | null;
};

export type T_SpotifyType = 'user' | 'episode' | 'playlist' | 'show' | 'track' | 'album' | 'artist' | 'audiobook';

export type T_SpotifySearchType = 'album' | 'artist' | 'track' | 'show' | 'episode' | 'playlist' | 'audiobook';

export type T_SpotifyExternalID = {
    ean: string;
    isrc: string;
    upc: string;
};

/**
 * The paging object is a form of collection of items from the spotify api.
 */
export type T_SpotifyPaging<T> = {
    /** A link to the Web API endpoint returning the full result of the request. */
    href: string;
    /** The requested data. */
    items: T[];
    /** The maximum number of items in the response (as set in the query or by default). */
    limit: number;
    /** URL to the next page of items. (null if none) */
    next: string | null;
    /** The offset of the items returned (as set in the query or by default) */
    offset: number;
    /** URL to the previous page of items. (null if none) */
    previous: string | null;
    /** The total number of items available to return. */
    total: number;
};

/**
 * The cursor object having before and after keys of the items.
 */
export type T_SpotifyCursor = {
    /** The cursor to use as key to find the next page of items. */
    after: string;
    /** The cursor to use as key to find the previous page of items. */
    before: string;
};

/**
 * The paging object but with a additional cursor field.
 */
export type T_SpotifyCursorPaging<T> = Omit<T_SpotifyPaging<T>, 'offset' | 'previous'> & {
    /** The cursors used to find the next set of items. */
    cursors: T_SpotifyCursor;
};

export type T_SpotifyCopyright = {
    text: string;
    type: 'C' | 'P';
};

export type T_SpotifyRestriction = {
    reason: 'market' | 'product' | 'explicit';
};

/**
 * The object containing the saved elements and the timestamp when they were added.
 */
export type T_SpotifySaved<K extends T_SpotifyType, T> = { added_at: string } & Record<K, T>;

/**
 * The object structure returned by the [/search] endpoint.
 */
export type T_SpotifySearchContent = {
    /** The episode search results. */
    episodes?: T_SpotifyPaging<T_SpotifySimplifiedEpisode>;
    /** The show search results. */
    shows?: T_SpotifyPaging<T_SpotifySimplifiedShow>;
    /** The track search results. */
    tracks?: T_SpotifyPaging<T_SpotifyTrack>;
    /** The artists search results. */
    artists?: T_SpotifyPaging<T_SpotifyArtist>;
    /** The album search results. */
    albums?: T_SpotifyPaging<T_SpotifySimplifiedAlbum>;
    /** The playlist search results. */
    playlists?: T_SpotifyPaging<T_SpotifySimplifiedPlaylist>;
    /** The audiobook search results. */
    audiobooks?: T_SpotifyPaging<T_SpotifySimplifiedAudiobook>;
};

/* -------------------------------------------------------------------------- */
/*                                   Albums                                   */
/* -------------------------------------------------------------------------- */

/**
 * The types of album.
 */
export type T_SpotifyAlbumType = 'single' | 'album' | 'compilation';

/**
 * The groups of album.
 */
export type T_SpotifyAlbumGroup = T_SpotifyAlbumType | 'appears_on';

/**
 * The saved album object.
 */
export type T_SpotifySavedAlbum = T_SpotifySaved<'album', T_SpotifyAlbum>;

export type T_SpotifyAlbum = Omit<T_SpotifySimplifiedAlbum, 'album_group'> & {
    copyrights: T_SpotifyCopyright[];
    external_ids: T_SpotifyExternalID;
    label: string;
    popularity: number;
    tracks: T_SpotifyPaging<T_SpotifySimplifiedTrack>;
};

/**
 * The spotify object containing the simplified details of the Spotify Album.
 */
export type T_SpotifySimplifiedAlbum = {
    /** The field is present when getting an artist’s albums. */
    album_group: T_SpotifyAlbumGroup;
    album_type: T_SpotifyAlbumType;
    artists: T_SpotifySimplifiedArtist[];
    available_markets: string[];
    external_urls: T_SpotifyExternalUrl;
    href: string;
    id: string;
    images: T_SpotifyImage[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: T_SpotifyRestriction[];
    total_tracks: number;
    type: 'album';
    uri: string;
};

/* -------------------------------------------------------------------------- */
/*                                   Artist                                   */
/* -------------------------------------------------------------------------- */

/**
 * The structure containing the simplified details of the Spotify Artist.
 */
export type T_SpotifySimplifiedArtist = {
    external_urls: T_SpotifyExternalUrl;
    href: string;
    id: string;
    name: string;
    /** The object type: "artist". */
    type: 'artist';
    uri: string;
};

/**
 * The structure containing the entire details of the Spotify Artist.
 */
export type T_SpotifyArtist = T_SpotifySimplifiedArtist & {
    followers: T_SpotifyFollowers;
    genres: string[];
    images: T_SpotifyImage[];
    /** The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist’s popularity is calculated from the popularity of all the artist’s tracks. */
    popularity: number;
};

/* -------------------------------------------------------------------------- */
/*                                  Audiobook                                 */
/* -------------------------------------------------------------------------- */

/**
 * The structure containing the complete details of the Spotify Audiobook.
 */
export type T_SpotifyAudiobook = T_SpotifySimplifiedAudiobook & { chapters: T_SpotifyPaging<T_SpotifySimplifiedChapter> };

/**
 * The structure containing the complete details of the Spotify Chapter.
 */
export type T_SpotifyChapter = T_SpotifySimplifiedChapter & { audiobook: T_SpotifySimplifiedAudiobook };

/**
 * The structure containing the simplified details of the Spotify Audiobook.
 */
export type T_SpotifySimplifiedAudiobook = {
    authors: T_SpotifyUsername[];
    available_markets: string[];
    copyrights: T_SpotifyCopyright[];
    description: string;
    html_description: string;
    edition: string;
    explicit: boolean;
    external_urls: T_SpotifyExternalUrl;
    href: string;
    id: string;
    images: T_SpotifyImage[];
    languages: string[];
    media_type: string;
    name: string;
    narrators: T_SpotifyUsername[];
    publisher: string;
    /** The type of the audiobook. */
    type: 'audiobook';
    uri: string;
    total_chapters: number;
};

/**
 * The structure containing the simplified details of Spotify Chapter.
 */
export type T_SpotifySimplifiedChapter = {
    available_markets: string[];
    chapter_number: number;
    description: string;
    html_description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: T_SpotifyExternalUrl;
    href: string;
    id: string;
    images: T_SpotifyImage[];
    is_playable: boolean;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: T_SpotifyRestriction;
    /** The user’s most recent position in the chapter. Set if the supplied access token is a user token and has the scope ‘user-read-playback-position’. */
    resume_point?: T_SpotifyResumePoint;
    type: 'episode';
    uri: string;
};

/**
 * The structure containing the name of a particular user.
 */
export type T_SpotifyUsername = { name: string };

/* -------------------------------------------------------------------------- */
/*                                   Browse                                   */
/* -------------------------------------------------------------------------- */

/**
 * An object containing details about the spotify category.
 */
export type T_SpotifyCategory = {
    href: string;
    icons: T_SpotifyImage[];
    id: string;
    name: string;
};

/**
 * The spotify recommendation seed object.
 */
export type T_SpotifyRecommendationSeed = {
    /** The number of tracks available after min_* and max_* filters have been applied. */
    afterFilteringSize: number;
    /** The number of tracks available after relinking for regional availability. */
    afterRelinkingSize: number;
    /** A link to the full track or artist data for this seed. */
    href: string;
    /** The id used to select this seed. This will be the same as the string used in the seed_artists, seed_tracks or seed_genres parameter. */
    id: string;
    /** The number of recommended tracks available for this seed. */
    initialPoolSize: number;
    /** The entity type of this seed. */
    type: 'artist' | 'track' | 'genre';
};

/**
 * The collection of recommendation seed objects with tracks provided from the spotify api..
 */
export type T_SpotifyRecommendations = {
    seeds: T_SpotifyRecommendationSeed[];
    tracks: T_SpotifySimplifiedTrack[];
};

/**
 * Just an extension for [RecommendationQuery].
 */
export type T_SpotifyRecommendationQueryExtension<T extends string> = Partial<Record<`min_${T}` | `max_${T}` | `target_${T}`, number>>;

/**
 * The query parameter structure of the [/recommendations] endpoint.
 */
export type T_SpotifyRecommendationQuery = T_SpotifyRecommendationQueryExtension<keyof T_SpotifyTuneableTrack> & {
    /** The target size of the list of recommended tracks. */
    limit?: number;
    /** An ISO 3166-1 alpha-2 country code or the string from_token. */
    market?: string;
    /** A comma separated list of Spotify IDs for seed artists. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres **/
    seed_artists: string;
    /** A comma separated list of any genres in the set of available genre seeds. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres. */
    seed_genres: string;
    /** A comma separated list of Spotify IDs for a seed track. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres. */
    seed_tracks: string;
};

/* -------------------------------------------------------------------------- */
/*                                  Episodes                                  */
/* -------------------------------------------------------------------------- */

/**
 * The saved episode object.
 */
export type T_SpotifySavedEpisode = T_SpotifySaved<'episode', T_SpotifyEpisode>;

/**
 * The structure containing the complete details of the Spotify episode.
 */
export type T_SpotifyEpisode = T_SpotifySimplifiedEpisode & { show: T_SpotifySimplifiedShow };

/**
 * The structure containing the simplified details of the Spotify episode.
 */
export type T_SpotifySimplifiedEpisode = {
    description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: T_SpotifyExternalUrl;
    href: string;
    html_description: string;
    id: string;
    images: T_SpotifyImage[];
    is_playable: boolean;
    language?: string;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: T_SpotifyRestriction[];
    resume_point?: T_SpotifyResumePoint;
    /** The object type: “episode”. */
    type: 'episode';
    uri: string;
};

/**
 * An object containing the resume point.
 */
export type T_SpotifyResumePoint = {
    fully_played: boolean;
    resume_position_ms: number;
};

/* -------------------------------------------------------------------------- */
/*                                   Player                                   */
/* -------------------------------------------------------------------------- */

/**
 * The repeat state of the context.
 */
export type T_SpotifyRepeatState = 'track' | 'off' | 'context';

/**
 * Player error reason types.
 */
export type T_SpotifyPlayerErrorReason =
    | 'NO_PREV_TRACK'
    | 'NO_NEXT_TRACK'
    | 'NO_SPECIFIC_TRACK'
    | 'ALREADY_PAUSED'
    | 'NOT_PAUSED'
    | 'NOT_PLAYING_TRACK'
    | 'NOT_PLAYING_LOCALLY'
    | 'NOT_PLAYING_CONTEXT'
    | 'ENDLESS_CONTEXT'
    | 'CONTEXT_DISALLOW'
    | 'ALREADY_PLAYING'
    | 'RATE_LIMITED'
    | 'REMOTE_CONTROL_DISALLOW'
    | 'DEVICE_NOT_CONTROLLABLE'
    | 'VOLUME_CONTROL_DISALLOW'
    | 'NO_ACTIVE_DEVICE'
    | 'PREMIUM_REQUIRED'
    | 'UNKNOWN';

/**
 * An object containing the details of a device.
 */
export type T_SpotifyDevice = {
    id: string | null;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: 'computer' | 'smartphone' | 'speaker';
    volume_percent?: number;
};

/**
 * The context object of the player.
 */
export type T_SpotifyPlayerContext = {
    external_urls: T_SpotifyExternalUrl;
    href: string;
    type: T_SpotifyType;
    uri: string;
};

/**
 * The disallows from the CurrentlyPlayingContext object.
 */
export type T_SpotifyContextDisallows = {
    interrupting_playback: boolean;
    pausing?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
    toggling_repeat_context?: boolean;
    toggling_repeat_track?: boolean;
    toggling_shuffle?: boolean;
    transferring_playback?: boolean;
};

/**
 * The currently playing context of the player api.
 */
export type T_SpotifyCurrentlyPlayingContext = T_SpotifyCurrentlyPlaying & {
    /** Allows to update the user interface based on which playback actions are available within the current context. */
    actions: T_SpotifyContextDisallows;
    device: T_SpotifyDevice;
    repeat_state: T_SpotifyRepeatState;
    shuffle_state: 'on' | 'off';
};

/**
 * The currently playing object of the player api.
 */
export type T_SpotifyCurrentlyPlaying = {
    context: T_SpotifyPlayerContext | null;
    currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
    is_playing: boolean;
    progress_ms: number | null;
    item: T_SpotifyTrack | T_SpotifyEpisode | null;
    /** Unix Millisecond Timestamp when data was fetched. */
    timestamp: number;
};

/**
 * The devices object of the player api.
 */
export type T_SpotifyDevices = { devices: T_SpotifyDevice[] };

/**
 * The recently played object which is returned by the [Player.getRecentlyPlayed] function.
 */
export type T_SpotifyRecentlyPlayed = {
    cursors: T_SpotifyCursor;
    href: string;
    limit: number;
    next?: string;
    total: number;
    items: {
        track: T_SpotifyTrack;
        playedAt: string;
    }[];
};

/**
 * The play history object of the player api.
 */
export type T_SpotifyPlayHistory = {
    context: T_SpotifyPlayerContext;
    played_at: string;
    track: T_SpotifySimplifiedTrack;
};

/**
 * The error response sent by the spotify player api during unusual status codes.
 */
export type T_SpotifyPlayerErrorResponse = T_SpotifyErrorResponse & {
    reason: T_SpotifyPlayerErrorReason;
};

/* -------------------------------------------------------------------------- */
/*                                  Playlist                                  */
/* -------------------------------------------------------------------------- */

/**
 * The structure containing the reference for the tracks of the playlist..
 */
export type T_SpotifyPlaylistTracksReference = { href: string; total: number };

/**
 * The structure containing the details of the Spotify Track in the playlist..
 */
export type T_SpotifyPlaylistTrack = {
    added_at: string | null;
    added_by: T_SpotifyPublicUser | null;
    is_local: boolean;
    track: T_SpotifyTrack | T_SpotifyEpisode | null;
};

/**
 * The structure containing the simplified details of the Spotify Playlist.
 */
export type T_SpotifySimplifiedPlaylist = {
    collaborative: boolean;
    description: string | null;
    external_urls: T_SpotifyExternalUrl;
    href: string;
    id: string;
    primary_color: string | null;
    images: T_SpotifyImage[];
    name: string;
    owner: T_SpotifyPublicUser;
    snapshot_id: string;
    tracks: T_SpotifyPlaylistTracksReference;
    uri: string;
    type: 'playlist';
};

/**
 * The structure containing the complete details of the Spotify Playlist.
 */
export type T_SpotifyPlaylist = Omit<T_SpotifySimplifiedPlaylist, 'tracks'> & {
    followers: T_SpotifyFollowers;
    public: boolean | null;
    tracks: T_SpotifyPlaylistTrack[];
};

/**
 * The structure returned by the [/browse/featured-playlists] endpoint.
 */
export type T_SpotifyFeaturedPlaylists = {
    message: string;
    playlists: T_SpotifyPaging<T_SpotifyPlaylist>;
};

/**
 * The query structure required by the [/users/{id}/playlists] endpoint.
 */
export type T_SpotifyCreatePlaylistQuery = {
    name: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
};

/* -------------------------------------------------------------------------- */
/*                                    Show                                    */
/* -------------------------------------------------------------------------- */

/**
 * The saved show object.
 */
export type T_SpotifySavedShow = T_SpotifySaved<'show', T_SpotifyShow>;

/**
 * The structure containing the complete details of the Spotify Show.
 */
export type T_SpotifyShow = T_SpotifySimplifiedShow & {
    episodes: T_SpotifySimplifiedEpisode[] | T_SpotifyPaging<T_SpotifySimplifiedEpisode>;
};

/**
 * The structure containing the simplified details of the Spotify Show.
 */
export type T_SpotifySimplifiedShow = {
    available_markets: string[];
    copyrights: T_SpotifyCopyright[];
    description: string;
    explicit: boolean;
    external_urls: T_SpotifyExternalUrl;
    href: string;
    html_description: string;
    id: string;
    images: T_SpotifyImage[];
    is_externally_hosted: boolean;
    languages: string[];
    media_type: string;
    name: string;
    publisher: string;
    type: 'show';
    uri: string;
};

/* -------------------------------------------------------------------------- */
/*                                    Track                                   */
/* -------------------------------------------------------------------------- */

/**
 * The saved track object.
 */
export type SavedTrack = T_SpotifySaved<'track', T_SpotifyTrack>;

/**
 * The structure containing the simplified details of the Spotify Track.
 */
export type T_SpotifySimplifiedTrack = {
    artists: T_SpotifySimplifiedArtist[];
    available_markets?: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: T_SpotifyExternalUrl;
    href: string;
    id: string;
    is_local: boolean;
    is_playable?: boolean;
    /** Part of the response when Track Relinking is applied and is only part of the response if the track linking, in fact, exists. */
    linked_from?: T_SpotifyLinkedTrack;
    name: string;
    restrictions?: T_SpotifyRestriction[];
    track_number: number;
    type: 'track';
    uri: string;
};

/**
 * The structure containing the complete details of the Spotify Track.
 */
export type T_SpotifyTrack = T_SpotifySimplifiedTrack & {
    album: T_SpotifySimplifiedAlbum;
    artists: T_SpotifyArtist[];
    external_ids: T_SpotifyExternalID;
    popularity: number;
};

/**
 * The structure of the spotify linked track object.
 */
export type T_SpotifyLinkedTrack = {
    external_urls: T_SpotifyExternalUrl;
    href: string;
    id: string;
    type: T_SpotifyType;
    uri: string;
};

/**
 * An object containing all the features of the audio.
 */
export type T_SpotifyAudioFeatures = Omit<T_SpotifyTuneableTrack, 'popularity'> & {
    /** An HTTP URL to access the full audio analysis of this track. An access token is required to access this data. */
    analysis_url: string;
    id: string;
    track_href: string;
    type: string;
    uri: string;
};

/**
 * The tuneable track object.
 */
export type T_SpotifyTuneableTrack = {
    /** A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic. */
    acousticness: number;
    /** Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable. */
    danceability: number;
    /** The duration of the track in milliseconds. */
    duration_ms: number;
    /** Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. */
    energy: number;
    /** Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”. */
    instrumentalness: number;
    /** The key the track is in. Integers map to pitches using standard Pitch Class notation. */
    key: number;
    /** Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. */
    liveness: number;
    /** The overall loudness of a track in decibels (dB). */
    loudness: number;
    /** Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0. */
    mode: number;
    /** The popularity of the track. The value will be between 0 and 100, with 100 being the most popular. */
    popularity: number;
    /** Speechiness detects the presence of spoken words in a track. */
    speechiness: number;
    /** The overall estimated tempo of a track in beats per minute (BPM). */
    tempo: number;
    /** An estimated overall time signature of a track. */
    time_signature: number;
    /** A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. */
    valence: number;
};

/**
 * Time interval object of [TrackAudioAnalysis].
 * No documentation found for the object.
 */
export type T_SpotifyTimeInterval = {
    start: number;
    duration: number;
    confidence: number;
};

/**
 * The element structure of the array of [AudioAnalysis.sections] property.
 * No documentation found for the object.
 */
export type T_SpotifyAudioSection = T_SpotifyTimeInterval & {
    /** The overall loudness of the section in decibels (dB). Loudness values are useful for comparing relative loudness of sections within tracks. */
    loudness: number;
    /** The overall estimated tempo of the section in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration. */
    tempo: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the tempo. Some tracks contain tempo changes or sounds which don't contain tempo (like pure speech) which would correspond to a low value in this field. */
    tempo_confidence: number;
    /** The estimated overall key of the section. The values in this field ranging from 0 to 11 mapping to pitches using standard Pitch Class notation (E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on). If no key was detected, the value is -1. */
    key: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the key. Songs with many key changes may correspond to low values in this field. */
    key_confidence: number;
    /** Indicates the modality (major or minor) of a section, the type of scale from which its melodic content is derived. This field will contain a 0 for "minor", a 1 for "major", or a -1 for no result. Note that the major key (e.g. C major) could more likely be confused with the minor key at 3 semitones lower (e.g. A minor) as both keys carry the same pitches. */
    mode: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the mode. */
    mode_confidence: number;
    /** An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4". */
    time_signature: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the time_signature. Sections with time signature changes may correspond to low values in this field. */
    time_signature_confidence: number;
};

/**
 * The element structure of the array of [AudioAnalysis.segments] property.
 * No documentation found for the object.
 */
export type T_SpotifyAudioSegment = T_SpotifyTimeInterval & {
    /** The onset loudness of the segment in decibels (dB). Combined with loudness_max and loudness_max_time, these components can be used to describe the "attack" of the segment. */
    loudness_start: number;
    /** The peak loudness of the segment in decibels (dB). Combined with loudness_start and loudness_max_time, these components can be used to describe the "attack" of the segment. */
    loudness_max: number;
    /** The segment-relative offset of the segment peak loudness in seconds. Combined with loudness_start and loudness_max, these components can be used to describe the "attack" of the segment. */
    loudness_max_time: number;
    /** The offset loudness of the segment in decibels (dB). This value should be equivalent to the loudness_start of the following segment. */
    loudness_end: number;
    /** Pitch content is given by a “chroma” vector, corresponding to the 12 pitch classes C, C#, D to B, with values ranging from 0 to 1 that describe the relative dominance of every pitch in the chromatic scale. For example a C Major chord would likely be represented by large values of C, E and G (i.e. classes 0, 4, and 7). */
    pitches: number[];
    /** Timbre is the quality of a musical note or sound that distinguishes different types of musical instruments, or voices. It is a complex notion also referred to as sound color, texture, or tone quality, and is derived from the shape of a segment’s spectro-temporal surface, independently of pitch and loudness. */
    timbre: number[];
};

/**
 * The object structure of [AudioAnalysis.track] property.
 * No documentation found for the object.
 */
export type T_SpotifyAudioTrack = {
    /** The exact number of audio samples analyzed from this track. See also analysis_sample_rate. */
    num_samples: number;
    /** Length of the track in seconds. */
    duration: number;
    /** This field will always contain the empty string. */
    sample_md5: string;
    /** An offset to the start of the region of the track that was analyzed. (As the entire track is analyzed, this should always be 0.) */
    offset_seconds: number;
    /** The length of the region of the track was analyzed, if a subset of the track was analyzed. (As the entire track is analyzed, this should always be 0.) */
    window_seconds: number;
    /** The sample rate used to decode and analyze this track. May differ from the actual sample rate of this track available on Spotify. */
    analysis_sample_rate: number;
    /** The number of channels used for analysis. If 1, all channels are summed together to mono before analysis. */
    analysis_channels: number;
    /** The time, in seconds, at which the track's fade-in period ends. If the track has no fade-in, this will be 0.0. */
    end_of_fade_in: number;
    /** The time, in seconds, at which the track's fade-out period starts. If the track has no fade-out, this should match the track's length. */
    start_of_fade_out: number;
    /** The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db. */
    loudness: number;
    /** The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.  */
    tempo: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the tempo. */
    tempo_confidence: number;
    /** An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4". */
    time_signature: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the time_signature. */
    time_signature_confidence: number;
    /** The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the value is -1. */
    key: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the key. */
    key_confidence: number;
    /** Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0. */
    mode: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the mode. */
    mode_confidence: number;
    /** An Echo Nest Musical Fingerprint (ENMFP) codestring for this track. */
    codestring: string;
    /** A version number for the Echo Nest Musical Fingerprint format used in the codestring field. */
    code_version: number;
    /** An EchoPrint codestring for this track. */
    echoprintstring: string;
    /** A version number for the EchoPrint format used in the echoprintstring field. */
    echoprint_version: number;
    /** A Synchstring for this track. */
    synchstring: string;
    /** A version number for the Synchstring used in the synchstring field. */
    synch_version: number;
    /** A Rhythmstring for this track. The format of this string is similar to the Synchstring. */
    rhythmstring: string;
    /** A version number for the Rhythmstring used in the rhythmstring field. */
    rhythm_version: number;
};

/**
 * The object structure of [AudioAnalysis.meta] property.
 * No documentation found for the object.
 */
export type T_SpotifyAudioAnalysisMeta = {
    /** The version of the Analyzer used to analyze this track. */
    analyzer_version: string;
    /** The platform used to read the track's audio data. */
    platform: string;
    /** A detailed status code for this track. If analysis data is missing, this code may explain why. */
    detailed_status: string;
    /** The return code of the analyzer process. 0 if successful, 1 if any errors occurred. */
    status_code: number;
    /** The Unix timestamp (in seconds) at which this track was analyzed. */
    timestamp: number;
    /** The amount of time taken to analyze this track. */
    analysis_time: number;
    /** The method used to read the track's audio data. */
    input_process: string;
};

/**
 * The object structure returned by [/audio-analysis/{id}] endpoint.
 * No documentation found for the object.
 */
export type T_SpotifyAudioAnalysis = {
    /** The time intervals of the bars throughout the track. A bar (or measure) is a segment of time defined as a given number of beats. */
    bars: T_SpotifyTimeInterval[];
    /** The time intervals of beats throughout the track. A beat is the basic time unit of a piece of music; for example, each tick of a metronome. Beats are typically multiples of tatums. */
    beats: T_SpotifyTimeInterval[];
    /** A tatum represents the lowest regular pulse train that a listener intuitively infers from the timing of perceived musical events (segments). */
    tatums: T_SpotifyTimeInterval[];
    /** Sections are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc. Each section contains its own descriptions of tempo, key, mode, time_signature, and loudness. */
    sections: T_SpotifyAudioSection[];
    /** Each segment contains a roughly consistent sound throughout its duration. */
    segments: T_SpotifyAudioSegment[];
    /** No documentation found for the object. */
    track: T_SpotifyAudioTrack;
    /** No documentation found for the object. */
    meta: T_SpotifyAudioAnalysisMeta;
};

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

/**
 * The product type in the User object.
 */
export type T_SpotifyUserProductType = 'free' | 'open' | 'premium';

/**
 * The token type in the AccessToken object.
 */
export type T_SpotifyAccessTokenType = 'bearer';

/**
 * The spotify api object containing the details of the followers of a user.
 */
export type T_SpotifyFollowers = {
    /** The api url where you can get the list of followers. This will be null as the spotify api does not supports it at the moment. */
    href: string | null;
    total: number;
};

/**
 * The spotify api object containing the information of explicit content.
 */
export type T_SpotifyExplicitContentSettings = {
    filter_enabled: boolean;
    filter_locked: boolean;
};

/**
 * The spotify api object containing details of a user's public and private details.
 */
export type T_SpotifyPrivateUser = T_SpotifyPublicUser & {
    country: string;
    email: string;
    product?: T_SpotifyUserProductType;
    explicit_content?: T_SpotifyExplicitContentSettings;
    images: T_SpotifyImage[];
    followers: T_SpotifyFollowers;
};

/**
 * The spotify api object containing details of a user's public details.
 */
export type T_SpotifyPublicUser = {
    display_name: string | null;
    href: string;
    id: string;
    uri: string;
    type: 'user' | 'artist';
    external_urls: T_SpotifyExternalUrl;
};

/**
 * The cursor paging object for followed artists.
 */
export type T_SpotifyFollowedArtistCursorPaging = {
    href: string;
    limit: number;
    next: string;
    cursors: {
        after: string;
        before: string;
    };
    total: number;
    items: T_SpotifyArtist[];
};

/**
 * An object containing artists followed by the user.
 */
export type T_SpotifyFollowedArtistsResults = {
    artists: T_SpotifyFollowedArtistCursorPaging;
};

/**
 * The spotify api object containing the user's access token.
 */
export type T_SpotifyAccessToken = {
    access_token: string;
    token_type: T_SpotifyAccessTokenType;
    expires_in: number;
    scope: string;
    refresh_token: string;
};
