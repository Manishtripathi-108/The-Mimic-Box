import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';

const spotifyConfig = axios.create({
    baseURL: EXTERNAL_ROUTES.SPOTIFY.BASE,
});

console.log('Spotify API configured!');

export default spotifyConfig;
