import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { getRandomUserAgent } from '@/constants/user-agents.constants';

const iTunesConfig = axios.create({
    baseURL: EXTERNAL_ROUTES.ITUNES.BASE,
});

iTunesConfig.interceptors.request.use((config) => {
    config.headers['User-Agent'] = getRandomUserAgent();

    return config;
});

console.log('iTunes API configured!');

export default iTunesConfig;
