import { T_ErrorCode } from '@/lib/types/response.types';

export type ErrorLike =
    | string
    | number
    | Error
    | {
          code?: string;
          status?: number;
          message?: string;
          [key: string]: unknown;
      }
    | null
    | undefined;

export default class ErrorHandler {
    private static readonly ERROR_MESSAGES: Readonly<Record<T_ErrorCode, string>> = {
        invalid_grant: 'Your session has expired or is invalid. Please sign in again.',
        invalid_client: 'There was a problem verifying the app. Please try again later.',
        invalid_request: 'Something went wrong with the request. Please refresh and try again.',
        invalid_scope: 'The requested access is not allowed. Please check your permissions.',
        unauthorized_client: 'This app is not authorized to perform that action.',
        missing_parameters: 'Required information is missing. Please check and try again.',
        invalid_token: 'Your session token is invalid or expired. Please log in again.',
        access_denied: "You don't have permission to access this resource.",
        server_error: 'Something went wrong on our end. Please try again shortly.',
        temporarily_unavailable: 'The service is temporarily down. Please try again in a few minutes.',
        validation_error: 'The provided data is invalid. Please check and try again.',
        not_found: 'The requested resource was not found.',
        conflict: 'The request conflicts with the current state.',
        rate_limit_exceeded: 'Too many requests. Please try again later.',
        forbidden: 'Access to this resource is forbidden.',
        timeout: 'The request timed out. Please try again.',
        service_unavailable: 'The service is currently unavailable.',
    };

    private static readonly STATUS_MESSAGES: Readonly<Record<number, string>> = {
        400: "We couldn't process your request. Please check the details and try again.",
        401: "You're not logged in or your session has expired. Please sign in again.",
        403: "You don't have permission to access this. Contact support if this seems wrong.",
        404: "Oops! The page or resource you're looking for was not found.",
        409: 'The request conflicts with the current state of the resource.',
        429: "You've made too many requests. Please slow down and try again shortly.",
        500: "Something went wrong on our end. We're working on it — please try again soon.",
        502: "There's a temporary problem with the server. Please try again in a moment.",
        503: 'The service is currently unavailable. Please try again later.',
        504: 'The request timed out. Please check your connection and try again.',
    };

    private static readonly DEFAULT_MESSAGE = 'An unknown error occurred. Please try again later.';

    /**
     * Get human-readable message from any error-like input
     */
    public static getMessage(error: ErrorLike): string {
        if (!error) return this.DEFAULT_MESSAGE;

        if (typeof error === 'string') {
            return this.getMessageByCode(error);
        }

        if (typeof error === 'number') {
            return this.getMessageByStatus(error);
        }

        if (error instanceof Error) {
            return error.message || this.DEFAULT_MESSAGE;
        }

        if (typeof error === 'object') {
            if (error.code && this.isKnownCode(error.code)) {
                return this.getMessageByCode(error.code);
            }

            if (typeof error.status === 'number' && this.isKnownStatus(error.status)) {
                return this.getMessageByStatus(error.status);
            }

            if (typeof error.message === 'string') {
                return error.message;
            }
        }

        return this.DEFAULT_MESSAGE;
    }

    /**
     * Get message by specific known error code
     */
    public static getMessageByCode(code: string): string {
        return this.ERROR_MESSAGES[code as T_ErrorCode] ?? this.DEFAULT_MESSAGE;
    }

    /**
     * Get message by known HTTP status
     */
    public static getMessageByStatus(status: number): string {
        return this.STATUS_MESSAGES[status] ?? this.DEFAULT_MESSAGE;
    }

    /**
     * Check if the provided code is a known error code
     */
    public static isKnownCode(code: string): code is T_ErrorCode {
        return code in this.ERROR_MESSAGES;
    }

    /**
     * Check if the provided status is a known status code
     */
    public static isKnownStatus(status: number): boolean {
        return status in this.STATUS_MESSAGES;
    }

    /**
     * Map common HTTP status codes to standardized error codes
     */
    public static statusToCode(status: number): T_ErrorCode | undefined {
        const statusCodeMap: Record<number, T_ErrorCode> = {
            400: 'invalid_request',
            401: 'invalid_token',
            403: 'forbidden',
            404: 'not_found',
            409: 'conflict',
            429: 'rate_limit_exceeded',
            500: 'server_error',
            503: 'service_unavailable',
            504: 'timeout',
        };
        return statusCodeMap[status];
    }
}
