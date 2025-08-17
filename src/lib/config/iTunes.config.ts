import axios from 'axios';

import ITUNES_ROUTES from '@/constants/external-routes/iTunes.routes';

const iTunesConfig = axios.create({
    baseURL: ITUNES_ROUTES.BASE,
});

console.log('iTunes API configured!');

export default iTunesConfig;
