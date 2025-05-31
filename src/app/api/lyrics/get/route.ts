import { NextRequest } from 'next/server';

import lrclib from '@/lib/services/lrclib.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const track = req.nextUrl.searchParams.get('track');
    const artist = req.nextUrl.searchParams.get('artist');
    const album = req.nextUrl.searchParams.get('album');
    const duration = req.nextUrl.searchParams.get('duration') ? parseInt(req.nextUrl.searchParams.get('duration')!) : undefined;

    const lyricsOnly = req.nextUrl.searchParams.get('lyricsOnly') === 'true';

    if (!track || !artist || !album || !duration) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const response = await lrclib.getLyricsByMetadata(track, artist, album, duration);

    if (!response.success || !response.payload) {
        return createErrorResponse({ message: 'Failed to fetch results', status: 500 });
    }

    return createSuccessResponse({
        message: 'Success',
        payload: lyricsOnly ? response.payload.syncedLyrics || response.payload.plainLyrics : response.payload,
    });
}
