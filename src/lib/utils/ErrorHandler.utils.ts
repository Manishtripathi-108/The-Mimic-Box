import { ErrorCodes } from '@/lib/types/response.types';

type ErrorLike =
    | string
    | {
          code?: string;
          status?: number;
          message?: string;
      }
    | null
    | undefined;

export default class ErrorHandler {
    private static readonly ERROR_MESSAGES: Record<ErrorCodes, string> = {
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
    };

    private static readonly STATUS_MESSAGES: Record<number, string> = {
        400: "We couldn't process your request. Please check the details and try again.",
        401: "You're not logged in or your session has expired. Please sign in again.",
        403: "You don't have permission to access this. Contact support if this seems wrong.",
        404: "Oops! The page or resource you're looking for was not found.",
        429: "You've made too many requests. Please slow down and try again shortly.",
        500: "Something went wrong on our end. We're working on it — please try again soon.",
        502: "There's a temporary problem with the server. Please try again in a moment.",
        503: 'The service is currently unavailable. Please try again later.',
        504: 'The request timed out. Please check your connection and try again.',
    };

    private static readonly DEFAULT_MESSAGE = 'An unknown error occurred. Please try again later.';

    /**
     * Main interface method to get human-readable error message.
     */
    public static getMessage(error: ErrorLike): string {
        if (!error) return this.DEFAULT_MESSAGE;

        if (typeof error === 'string') {
            return this.getMessageByCode(error);
        }

        if (typeof error === 'number') {
            return this.getMessageByStatus(error);
        }

        if (typeof error === 'object' && error !== null) {
            if (error.code && this.ERROR_MESSAGES[error.code as ErrorCodes]) {
                return this.ERROR_MESSAGES[error.code as ErrorCodes];
            }

            if (typeof error.status === 'number' && this.STATUS_MESSAGES[error.status]) {
                return this.STATUS_MESSAGES[error.status];
            }

            if (error.message && typeof error.message === 'string') {
                return error.message;
            }
        }

        return this.DEFAULT_MESSAGE;
    }

    /**
     * Returns a message by matching a known error code.
     */
    public static getMessageByCode(code: string): string {
        return this.ERROR_MESSAGES[code as ErrorCodes] ?? this.DEFAULT_MESSAGE;
    }

    /**
     * Returns a message by matching an HTTP status code.
     */
    public static getMessageByStatus(status: number): string {
        return this.STATUS_MESSAGES[status] ?? this.DEFAULT_MESSAGE;
    }

    /**
     * Checks if a code exists in the defined error list.
     */
    public static isKnownCode(code: string): boolean {
        return code in this.ERROR_MESSAGES;
    }

    /**
     * Checks if a status exists in the defined status list.
     */
    public static isKnownStatus(status: number): boolean {
        return status in this.STATUS_MESSAGES;
    }
}
