import { NextRequest } from 'next/server';

import lrclib from '@/lib/services/lrclib.service';
import { createResponse, createSuccess, createValidationError } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    if (typeof id !== 'number') {
        return createValidationError('ID must be a number', { id: ['ID must be a number'] }, {}, true);
    }

    const lyricsOnly = req.nextUrl.searchParams.get('lyricsOnly') === 'true';

    if (!id) {
        return createValidationError('Missing required parameters', { id: ['ID is required'] }, {}, true);
    }

    const response = await lrclib.getLyricsById(id);

    if (!response.success || !response.payload) {
        return createResponse(response);
    }

    return createSuccess('Success', lyricsOnly ? response.payload.syncedLyrics || response.payload.plainLyrics : response.payload, {}, true);
}
