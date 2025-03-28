import { useCallback, useEffect, useRef, useState } from 'react';

import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';

import { MakeApiCallType, SuccessResponseOutput } from '@/lib/types/response.types';

const ENABLE_DEBUG_LOGS = process.env.NODE_ENV === 'development';

function useSafeAwaitClient<TReq = unknown, TRes = unknown>({
    apiClient = axios,
    retryCount = 0,
}: {
    apiClient?: typeof axios;
    retryCount?: number;
} = {}) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TRes | null>(null);

    const isMounted = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const cancelRequest = useCallback((reason = 'Request cancelled') => {
        abortControllerRef.current?.abort(reason);
    }, []);

    const makeApiCall = useCallback(
        async ({
            url,
            method = 'get',
            data = undefined,
            params = undefined,
            headers = {},
            responseType = 'json',
            onUploadProgress,
            onStart,
            onSuccess,
            onError,
            onEnd,
        }: MakeApiCallType<TReq, TRes>) => {
            setIsPending(true);
            setError(null);
            let attempts = 0;

            try {
                if (onStart) {
                    if (ENABLE_DEBUG_LOGS) console.log('[useSafeAwaitClient] Executing onStart callback');
                    const startResult = await onStart();
                    if (startResult === false) {
                        setIsPending(false);
                        return;
                    }
                }

                while (attempts <= retryCount) {
                    try {
                        abortControllerRef.current = new AbortController();
                        if (ENABLE_DEBUG_LOGS)
                            console.log('[useSafeAwaitClient] Making API call:', { url, method, data, params, headers, responseType });

                        const response: AxiosResponse<SuccessResponseOutput<TRes>> = await apiClient({
                            url,
                            method,
                            data,
                            params,
                            headers,
                            responseType,
                            signal: abortControllerRef.current.signal,
                            onUploadProgress,
                        } as AxiosRequestConfig);

                        if (ENABLE_DEBUG_LOGS) console.log('[useSafeAwaitClient] API call successful:', response);

                        if (isMounted.current) {
                            if (response.data.success === true) {
                                setData(response.data.payload || null);
                                if (onSuccess && response.data.payload) {
                                    onSuccess(response.data.payload, response);
                                }
                            } else {
                                throw new Error(response.data.message);
                            }
                        }
                        return;
                    } catch (err) {
                        attempts++;
                        if (!isMounted.current) return;

                        let errorMessage = 'An error occurred';
                        if (isAxiosError(err)) {
                            if (err.name === 'CanceledError') {
                                console.warn('Request cancelled:', err.message);
                            } else {
                                errorMessage = err.response?.data?.message || err.message || errorMessage;
                            }
                        } else if (err instanceof Error) {
                            errorMessage = err.message;
                        }

                        setError(errorMessage);
                        console.error('[useSafeAwaitClient] Request failed:', err);
                        onError?.(err);

                        if (attempts > retryCount) break;
                    } finally {
                        abortControllerRef.current = null;
                        setIsPending(false);
                        onEnd?.();
                    }
                }
            } catch (startError) {
                console.error('[useSafeAwaitClient] Error in onStart callback:', startError);
                setError('An error occurred during initialization');
            }
        },
        [apiClient, retryCount]
    );

    useEffect(() => {
        isMounted.current = true;
        if (ENABLE_DEBUG_LOGS) console.log('[useSafeAwaitClient] Component mounted');

        return () => {
            isMounted.current = false;
            cancelRequest('Component unmounted');
        };
    }, [cancelRequest]);

    return { isPending, error, data, makeApiCall, cancelRequest };
}

export default useSafeAwaitClient;
