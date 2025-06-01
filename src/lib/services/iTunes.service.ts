import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import iTunesConfig from '@/lib/config/iTunes.config';
import { T_ITunesPayload } from '@/lib/types/iTunes/global.types';
import { T_ITunesMusicTrackApiRes } from '@/lib/types/iTunes/track.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { createITunesTrack } from '@/lib/utils/iTunes.utils';

export const searchTrackDetails = async ({ track, artist, album, limit = 5 }: { track: string; artist?: string; album?: string; limit?: number }) => {
    const queryParts = [track, artist, album].filter(Boolean).join(' ');

    try {
        const res = await iTunesConfig.get<T_ITunesPayload<T_ITunesMusicTrackApiRes>>(EXTERNAL_ROUTES.ITUNES.SEARCH, {
            params: {
                term: queryParts,
                entity: 'song',
                limit: limit,
            },
        });

        if (!res.data.results.length) {
            return createErrorReturn('No tracks found for the given query');
        }

        return createSuccessReturn('Track details fetched successfully', createITunesTrack(res.data.results));
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return createErrorReturn(errorMessage);
    }
};

// export const getAlbumDetailsId = async (id: number | string, limit = 5) => {
//     try {
//         const res = await iTunesConfig.get<T_ITunesPayload<T_ITunesMusicTrackApiRes>>(EXTERNAL_ROUTES.ITUNES.LOOKUP, {
//             params: {
//                 id: id,
//                 entity: 'album',
//                 limit: limit,
//             },
//         });

//         console.log('🚀 ~ getAlbumDetailsId ~ res:', res.data);

//         if (res.data.resultCount === 0) {
//             return createErrorReturn('No collection found for the given ID');
//         }

//         return createSuccessReturn('Collection details fetched successfully', createITunesTrack(res.data.results));
//     } catch (error) {
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//         return createErrorReturn(errorMessage);
//     }
// };

const iTunesApi = {
    searchTrackDetails,
    // getAlbumDetailsId,
};

export default iTunesApi;
