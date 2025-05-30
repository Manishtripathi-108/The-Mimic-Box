import { NextRequest } from 'next/server';

import saavnApi from '@/lib/services/saavn.service';
import { createErrorResponse, createSuccessResponse } from '@/lib/utils/createResponse.utils';

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('query');

    if (!query) {
        return createErrorResponse({ message: 'Missing required parameters', status: 400 });
    }

    const response = await saavnApi.searchAll(query);

    if (!response.success || !response.payload) {
        return createErrorResponse({ message: 'Failed to fetch results', status: 500 });
    }

    return createSuccessResponse({ message: 'Success', payload: response.payload });
}
