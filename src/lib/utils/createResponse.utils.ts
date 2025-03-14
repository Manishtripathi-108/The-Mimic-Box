import { NextResponse } from 'next/server';

import { isAxiosError } from 'axios';

import { ErrorResponseInput, ErrorResponseOutput, SuccessResponseInput, SuccessResponseOutput } from '@/lib/types/response.types';

/**
 * Creates a standardized success response.
 */
export const createSuccessResponse = <T>({ message, status = 200, payload }: SuccessResponseInput<T>): NextResponse =>
    NextResponse.json<SuccessResponseOutput<T>>({ success: true, message, payload }, { status });

/**
 * Returns a standardized success object.
 */
export const createSuccessReturn = <T>(message: string, payload?: T): SuccessResponseOutput<T> => ({ success: true, message, payload });

/**
 * Creates a standardized error response.
 */
export const createErrorResponse = <T>({
    message = 'Internal Server Error',
    status = 500,
    error,
    extraData,
}: ErrorResponseInput<T>): NextResponse => {
    if (error) console.error('[API Error]:', error);

    return NextResponse.json<ErrorResponseOutput<T>>({ success: false, message, error, extraData }, { status });
};

/**
 * Returns a standardized error object.
 */
export const createErrorReturn = <T>(message: string, error?: Record<string, unknown> | Error, extraData?: T): ErrorResponseOutput<T> => {
    console.error(message, error);
    return { success: false, message, error, extraData };
};

/**
 * Handles API errors from AniList, extracting rate limit headers if available.
 */
export const createAniListError = (message: string, error?: unknown): NextResponse => {
    if (isAxiosError(error)) {
        return error.response
            ? createErrorResponse({
                  message: error.response?.data?.hint || message,
                  status: error.response?.status,
                  error: error.response?.data || message,
                  extraData: {
                      retryAfterSeconds: error.response?.headers?.['retry-after'],
                      remainingRateLimit: error.response?.headers?.['x-ratelimit-remaining'],
                  },
              })
            : createErrorResponse({ message, error, status: error.status });
    }

    return createErrorResponse({ message: error instanceof Error ? error.message : message });
};
