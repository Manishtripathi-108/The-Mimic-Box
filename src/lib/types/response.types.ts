import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// Shared base type for API responses
type BaseResponse = {
    message: string;
    status?: number;
};

// Type for success responses
export type SuccessResponseInput<T = undefined> = BaseResponse & { payload?: T };
export type SuccessResponseOutput<T = undefined> = {
    success: true;
    message: string;
    payload: T;
};

// Type for error responses
export type ErrorResponseInput<T> = BaseResponse & {
    error?: Record<string, unknown> | Error;
    extraData?: T;
};
export type ErrorResponseOutput<T = undefined> = {
    success: false;
    message: string;
    error?: Record<string, unknown> | Error | null;
    extraData: T;
};

// Type for API call responses
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
