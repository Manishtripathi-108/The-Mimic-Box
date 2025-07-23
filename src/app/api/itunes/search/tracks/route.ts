import { NextRequest } from 'next/server';

import iTunesApi from '@/lib/services/iTunes.service';
import { createResponse, createValidationError } from '@/lib/utils/createResponse.utils';

// Adjust the import path based on your actual structure

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');
    const artist = req.nextUrl.searchParams.get('artist') || undefined;
    const album = req.nextUrl.searchParams.get('album') || undefined;
    const limit = req.nextUrl.searchParams.get('limit') || '5';

    if (!title) {
        return createValidationError('Missing required parameters', { title: ['Title is required'] }, {}, true);
    }

    const res = await iTunesApi.searchTracks({ title, artist, album, limit: parseInt(limit, 10) });

    return createResponse(res);
}
