import { NextRequest } from 'next/server';

import saavnApi from '@/lib/services/saavn.service';
import { createResponse, createValidationError } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '0');

    if (!query) {
        return createValidationError('Missing required parameter: query', { query: ['Query is required'] }, {}, true);
    }

    const response = await saavnApi.searchArtists({ query, limit, page });

    return createResponse(response);
}
