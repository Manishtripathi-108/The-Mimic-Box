import { NextRequest } from 'next/server';

import saavnApi from '@/lib/services/saavn.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    console.log('GET /api/saavn/search/songs');

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '0');

    if (!query) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const response = await saavnApi.searchSongs({ query, limit, page });

    if (!response.success || !response.payload) {
        return createErrorResponse({ message: 'Failed to fetch results', status: 500 });
    }

    return createSuccessResponse({ message: 'Success', payload: response.payload });
}
