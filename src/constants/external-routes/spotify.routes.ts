const spotifyApiRoutes = {
    /**
     * Spotify Web API base URL
     */
    base: 'https://api.spotify.com/v1',

    /**
     * Spotify authorization endpoint
     */
    auth: 'https://accounts.spotify.com/authorize',

    /**
     * Spotify token exchange endpoint
     */
    exchangeToken: 'https://accounts.spotify.com/api/token',

    /**
     * Search for items in the Spotify catalog
     * @method GET
     * @param q - Search query keywords
     * @param type - One or more types: album, artist, playlist, track, show, episode, audiobook
     * @param market - Optional market code
     * @param limit - Optional max results (default 20, max 50)
     * @param offset - Optional index of first result
     */
    search: '/search',

    albums: {
        /**
         * Get a single album
         * @method GET
         * @param id - Album ID
         */
        getAlbum: (id: string) => `/albums/${id}`,

        /**
         * Get multiple albums
         * @method GET
         * @param ids - Array of album IDs (max 20)
         */
        getAlbums: (ids: string[]) => `/albums?ids=${ids.join(',')}`,

        /**
         * Get tracks in an album
         * @method GET
         * @param id - Album ID
         * @param limit - Optional max results (default 20, max 50)
         * @param offset - Optional index of first result
         */
        getAlbumTracks: (id: string) => `/albums/${id}/tracks`,

        /**
         * Get user's saved albums
         * @method GET
         */
        getMySavedAlbums: () => `/me/albums`,

        /**
         * Save albums to user’s library
         * @method PUT
         * @param ids - Array of album IDs. Max 20
         */
        saveAlbums: (ids: string[]) => `/me/albums?ids=${ids.join(',')}`,

        /**
         * Remove albums from user's library
         * @method DELETE
         * @param ids - Array of album IDs. Max 20
         */
        removeAlbums: (ids: string[]) => `/me/albums?ids=${ids.join(',')}`,

        /**
         * Check if albums are saved in user's library
         * @method GET
         * @param ids - Array of album IDs. Max 20
         */
        checkSavedAlbums: (ids: string[]) => `/me/albums/contains?ids=${ids.join(',')}`,

        /**
         * Get new album releases
         * @method GET
         * @param limit - Optional max results (default 20, max 50)
         * @param offset - Optional index of first result
         */
        getNewReleases: () => `/browse/new-releases`,
    },

    artists: {
        /**
         * Get a single artist
         * @method GET
         * @param id - Artist ID
         */
        getArtist: (id: string) => `/artists/${id}`,

        /**
         * Get multiple artists
         * @method GET
         * @param ids - Array of artist IDs
         */
        getArtists: (ids: string[]) => `/artists?ids=${ids.join(',')}`,

        /**
         * Get an artist's albums
         * @method GET
         * @param id - Artist ID
         */
        getArtistAlbums: (id: string) => `/artists/${id}/albums`,

        /**
         * Get an artist's top tracks
         * @method GET
         * @param id - Artist ID
         * @param country - Country code for top track localization
         */
        getArtistTopTracks: (id: string, country?: string) => `/artists/${id}/top-tracks${country ? `?market=${country}` : ''}`,
    },

    audiobooks: {
        /**
         * Check if audiobooks are saved in user's library
         * @method GET
         * @param ids - Array of audiobook IDs
         */
        checkSavedAudiobooks: (ids: string[]) => `/me/audiobooks/contains?ids=${ids.join(',')}`,

        getAudiobook: (id: string) => `/audiobooks/${id}`, // GET; id: string (required), market?: string (optional)
        getAudiobookChapters: (id: string) => `/audiobooks/${id}/chapters`, // GET; id: string (required), market?: string, limit?: number, offset?: number
        getAudiobooks: (ids: string[]) => `/audiobooks?ids=${ids.join(',')}`, // GET; ids: string[] (required), market?: string (optional)
        getMySavedAudiobooks: () => `/me/audiobooks`, // GET; limit?: number, offset?: number
        saveAudiobooks: (ids: string[]) => `/me/audiobooks?ids=${ids.join(',')}`, // PUT; ids: string[] (required)
        removeAudiobooks: (ids: string[]) => `/me/audiobooks?ids=${ids.join(',')}`, // DELETE; ids: string[] (required)
    },

    browse: {
        /**
         * Get list of available genre seeds
         * @method GET
         */
        getAvailableGenreSeeds: () => `/recommendations/available-genre-seeds`,

        /**
         * Get list of categories
         * @method GET
         */
        getCategories: () => `/browse/categories`,

        /**
         * Get a single category
         * @method GET
         * @param id - Category ID
         */
        getCategory: (id: string) => `/browse/categories/${id}`,

        /**
         * Get playlists for a category
         * @method GET
         * @param id - Category ID
         */
        getCategoryPlaylists: (id: string) => `/browse/categories/${id}/playlists`,

        /**
         * Get list of featured playlists
         * @method GET
         */
        getFeaturedPlaylists: () => `/browse/featured-playlists`,

        /**
         * Get a list of new album releases
         * @method GET
         */
        getNewReleases: () => `/browse/new-releases`,

        /**
         * Get recommendations based on seeds
         * @method GET
         */
        getRecommendations: () => `/recommendations`,
    },

    episodes: {
        /**
         * Get an episode
         * @method GET
         * @param id - Episode ID
         */
        getEpisode: (id: string) => `/episodes/${id}`,

        /**
         * Get multiple episodes
         * @method GET
         * @param ids - Array of Episode IDs
         */
        getEpisodes: (ids: string[]) => `/episodes?ids=${ids.join(',')}`,
    },

    player: {
        /**
         * Get recently played tracks
         * @method GET
         * @param limit - Optional max results (default 20, max 50)
         * @param after - Optional timestamp to get tracks played after this time
         * @param before - Optional timestamp to get tracks played before this time
         * */
        getRecentlyPlayedTracks: () => `/me/player/recently-played`,

        /**
         * Add item to playback queue
         * @method POST
         * @param uri - Spotify URI of item
         */
        addToQueue: (uri: string) => `/me/player/queue?uri=${encodeURIComponent(uri)}`,

        /**
         * Get the object currently being played on the user’s account
         * @method GET
         */
        getCurrentlyPlaying: () => `/me/player/currently-playing`,

        /**
         * Get available devices
         * @method GET
         */
        getDevices: () => `/me/player/devices`,

        /**
         * Get information about the user’s current playback state
         * @method GET
         */
        getPlaybackState: () => `/me/player`,

        /**
         * Skip to next track
         * @method POST
         */
        nextTrack: () => `/me/player/next`,

        /**
         * Pause playback
         * @method PUT
         */
        pausePlayback: () => `/me/player/pause`,

        /**
         * Skip to previous track
         * @method POST
         */
        previousTrack: () => `/me/player/previous`,

        /**
         * Seek to position in currently playing track
         * @method PUT
         * @param positionMs - Position in milliseconds
         */
        seekToPosition: (positionMs: number) => `/me/player/seek?position_ms=${positionMs}`,

        /**
         * Set repeat mode
         * @method PUT
         * @param state - repeat|track|off
         */
        setRepeat: (state: 'track' | 'context' | 'off') => `/me/player/repeat?state=${state}`,

        /**
         * Toggle shuffle
         * @method PUT
         * @param state - true to enable shuffle, false to disable
         */
        setShuffle: (state: boolean) => `/me/player/shuffle?state=${state}`,

        /**
         * Set volume
         * @method PUT
         * @param volumePercent - Volume (0 to 100)
         */
        setVolume: (volumePercent: number) => `/me/player/volume?volume_percent=${volumePercent}`,

        /**
         * Start or resume playback
         * @method PUT
         */
        startPlayback: () => `/me/player/play`,

        /**
         * Transfer playback to a different device
         * @method PUT
         */
        transferPlayback: () => `/me/player`,
    },

    playlists: {
        /**
         * Get a playlist's details by its ID.
         * @method GET
         * @param id - The ID of the playlist you want to get.
         */
        getPlaylist: (id: string) => `/playlists/${id}`,

        /**
         * Get the list of tracks in a playlist.
         * @method GET
         * @param id - The ID of the playlist.
         * @param limit - (Optional) Maximum number of items to return (default 20, max 100).
         * @param offset - (Optional) The index of the first item to return.
         */
        getPlaylistItems: (id: string) => `/playlists/${id}/tracks`,

        /**
         * Update the playlist's name, description, or visibility.
         * @method PUT
         * @param id - The ID of the playlist to update.
         * @data name - The new name for the playlist.
         * @data description - The new description for the playlist.
         * @data public - Whether the playlist should be visible to everyone.
         * @data collaborative - Whether others can edit this playlist.
         */
        changePlaylistDetails: (id: string) => `/playlists/${id}`,

        /**
         * Replace or reorder items in a playlist.
         * @method PUT
         * @param id - The ID of the playlist.
         * @param uris - A list of Spotify track or episode URIs to replace the current items.
         * @data uris - A list of Spotify URIs to set in the playlist.
         * @data snapshot_id - (Optional) The current version ID of the playlist for safe updates.
         * @data range_start - The index of the first item you want to move.
         * @data insert_before - The position to insert the moved items into.
         * @data range_length - Number of items to move (default is 1).
         */
        replaceItems: (id: string, uris: string[]) => `/playlists/${id}/tracks?uris=${uris.join(',')}`,

        /**
         * Add new tracks or episodes to a playlist.
         * @method POST
         * @param id - The ID of the playlist.
         * @param uris - A comma-separated list of Spotify track or episode URIs to add.
         * @param position - (Optional) Index where the items should be added. If not set, items are added at the end.
         * @data uris - A list of Spotify URIs to add to the playlist.
         * @data position - Where in the playlist the new items should go (0 = start).
         */
        addItems: (id: string) => `/playlists/${id}/tracks`,

        /**
         * Remove specific tracks or episodes from a playlist.
         * @method DELETE
         * @param id - The ID of the playlist.
         * @data tracks - A list of objects with the URIs of items to remove.
         * @data snapshot_id - (Optional) The current version ID of the playlist for safe updates.
         */
        removeItems: (id: string) => `/playlists/${id}/tracks`,

        /**
         * Get playlists of the current logged-in user.
         * @method GET
         * @param limit - (Optional) Number of playlists to return (default 20, max 50).
         * @param offset - (Optional) Index of the first playlist to return.
         */
        getMyPlaylists: () => `/me/playlists`,

        /**
         * Get public playlists of a specific user.
         * @method GET
         * @param userId - The ID of the user whose playlists you want to fetch.
         * @param limit - (Optional) Number of playlists to return (default 20, max 50).
         * @param offset - (Optional) Index of the first playlist to return.
         */
        getUserPlaylists: (userId: string) => `/users/${userId}/playlists`,

        /**
         * Create a new playlist for a specific user.
         * @method POST
         * @param userId - The ID of the user to create the playlist for.
         */
        createPlaylist: (userId: string) => `/users/${userId}/playlists`,

        /**
         * Get the current cover image of a playlist.
         * @method GET
         * @param id - The ID of the playlist.
         */
        getPlaylistCoverImage: (id: string) => `/playlists/${id}/images`,

        /**
         * Upload a new image to use as the playlist's cover.
         * @method PUT
         * @param id - The ID of the playlist.
         * @data - Base64-encoded JPEG image (max size: 256 KB).
         */
        uploadPlaylistCoverImage: (id: string) => `/playlists/${id}/images`,
    },

    shows: {
        /**
         * Get a show
         * @method GET
         * @param id - Show ID
         */
        getShow: (id: string) => `/shows/${id}`,

        /**
         * Get several shows
         * @method GET
         * @param ids - Array of Show IDs
         */
        getShows: (ids: string[]) => `/shows?ids=${ids.join(',')}`,

        /**
         * Get episodes of a show
         * @method GET
         * @param id - Show ID
         */
        getEpisodes: (id: string) => `/shows/${id}/episodes`,
    },

    tracks: {
        /**
         * Get a single track
         * @method GET
         * @param id - Track ID
         */
        getTrack: (id: string) => `/tracks/${id}`,

        /**
         * Get multiple tracks
         * @method GET
         * @param ids - Array of track IDs
         */
        getTracks: (ids: string[]) => `/tracks?ids=${ids.join(',')}`,

        /**
         * Get user's saved tracks
         * @method GET
         * @param limit - Optional max results (default 20, max 50)
         * @param offset - Optional index of first result
         * @param market - Optional market code
         */
        getMySavedTracks: () => `/me/tracks`,

        /**
         * Save tracks to user’s library
         * @method PUT
         * @param ids - Array of track IDs (max 50)
         * @data ids - Array of track IDs to save (max 50)
         */
        saveTracks: (ids: string[]) => `/me/tracks?ids=${ids.join(',')}`,

        /**
         * Remove tracks from user's library
         * @method DELETE
         * @param ids - Array of track IDs
         */
        removeTracks: (ids: string[]) => `/me/tracks?ids=${ids.join(',')}`,

        /**
         * Check if tracks are saved in user's library
         * @method GET
         * @param ids - Array of track IDs
         */
        checkSavedTracks: (ids: string[]) => `/me/tracks/contains?ids=${ids.join(',')}`,
    },

    users: {
        /**
         * Get current user profile
         * @method GET
         */
        getMyProfile: () => `/me`,

        /**
         * Get current user's top artists or tracks
         * @method GET
         * @param type - 'artists' | 'tracks'
         */
        getTop: (type: 'artists' | 'tracks') => `/me/top/${type}`,

        /**
         * Get a user profile by ID
         * @method GET
         * @param id - User ID
         */
        getUser: (id: string) => `/users/${id}`,

        /**
         * Follow Playlist
         * @method PUT
         * @param id - Playlist ID
         * @data public - Whether the playlist should be public
         */
        followPlaylist: (id: string) => `/playlists/${id}/followers`,

        /**
         * Unfollow Playlist
         * @method DELETE
         * @param id - Playlist ID
         */
        unfollowPlaylist: (id: string) => `/playlists/${id}/followers`,

        /**
         * Get followed artists
         * @method GET
         * @param limit - Optional max results (default 20, max 50)
         * @param after - Optional cursor for pagination
         * @param before - Optional cursor for pagination
         */
        getFollowedArtists: () => `/me/following?type=artist`,

        /**
         * Follow artists or users
         * @method PUT
         * @param type - 'artist' | 'user'
         * @param ids - Array of artist or user IDs to follow
         * @data ids - Array of artist or user IDs to follow
         */
        follow: (type: 'artist' | 'user', ids: string[]) => `/me/following?type=${type}&ids=${ids.join(',')}`,

        /**
         * Unfollow artists or users
         * @method DELETE
         * @param type - 'artist' | 'user'
         * @param ids - Array of artist or user IDs to unfollow
         * @data ids - Array of artist or user IDs to unfollow
         */
        unfollow: (type: 'artist' | 'user', ids: string[]) => `/me/following?type=${type}&ids=${ids.join(',')}`,

        /**
         * Check if user follows artists or users
         * @method GET
         * @param type - 'artist' | 'user'
         * @param ids - Array of artist or user IDs to check
         */
        checkFollowing: (type: 'artist' | 'user', ids: string[]) => `/me/following/contains?type=${type}&ids=${ids.join(',')}`,

        /**
         * Check if user follows a playlist
         * @method GET
         * @param playlistId - Playlist ID
         */
        checkFollowingPlaylist: (playlistId: string) => `playlists/${playlistId}/followers/contains`,
    },
} as const;

export default spotifyApiRoutes;
