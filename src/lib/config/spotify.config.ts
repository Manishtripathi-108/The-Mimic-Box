import axios from 'axios';

import spotifyApiRoutes from '@/constants/external-routes/spotify.routes';

const spotifyConfig = axios.create({
    baseURL: spotifyApiRoutes.base,
});

console.log('Spotify API configured!');

export default spotifyConfig;
