import { NextRequest } from 'next/server';

import lrclib from '@/lib/services/lrclib.service';
import { createResponse, createSuccess, createValidationError } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q');
    const lyricsOnly = req.nextUrl.searchParams.get('lyricsOnly') === 'true';

    if (!q) {
        return createValidationError('Missing required parameter: q', { q: ['Query is required'] }, {}, true);
    }

    const response = await lrclib.searchLyrics({ q });

    if (!response.success) return createResponse(response);

    return createSuccess(
        'Success',
        lyricsOnly ? response.payload[0].syncedLyrics || response.payload[0].plainLyrics : response.payload,
        { meta: { total: response.payload.length } },
        true
    );
}
