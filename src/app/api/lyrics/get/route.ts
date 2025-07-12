import { NextRequest } from 'next/server';

import lrclib from '@/lib/services/lrclib.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const artist = req.nextUrl.searchParams.get('artist');
    const album = req.nextUrl.searchParams.get('album');
    const duration = req.nextUrl.searchParams.get('duration') ? parseInt(req.nextUrl.searchParams.get('duration')!) : undefined;

    const lyricsOnly = req.nextUrl.searchParams.get('lyricsOnly') === 'true';

    if (!title || !artist || !album || !duration) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const response = await lrclib.getLyricsByMetadata(title, artist, album, duration);

    if (!response.success || !response.payload) {
        return createErrorResponse({ message: 'Failed to fetch results', status: 404 });
    }

    return createSuccessResponse({
        message: 'Success',
        payload: lyricsOnly ? response.payload.syncedLyrics || response.payload.plainLyrics : response.payload,
    });
}
