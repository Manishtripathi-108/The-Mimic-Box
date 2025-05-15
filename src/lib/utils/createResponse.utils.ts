import { NextResponse } from 'next/server';

import { isAxiosError } from 'axios';

import { ErrorCodes, ErrorResponseInput, ErrorResponseOutput, SuccessResponseInput, SuccessResponseOutput } from '@/lib/types/response.types';

// Creates a standardized success response.
export const createSuccessResponse = <T = undefined>({ message = 'Success', status = 200, payload }: SuccessResponseInput<T>): NextResponse =>
    NextResponse.json<SuccessResponseOutput<T>>({ success: true, message, payload: payload as T }, { status });

// Returns a standardized success object.
export const createSuccessReturn = <T = undefined>(message: string, payload?: T): SuccessResponseOutput<T> => ({
    success: true,
    message,
    payload: payload as T,
});

// Creates a standardized error response.
export const createErrorResponse = <T = undefined>({
    message = 'Internal Server Error',
    status = 500,
    error,
    extraData,
    code,
}: ErrorResponseInput<T>): NextResponse => {
    console.error(message, error);
    return NextResponse.json<ErrorResponseOutput<T>>({ success: false, message, error, extraData: extraData as T, code }, { status });
};

// Creates a structured error response.
export const createErrorReturn = <T = undefined>(
    message: string,
    error?: unknown,
    extraData?: T,
    code?: ErrorCodes
): ErrorResponseOutput<T> => {
    console.error(message, error);
    return { success: false, message, error, extraData: extraData as T, code };
};

/* --------------------------------- Anilist -------------------------------- */
const extractRateLimitHeaders = (error: unknown) => {
    if (isAxiosError(error) && error.response?.headers) {
        return {
            retryAfterSeconds: parseInt(error.response.headers['retry-after'], 10) || 60,
            remainingRateLimit: parseInt(error.response.headers['x-ratelimit-remaining'], 10) || 90,
        };
    }
    return undefined;
};

// Creates a structured error response for AniList API errors.
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

// Creates a structured error return for AniList API errors.
export const createAniListErrorReturn = (
    message: string,
    error?: unknown
): ErrorResponseOutput<{ retryAfterSeconds: number; remainingRateLimit: number } | undefined> => {
    if (isAxiosError(error) && error.response) {
        return createErrorReturn(error.response.data?.hint || message, error.response.data || message, extractRateLimitHeaders(error));
    }

    return createErrorReturn(message, error instanceof Error ? error : new Error(message));
};
