import axios from 'axios';

import ITUNES_ROUTES from '@/constants/external-routes/iTunes.routes';
import { getRandomUserAgent } from '@/constants/user-agents.constants';

const iTunesConfig = axios.create({
    baseURL: ITUNES_ROUTES.BASE,
});

iTunesConfig.interceptors.request.use((config) => {
    config.headers['User-Agent'] = getRandomUserAgent();

    return config;
});

console.log('iTunes API configured!');

export default iTunesConfig;
