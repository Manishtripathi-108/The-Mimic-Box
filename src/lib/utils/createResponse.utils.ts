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
 * Extracts relevant rate limit headers from an Axios error response.
 */
const extractRateLimitHeaders = (error: unknown) => {
    if (isAxiosError(error) && error.response?.headers) {
        return {
            retryAfterSeconds: parseInt(error.response.headers['retry-after'], 10) || 60,
            remainingRateLimit: parseInt(error.response.headers['x-ratelimit-remaining'], 10) || 90,
        };
    }
    return undefined;
};

/**
 * Handles API errors from AniList, extracting rate limit headers if available.
 */
export const createAniListError = (message: string, error?: unknown): NextResponse => {
    if (isAxiosError(error) && error.response) {
        return createErrorResponse({
            message: error.response.data?.hint || message,
            status: error.response.status,
            error: error.response.data || message,
            extraData: extractRateLimitHeaders(error),
        });
    }

    return createErrorResponse({
        message,
        error: error instanceof Error ? error : new Error(String(error)),
    });
};

/**
 * Returns a structured error response for AniList API errors, with optional rate limit headers.
 */
export const createAniListErrorReturn = (
    message: string,
    error?: unknown
): ErrorResponseOutput<{ retryAfterSeconds: number; remainingRateLimit: number } | undefined> => {
    if (isAxiosError(error) && error.response) {
        return createErrorReturn(error.response.data?.hint || message, error.response.data || message, extractRateLimitHeaders(error));
    }

    return createErrorReturn(message, error instanceof Error ? error : new Error(message));
};
