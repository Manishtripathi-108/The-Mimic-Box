import axios from 'axios';

import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import { userAgents } from '@/constants/user-agents.constants';

const iTunesConfig = axios.create({
    baseURL: EXTERNAL_ROUTES.ITUNES.BASE,
    headers: {
        'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    },
});

console.log('iTunes API configured!');

export default iTunesConfig;
