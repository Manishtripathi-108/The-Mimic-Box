import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

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
    message: string;
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
    data?: TRequest;
    retryCount?: number;
    retryDelay?: number;
    isExternalApiCall?: boolean;
    retryCondition?: (error: AxiosError<ErrorResponseOutput> | Error) => boolean;
    onStart?: () => Promise<void | boolean | TRequest> | void | boolean | TRequest;
    onSuccess?: (data: TResponse | null, response: AxiosResponse<SuccessResponseOutput<TResponse> | unknown>) => void;
    onError?: (error: AxiosError<ErrorResponseOutput> | Error | unknown, message: string) => void;
    onEnd?: () => void;
} & AxiosRequestConfig<TRequest>;
