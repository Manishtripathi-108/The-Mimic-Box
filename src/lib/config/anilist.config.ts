import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';

const anilistConfig = axios.create({
    baseURL: EXTERNAL_ROUTES.ANILIST.GRAPHQL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

console.log('Anilist API configured!');

export default anilistConfig;
