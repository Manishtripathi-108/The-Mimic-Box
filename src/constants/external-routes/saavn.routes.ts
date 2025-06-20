const SAAVN_ROUTES = {
    BASE: 'https://www.jiosaavn.com/api.php',
    SEARCH: {
        ALL: 'autocomplete.get',
        SONGS: 'search.getResults',
        ALBUMS: 'search.getAlbumResults',
        ARTISTS: 'search.getArtistResults',
        PLAYLISTS: 'search.getPlaylistResults',
    },
    SONG: {
        ID: 'song.getDetails',
        LINK: 'webapi.get',
        SUGGESTIONS: 'webradio.getSong',
        LYRICS: 'lyrics.getLyrics',
        STATION: 'webradio.createEntityStation',
    },
    ALBUM: {
        DETAILS: 'content.getAlbumDetails',
        LINK: 'webapi.get',
    },
    ARTIST: {
        DETAILS: 'artist.getArtistPageDetails',
        LINK: 'webapi.get',
        SONGS: 'artist.getArtistMoreSong',
        ALBUMS: 'artist.getArtistMoreAlbum',
    },
    PLAYLIST: {
        DETAILS: 'playlist.getDetails',
        LINK: 'webapi.get',
    },
    BROWSE: {
        MODULES: 'content.getBrowseModules',
        TRENDING: 'content.getTrending',
    },
} as const;

export default SAAVN_ROUTES;
