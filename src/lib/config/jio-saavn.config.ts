import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { userAgents } from '@/constants/user-agents.constants';

const jioSaavnConfig = axios.create({
    baseURL: EXTERNAL_ROUTES.JIO_SAAVN.BASE,
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    },
});

jioSaavnConfig.interceptors.request.use((config) => {
    config.params = {
        ...config.params,
        __call: config.url?.toString(),
        _format: 'json',
        _marker: '0',
        api_version: 4,
        ctx: config.params.ctx || 'web6dot0',
    };
    return config;
});

console.log('JioSaavn API configured!');

export default jioSaavnConfig;
