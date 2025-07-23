import { NextResponse } from 'next/server';

import { isAxiosError } from 'axios';

import {
    T_BaseResponse,
    T_BatchOperationResult,
    T_ErrorResponse,
    T_ErrorResponseOutput,
    T_PaginationMeta,
    T_RateLimitInfo,
    T_ServiceHealthStatus,
    T_SuccessResponseOutput,
} from '@/lib/types/response.types';
import ErrorHandler, { ErrorLike } from '@/lib/utils/ErrorHandler.utils';
import { isDev } from '@/lib/utils/core.utils';

/**
 * Configuration constants for response handling.
 */
const CONFIG = {
    showStack: isDev,
    defaultErrorStatus: 500,
    defaultSuccessStatus: 200,
    defaultRateLimitRetry: 60,
} as const;

/**
 * HTTP status codes enum for better type safety.
 */
const HttpStatus = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error codes enum for consistent error identification.
 */
const ErrorCode = {
    SERVER_ERROR: 'server_error',
    VALIDATION_ERROR: 'validation_error',
    NOT_FOUND: 'not_found',
    ACCESS_DENIED: 'access_denied',
    FORBIDDEN: 'forbidden',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
} as const;

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
// Conditional return type
type T_ResponseOrJson<T, B extends boolean> = B extends true ? NextResponse : T;

/**
 * Logs error details in a structured JSON format for debugging and monitoring.
 */
function logError<T = undefined>(message: string, data: T_ErrorResponse<T>): void {
    const errorLog = {
        message,
        ...data,
    };
    console.error('API Error:', JSON.stringify(errorLog, null, 2));
}

/**
 * Constructs a standardized success response structure.
 */
function buildSuccessData<T = undefined>(message: string, payload?: T, data: T_BaseResponse = {}): T_SuccessResponseOutput<T> {
    const response: T_SuccessResponseOutput<T> = {
        success: true,
        message,
        payload: payload as T,
        timestamp: new Date(),
    };

    // Conditionally add optional fields to avoid undefined values
    if (data.meta) response.meta = data.meta;
    if (data.requestId) response.requestId = data.requestId;
    return response;
}

/**
 * Constructs a standardized error response structure with logging.
 */
export function buildErrorData<T = undefined>(message: string, data: T_ErrorResponse<T> = {}): T_ErrorResponseOutput<T> {
    const response: T_ErrorResponseOutput<T> = {
        success: false,
        message,
        timestamp: new Date(),
    };

    // Handle error instance (native Error or AxiosError)
    if (data.error instanceof Error) {
        response.error = data.error.message;

        if (CONFIG.showStack) {
            response.stackTrace = data.error.stack;
        }

        // If it's an AxiosError, extract more details
        if (isAxiosError(data.error)) {
            const axiosError = data.error;

            const status = axiosError.response?.status;
            const statusText = axiosError.response?.statusText;
            const axiosData = axiosError.response?.data;

            if (status) response.status = status;
            if (axiosData?.code) response.code = axiosData.code;
            if (axiosData?.message && !response.message) response.message = axiosData.message;

            // Include raw Axios response data in details if configured
            if (axiosData && typeof axiosData === 'object') {
                response.details = {
                    ...response.details,
                    ...axiosData,
                    statusText,
                };
            }
        }
    } else if (typeof data.error === 'string' || typeof data.error === 'object') {
        response.error = data.error;
    }

    // Optional fields
    if (data.status && !response.status) response.status = data.status || CONFIG.defaultErrorStatus;
    if (data.code && !response.code) {
        response.code = data.code;
    } else if (data.status && !response.code) {
        response.code = ErrorHandler.statusToCode(data.status) || ErrorCode.SERVER_ERROR;
    }
    if (data.requestId) response.requestId = data.requestId;
    if (CONFIG.showStack && data.stackTrace && !response.stackTrace) response.stackTrace = data.stackTrace;
    if (data.details) {
        response.details = {
            ...response.details,
            ...data.details,
        };
    }

    logError(message, response);
    return response;
}

/**
 * Extracts rate limit information from Axios error response headers.
 */
function extractRateLimitData(error: unknown): T_RateLimitInfo | undefined {
    if (!isAxiosError(error) || !error.response?.headers) return undefined;

    const headers = error.response.headers;
    const retryAfter = parseInt(headers['retry-after'] || headers['x-retry-after'], 10) || CONFIG.defaultRateLimitRetry;
    const remaining = parseInt(headers['x-ratelimit-remaining'] || headers['x-rate-limit-remaining'], 10) || 0;

    const rateLimitData: T_RateLimitInfo = {
        retryAfterSeconds: retryAfter,
        remaining,
    };

    const limit = headers['x-ratelimit-limit'] || headers['x-rate-limit-limit'];
    if (limit) rateLimitData.limit = parseInt(limit, 10);

    const resetTime = headers['x-ratelimit-reset'];
    if (resetTime) rateLimitData.resetTime = new Date(parseInt(resetTime, 10) * 1000);

    return rateLimitData;
}

/* -------------------------------------------------------------------------- */
/*                           Main Response Builders                           */
/* -------------------------------------------------------------------------- */
/**
 * Creates a success response as either NextResponse or plain object.
 */
export function createSuccess<T = undefined, B extends boolean = false>(
    message: string,
    payload?: T,
    data: T_BaseResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_SuccessResponseOutput<T>, B> {
    const response = buildSuccessData<T>(message, payload, data);
    if (asResponse) {
        return NextResponse.json(response, {
            status: data.status || CONFIG.defaultSuccessStatus,
        }) as T_ResponseOrJson<T_SuccessResponseOutput<T>, B>;
    }
    return response as T_ResponseOrJson<T_SuccessResponseOutput<T>, B>;
}

/**
 * Creates an error response as either NextResponse or plain object.
 */
export function createError<T = undefined, B extends boolean = false>(
    message: string,
    data: T_ErrorResponse<T> = {},
    asResponse?: B
): T_ResponseOrJson<T_ErrorResponseOutput<T>, B> {
    const payload = buildErrorData<T>(message, data);
    if (asResponse) {
        return NextResponse.json(payload, {
            status: data.status || CONFIG.defaultErrorStatus,
        }) as T_ResponseOrJson<T_ErrorResponseOutput<T>, B>;
    }
    return payload as T_ResponseOrJson<T_ErrorResponseOutput<T>, B>;
}

/**
 * Returns a standardized API response as a NextResponse object,
 * with appropriate HTTP status code based on the success or failure of the payload.
 */
export function createResponse<S = undefined, E = undefined>(data: T_ErrorResponseOutput<E> | T_SuccessResponseOutput<S>): NextResponse {
    const status = data.success ? CONFIG.defaultSuccessStatus : data.status || CONFIG.defaultErrorStatus;
    return NextResponse.json(data, { status });
}

/**
 * Handles any error type and returns a standardized error response.
 */
export function handleError(error: ErrorLike, defaultMessage?: string): NextResponse {
    const message = defaultMessage || ErrorHandler.getMessage(error);

    if (typeof error === 'number') {
        return createError(
            message,
            {
                status: error,
                code: ErrorHandler.statusToCode(error),
            },
            true
        );
    }

    if (error instanceof Error) {
        return createError(
            message,
            {
                error,
                stackTrace: error.stack,
                code: ErrorCode.SERVER_ERROR,
            },
            true
        );
    }

    if (typeof error === 'object' && error !== null && 'status' in error) {
        const status = error.status as number;
        return createError(
            message,
            {
                status,
                code: ErrorHandler.statusToCode(status) || ErrorCode.SERVER_ERROR,
                error,
            },
            true
        );
    }

    return createError(message, {}, true);
}

/* -------------------------------------------------------------------------- */
/*                             Specialized Helpers                            */
/* -------------------------------------------------------------------------- */
/**
 * Creates an error response specifically for AniList API errors.
 */
export function createAniListError<B extends boolean = false>(
    message: string,
    data: T_ErrorResponse<T_RateLimitInfo | undefined> = {},
    asResponse?: B
): T_ResponseOrJson<T_ErrorResponseOutput<T_RateLimitInfo | undefined>, B> {
    const rateLimitData = extractRateLimitData(data.error);

    if (isAxiosError(data.error) && data.error.response) {
        const { response } = data.error;
        const isRateLimit = response.status === HttpStatus.TOO_MANY_REQUESTS;
        message = response.data?.hint || response.data?.message || message;
        data.code = isRateLimit ? ErrorCode.RATE_LIMIT_EXCEEDED : data.code;
    }
    
    data.data = rateLimitData;

    // Fallback for non-Axios errors
    return createError(message, data, asResponse);
}

/**
 * Creates a validation error response with field-specific errors.
 */
export function createValidationError<T = undefined, B extends boolean = false>(
    message: string,
    validationErrors?: T,
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_ErrorResponseOutput<T>, B> {
    return createError(
        message,
        {
            status: HttpStatus.BAD_REQUEST,
            code: ErrorCode.VALIDATION_ERROR,
            data: validationErrors,
            requestId: data.requestId,
            details: {
                type: 'validation',
                fieldCount: validationErrors ? Object.keys(validationErrors).length : 0,
                ...data.details,
            },
        },
        asResponse
    );
}

/**
 * Creates a 404 Not Found error response.
 */
export function createNotFound<B extends boolean = false>(
    message: string,
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_ErrorResponseOutput, B> {
    return createError(
        message,
        {
            status: HttpStatus.NOT_FOUND,
            code: ErrorCode.NOT_FOUND,
            ...data,
        },
        asResponse
    );
}

/**
 * Creates a 401 Unauthorized error response.
 */
export function createUnauthorized<B extends boolean = false>(
    message: string,
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_ErrorResponseOutput, B> {
    return createError(
        message,
        {
            status: HttpStatus.UNAUTHORIZED,
            code: ErrorCode.ACCESS_DENIED,
            ...data,
        },
        asResponse
    );
}

/**
 * Creates a 403 Forbidden error response.
 */
export function createForbidden<B extends boolean = false>(
    message: string,
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_ErrorResponseOutput, B> {
    return createError(
        message,
        {
            status: HttpStatus.FORBIDDEN,
            code: ErrorCode.FORBIDDEN,
            ...data,
        },
        asResponse
    );
}

/**
 * Creates a 429 Rate Limit error response.
 */
export function createRateLimit<B extends boolean = false>(
    message: string,
    retryAfterSeconds: number = CONFIG.defaultRateLimitRetry,
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_ErrorResponseOutput<{ retryAfterSeconds: number }>, B> {
    return createError(
        message,
        {
            status: HttpStatus.TOO_MANY_REQUESTS,
            code: ErrorCode.RATE_LIMIT_EXCEEDED,
            data: { retryAfterSeconds },
            ...data,
        },
        asResponse
    );
}

/**
 * Creates a paginated success response with metadata.
 */
export function createPaginated<T, B extends boolean = false>(
    message: string,
    items: T[],
    pagination: T_PaginationMeta,
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_SuccessResponseOutput<T[]>, B> {
    return createSuccess(
        message,
        items,
        {
            meta: {
                pagination,
                count: items.length,
                ...data.meta,
            },
            requestId: data.requestId,
        },
        asResponse
    );
}

/**
 * Creates a batch operation response with success/failure statistics.
 */
export function createBatch<T, B extends boolean = false>(
    message: string,
    results: T_BatchOperationResult<T>[],
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_SuccessResponseOutput<T_BatchOperationResult<T>[]>, B> {
    const successful = results.filter((r) => r.success).length;
    const failed = results.length - successful;
    const successRate = results.length > 0 ? (successful / results.length) * 100 : 0;

    return createSuccess(
        message || `Batch operation completed: ${successful} successful, ${failed} failed`,
        results,
        {
            meta: {
                total: results.length,
                successful,
                failed,
                successRate,
                ...data.meta,
            },
            requestId: data.requestId,
        },
        asResponse
    );
}

/**
 * Creates a health check response for multiple services.
 */
export function createHealthCheck<B extends boolean = false>(
    message: string,
    services: Record<string, T_ServiceHealthStatus>,
    data: T_ErrorResponse = {},
    asResponse?: B
): T_ResponseOrJson<T_SuccessResponseOutput<Record<string, T_ServiceHealthStatus>>, B> {
    const allHealthy = Object.values(services).every((status) => status === 'healthy');
    const status = allHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    return createSuccess(
        message || (allHealthy ? 'All services healthy' : 'Some services unhealthy'),
        services,
        {
            status,
            meta: {
                overall: allHealthy ? 'healthy' : 'degraded',
                timestamp: new Date(),
                ...data.meta,
            },
            requestId: data.requestId,
        },
        asResponse
    );
}
