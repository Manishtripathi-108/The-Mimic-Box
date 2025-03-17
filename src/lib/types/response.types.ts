import { AxiosError, AxiosResponse } from 'axios';

/** Shared base type for API responses */
interface BaseResponse {
    message: string;
    status?: number;
}

/** Input type for success responses */
export interface SuccessResponseInput<T = undefined> extends BaseResponse {
    payload?: T;
}

/** Output type for success responses */
export interface SuccessResponseOutput<T = undefined> {
    success: true;
    message?: string;
    payload?: T;
}

/** Input type for error responses */
export interface ErrorResponseInput<T> extends BaseResponse {
    error?: Record<string, unknown> | Error;
    extraData?: T;
}

/** Output type for error responses */
export interface ErrorResponseOutput<T = undefined> {
    success: false;
    message: string;
    error?: Record<string, unknown> | Error;
    extraData?: T;
}

export type MakeApiCallType<TRequest, TResponse> = {
    url: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: TRequest;
    headers?: Record<string, string>;
    params?: Record<string, unknown>;
    withCredentials?: boolean;
    withRetry?: boolean;
    retryCount?: number;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document' | 'stream';
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    onStart?: () => Promise<void | boolean> | void | boolean;
    onSuccess?: (data: TResponse, response: AxiosResponse<SuccessResponseOutput<TResponse>>) => void;
    onError?: (error: AxiosError<ErrorResponseOutput> | Error | unknown) => void;
    onEnd?: () => void;
};
