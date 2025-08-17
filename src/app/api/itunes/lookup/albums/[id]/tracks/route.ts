import { NextRequest } from 'next/server';

import iTunesApi from '@/lib/services/iTunes.service';
import { createResponse, createValidationError } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const limit = req.nextUrl.searchParams.get('limit') || '5';

    if (!id) return createValidationError('Missing required parameter: id', { id: ['ID is required'] }, {}, true);

    const res = await iTunesApi.getAlbumTracksById(id, parseInt(limit, 10));
    return createResponse(res);
}
