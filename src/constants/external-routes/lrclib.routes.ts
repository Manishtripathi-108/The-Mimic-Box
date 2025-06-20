const LRCLIB_ROUTES = {
    /**
     * Base URL for the LRCLIB API.
     * All API requests are made relative to this domain.
     */
    BASE: 'https://lrclib.net',

    /**
     * Endpoint to fetch synchronized lyrics for a track.
     *
     * Accepts either:
     * 1. A set of parameters:
     *    - `track_name` (string): Name of the track.
     *    - `artist_name` (string): Name of the artist.
     *    - `album_name` (string, optional): Name of the album.
     *    - `duration` (number): Duration of the track in seconds. A ±2 second tolerance is applied when matching.
     *
     * OR
     *
     * 2. A direct track `id`:
     *    - The LRCLIB-specific ID of the track.
     *
     * @example By ID: https://lrclib.net/api/get/3396226
     * @example By metadata: https://lrclib.net/api/get?track_name=Hello&artist_name=Adele&duration=295
     */
    GET: 'https://lrclib.net/api/get',

    /**
     * Endpoint to search for available lyrics in the LRCLIB database.
     *
     * Accepts either:
     * - `q` (string): A full-text search query (e.g., "Bohemian Rhapsody Queen").
     * OR
     * - Individual components:
     *    - `track_name` (string)
     *    - `artist_name` (string)
     *    - `album_name` (string, optional)
     *
     * If both `q` and `track_name` are provided, the `q` parameter takes precedence.
     *
     * @example: https://lrclib.net/api/search?q=Imagine+John+Lennon
     */
    SEARCH: 'https://lrclib.net/api/search',
} as const;

export default LRCLIB_ROUTES;
