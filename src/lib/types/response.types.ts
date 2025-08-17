import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Error codes that can be used throughout the system
export type T_ErrorCode =
    | 'invalid_grant'
    | 'invalid_client'
    | 'invalid_request'
    | 'invalid_scope'
    | 'unauthorized_client'
    | 'missing_parameters'
    | 'invalid_token'
    | 'access_denied'
    | 'server_error'
    | 'temporarily_unavailable'
    | 'validation_error'
    | 'not_found'
    | 'conflict'
    | 'rate_limit_exceeded'
    | 'forbidden'
    | 'timeout'
    | 'service_unavailable';

/**
 * Common response metadata used across all response types
 */
export type T_BaseResponse = {
    status?: number;
    meta?: Record<string, unknown>;
    requestId?: string;
};

/**
 * Format for error API responses
 */
export type T_ErrorResponse<T = undefined> = T_BaseResponse & {
    error?: string | Record<string, unknown> | Error | null | unknown;
    code?: T_ErrorCode;
    stackTrace?: string;
    data?: T;
    details?: Record<string, unknown>;
};

/**
 * Final structured success output sent to the client
 */
export type T_SuccessResponseOutput<T = undefined> = {
    success: true;
    message: string;
    payload: T;
    meta?: Record<string, unknown>;
    timestamp: Date;
    requestId?: string;
};

/**
 * Final structured error output sent to the client
 */
export type T_ErrorResponseOutput<T = undefined> = {
    success: false;
    message: string;
    status?: number;
    data?: T;
    code?: T_ErrorCode;
    timestamp: Date;
    requestId?: string;
    stackTrace?: string;
    meta?: Record<string, unknown>;
    details?: Record<string, unknown>;
    error?: Record<string, unknown> | Error | string | null | unknown;
};

/**
 * Rate limiting details for throttled clients
 */
export type T_RateLimitInfo = {
    retryAfterSeconds: number;
    remaining: number;
    resetTime?: Date;
    limit?: number;
};

/**
 * Standard pagination metadata for paged results
 */
export type T_PaginationMeta = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

/**
 * Result type for batch operations (e.g., bulk uploads)
 */
export type T_BatchOperationResult<T> = {
    success: boolean;
    data?: T;
    errorMessage?: string;
};

export type T_ServiceHealthStatus = 'healthy' | 'unhealthy' | 'degraded';

// Type for API call responses
type BaseApiCallType<TReq> = {
    data?: TReq;
    retryCount?: number;
    retryDelay?: number;
    retryCondition?: (err: AxiosError<T_ErrorResponseOutput> | Error) => boolean;
    onStart?: () => Promise<void | boolean | TReq> | void | boolean | TReq;
    onError?: (err: AxiosError<T_ErrorResponseOutput> | Error | unknown, message: string) => void;
    onEnd?: () => void;
} & AxiosRequestConfig<TReq>;

type T_ExternalApiCall<TReq, TRes> = BaseApiCallType<TReq> & {
    isExternalApiCall: true;
    onSuccess?: (res: AxiosResponse<TRes>) => void;
};

type T_InternalApiCall<TReq, TRes> = BaseApiCallType<TReq> & {
    isExternalApiCall?: false;
    onSuccess?: (data: TRes, res: AxiosResponse<T_SuccessResponseOutput<TRes>>) => void;
};

export type T_MakeApiCall<TReq, TRes> = T_ExternalApiCall<TReq, TRes> | T_InternalApiCall<TReq, TRes>;
