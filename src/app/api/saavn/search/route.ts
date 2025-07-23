import { NextRequest } from 'next/server';

import saavnApi from '@/lib/services/saavn.service';
import { createResponse, createValidationError } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');

    if (!query) {
        return createValidationError('Missing required parameter: query', { query: ['Query is required'] }, {}, true);
    }

    const response = await saavnApi.searchAll(query);

    return createResponse(response);
}
