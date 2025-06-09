import { NextRequest } from 'next/server';

import iTunesApi from '@/lib/services/iTunes.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const limit = req.nextUrl.searchParams.get('limit') || '5';

    if (!id) return createErrorResponse({ message: 'Missing required parameters', status: 400 });

    const res = await iTunesApi.getAlbumsById(id, parseInt(limit, 10));
    if (!res.success || !res.payload) {
        return createErrorResponse({ message: !res.success ? res.message : 'Failed to fetch results', status: 500 });
    }

    return createSuccessResponse({ message: 'Success', payload: res.payload });
}
