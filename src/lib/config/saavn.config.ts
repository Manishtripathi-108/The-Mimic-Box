import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { userAgents } from '@/constants/user-agents.constants';

const saavnConfig = axios.create({
    baseURL: EXTERNAL_ROUTES.SAAVN.BASE,
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
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

    return config;
});

console.log('Saavn API configured!');

export default saavnConfig;
