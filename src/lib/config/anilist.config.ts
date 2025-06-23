import axios from 'axios';

import ANILIST_ROUTES from '@/constants/external-routes/anilist.routes';

const anilistConfig = axios.create({
    baseURL: ANILIST_ROUTES.GRAPHQL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

console.log('Anilist API configured!');

export default anilistConfig;
