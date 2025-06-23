import axios from 'axios';

import { getRandomUserAgent } from '@/constants/user-agents.constants';
import ITUNES_ROUTES from '@/constants/external-routes/iTunes.routes';

const iTunesConfig = axios.create({
    baseURL: ITUNES_ROUTES.BASE,
});

iTunesConfig.interceptors.request.use((config) => {
    config.headers['User-Agent'] = getRandomUserAgent();

    return config;
});

console.log('iTunes API configured!');

export default iTunesConfig;
