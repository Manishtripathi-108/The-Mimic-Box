import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { getRandomUserAgent } from '@/constants/user-agents.constants';

const saavnConfig = axios.create({
    baseURL: EXTERNAL_ROUTES.SAAVN.BASE,
    headers: {
        'Content-Type': 'application/json',
        cookie: `gdpr_acceptance=true; DL=english`,
    },
});

saavnConfig.interceptors.request.use((config) => {
    config.params = {
        ...config.params,
        _format: 'json',
        _marker: '0',
        api_version: 4,
        cc: 'IN',
        ctx: config.params?.ctx || 'web6dot0',
    };

    config.headers['User-Agent'] = getRandomUserAgent();

    return config;
});

console.log('Saavn API configured!');

export default saavnConfig;
