import { NextRequest } from 'next/server';

import lrclib from '@/lib/services/lrclib.service';
import { createResponse, createSuccess, createValidationError } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const artist = req.nextUrl.searchParams.get('artist');
    const album = req.nextUrl.searchParams.get('album');
    const duration = req.nextUrl.searchParams.get('duration') ? parseInt(req.nextUrl.searchParams.get('duration')!) : undefined;

    const lyricsOnly = req.nextUrl.searchParams.get('lyricsOnly') === 'true';

    if (!title || !artist || !album || !duration) {
        return createValidationError(
            'Missing required parameters',
            { title: ['Title is required'], artist: ['Artist is required'], album: ['Album is required'], duration: ['Duration is required'] },
            {},
            true
        );
    }

    const response = await lrclib.getLyricsByMetadata(title, artist, album, duration);

    if (!response.success || !response.payload) {
        return createResponse(response);
    }

    return createSuccess('Success', lyricsOnly ? response.payload.syncedLyrics || response.payload.plainLyrics : response.payload, {}, true);
}
