import { NextResponse } from 'next/server';

import { isAxiosError } from 'axios';

import { ErrorResponseInput, ErrorResponseOutput, SuccessResponseInput, SuccessResponseOutput } from '../types/response.types';

/**
 * Creates a standardized success response.
 */
export const createSuccessResponse = <T>({ message, status = 200, payload }: SuccessResponseInput<T>): NextResponse => {
    return NextResponse.json<SuccessResponseOutput<T>>(
        {
            success: true,
            message,
            payload,
        },
        { status }
    );
};

/**
 * Creates a standardized error response.
 */
export const createErrorResponse = ({ message = 'Internal Server Error', status = 500, error, extraData = {} }: ErrorResponseInput): NextResponse => {
    if (error) console.error('[API Error]:', error);

    return NextResponse.json<ErrorResponseOutput>(
        {
            success: false,
            message,
            error,
            extraData,
        },
        { status }
    );
};

/**
 * Handles API errors from Anilist, extracting rate limit headers if available.
 */
export const createAnilistError = (message: string, error?: unknown): NextResponse => {
    if (isAxiosError(error)) {
        if (error.response) {
            const retryAfterSeconds = error.response?.headers?.['retry-after'];
            const remainingRateLimit = error.response?.headers?.['x-ratelimit-remaining'];

            return createErrorResponse({
                message: error.response?.data?.hint || message,
                status: error.response?.status,
                error: error.response?.data || message,
                extraData: { retryAfterSeconds, remainingRateLimit },
            });
        }
        return createErrorResponse({ message, error, status: error.status });
    }

    if (error instanceof Error) {
        return createErrorResponse({ message: error.message });
    }

    return createErrorResponse({ message });
};
