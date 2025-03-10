import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';

export const successResponse = <T>({ message = 'Success', status = 200, data }: { message?: string; status?: number; data?: T }) => {
    return NextResponse.json(
        {
            success: true,
            message,
            ...data,
        },
        { status }
    );
};

export const errorResponse = ({
    message = 'Internal Server Error',
    status = 500,
    error,
    extraData = {},
}: {
    message: string;
    status?: number;
    error?: unknown;
    extraData?: Record<string, unknown>;
}) => {
    if (error) console.error(error);

    return NextResponse.json(
        {
            success: false,
            message,
            ...(error ? { error } : {}),
            ...extraData,
        },
        { status }
    );
};

/**
 * Handles an error response from Anilist, extracting the retry-after and
 * x-ratelimit-remaining headers if available and including them in the
 * response. Logs the error and includes the error message in the response.
 */
export const anilistErrorResponse = (message: string, error?: unknown) => {
    if (isAxiosError(error)) {
        if (error.response) {
            const retryAfterSeconds = error.response?.headers?.['retry-after'];
            const remainingRateLimit = error.response?.headers?.['x-ratelimit-remaining'];

            return errorResponse({
                message: error.response?.data?.hint || message,
                status: error.response?.status,
                error: error.response?.data || message,
                extraData: { retryAfterSeconds, remainingRateLimit },
            });
        } else {
            return errorResponse({ message, error, status: error.status });
        }
    }

    if (error instanceof Error) {
        return errorResponse({ message: error.message });
    }

    return errorResponse({ message });
};
