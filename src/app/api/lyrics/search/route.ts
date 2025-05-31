import { NextRequest } from 'next/server';

import lrclib from '@/lib/services/lrclib.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q');
    const lyricsOnly = req.nextUrl.searchParams.get('lyricsOnly') === 'true';

    if (!q) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const response = await lrclib.searchLyrics({ q });

    if (!response.success || !response.payload) {
        return createErrorResponse({ message: 'Failed to fetch results', status: 500 });
    }

    return createSuccessResponse({
        message: 'Success',
        payload: lyricsOnly ? response.payload[0].syncedLyrics || response.payload[0].plainLyrics : response.payload,
    });
}
