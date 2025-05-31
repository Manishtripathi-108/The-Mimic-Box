import { NextRequest } from 'next/server';

import lrclib from '@/lib/services/lrclib.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: number }> }) {
    const { id } = await params;
    if (typeof id !== 'number') {
        return createErrorResponse({ message: 'id must be a number', status: 400 });
    }

    const lyricsOnly = req.nextUrl.searchParams.get('lyricsOnly') === 'true';

    if (!id) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const response = await lrclib.getLyricsById(id);

    if (!response.success || !response.payload) {
        return createErrorResponse({ message: 'Failed to fetch results', status: 500 });
    }

    return createSuccessResponse({
        message: 'Success',
        payload: lyricsOnly ? response.payload.syncedLyrics || response.payload.plainLyrics : response.payload,
    });
}
