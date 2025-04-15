// useSafeApiCall.ts
import { useCallback, useEffect, useRef, useState } from 'react';

import axios, { AxiosResponse, isAxiosError } from 'axios';

import { MakeApiCallType, SuccessResponseOutput } from '@/lib/types/response.types';

const ENABLE_DEBUG_LOGS = process.env.NODE_ENV === 'development';

function useSafeApiCall<TReq = unknown, TRes = unknown>({
    apiClient = axios,
    retryCount = 0,
    isExternalApiCall = false,
}: {
    apiClient?: typeof axios;
    retryCount?: number;
    isExternalApiCall?: boolean;
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
        async ({ onStart, onSuccess, onError, onEnd, ...requestConfig }: MakeApiCallType<TReq, TRes>) => {
            setIsPending(true);
            setError(null);
            let attempts = 0;

            try {
                if (onStart) {
                    if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Executing onStart callback');
                    const startResult = await onStart();
                    if (startResult === false) {
                        setIsPending(false);
                        return;
                    }
                    if (startResult && !requestConfig.data && startResult !== true) {
                        requestConfig.data = startResult;
                    }
                }

                while (attempts <= retryCount) {
                    try {
                        abortControllerRef.current = new AbortController();
                        if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Making API call:', requestConfig);

                        const response: AxiosResponse<SuccessResponseOutput<TRes>> = await apiClient(requestConfig);

                        if (!isMounted.current) return;

                        if (isExternalApiCall) {
                            onSuccess?.(null, response);
                        } else if (response.data.success === true) {
                            const payload = response.data.payload ?? null;
                            setData(payload);
                            onSuccess?.(payload, response);
                        } else {
                            throw new Error(response.data.message || 'An error occurred');
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
                        console.error('[useSafeApiCall] Request failed:', err);
                        onError?.(err, errorMessage);

                        if (attempts > retryCount) break;
                    } finally {
                        abortControllerRef.current = null;
                        setIsPending(false);
                        onEnd?.();
                    }
                }
            } catch (startError) {
                console.error('[useSafeApiCall] Error in onStart callback:', startError);
                setError('An error occurred during initialization');
                onError?.(startError, 'An error occurred during initialization');
                setIsPending(false);
            }
        },
        [apiClient, retryCount, isExternalApiCall]
    );

    useEffect(() => {
        isMounted.current = true;
        if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Component mounted');
        return () => {
            isMounted.current = false;
            cancelRequest('Component unmounted');
        };
    }, [cancelRequest]);

    return { isPending, error, data, makeApiCall, cancelRequest };
}

export default useSafeApiCall;
