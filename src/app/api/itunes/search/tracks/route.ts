import { NextRequest } from 'next/server';

import iTunesApi from '@/lib/services/iTunes.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const artist = req.nextUrl.searchParams.get('artist') || undefined;
    const album = req.nextUrl.searchParams.get('album') || undefined;
    const limit = req.nextUrl.searchParams.get('limit') || '5';

    if (!title) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const res = await iTunesApi.searchTracks({ title, artist, album, limit: parseInt(limit, 10) });
    if (!res.success || !res.payload) {
        return createErrorResponse({ message: !res.success ? res.message : 'Failed to fetch results', status: 500 });
    }

    return createSuccessResponse({ message: 'Successfully fetched tracks!', payload: res.payload });
}
