'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import axios, { AxiosResponse } from 'axios';

import useUploadProgress from '@/hooks/useUploadProgress';
import { MakeApiCallType, SuccessResponseOutput } from '@/lib/types/response.types';

const ENABLE_DEBUG_LOGS = process.env.NODE_ENV === 'development';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const useSafeApiCall = <TReq = unknown, TRes = unknown>(apiClient: typeof axios = axios) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TRes | null>(null);

    const { uploadState, resetUploadProgress, onUploadProgress: onProgress } = useUploadProgress();

    const isMounted = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const cancelRequest = useCallback((reason = 'Request cancelled') => {
        abortControllerRef.current?.abort(reason);
    }, []);

    const makeApiCall = useCallback(
        async (config: MakeApiCallType<TReq, TRes>) => {
            const {
                onStart,
                onSuccess,
                isExternalApiCall = false,
                retryCount = 0,
                retryDelay = 500,
                retryCondition,
                onError,
                onEnd,
                ...requestConfig
            } = config;

            setIsPending(true);
            setError(null);
            setData(null);
            let attempts = 0;

            try {
                if (onStart) {
                    if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] onStart triggered');
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
                    if (!isMounted.current) break;
                    try {
                        abortControllerRef.current = new AbortController();
                        requestConfig.signal = abortControllerRef.current.signal;
                        requestConfig.onUploadProgress = requestConfig.onUploadProgress || onProgress;

                        if (ENABLE_DEBUG_LOGS) console.log(`[useSafeApiCall] Attempt ${attempts + 1}`, requestConfig);

                        const response = await apiClient.request(requestConfig);

                        if (!isMounted.current) return;

                        if (isExternalApiCall) {
                            (onSuccess as (res: AxiosResponse<TRes>) => void)?.(response);
                        } else {
                            const successRes = response.data as SuccessResponseOutput<TRes>;

                            if (successRes.success) {
                                setData(successRes.payload);
                                (onSuccess as (data: TRes, response: AxiosResponse<SuccessResponseOutput<TRes>>) => void)?.(
                                    successRes.payload,
                                    response
                                );
                            } else {
                                throw new Error(successRes.message || 'Unexpected response');
                            }
                        }

                        return;
                    } catch (err) {
                        if (!isMounted.current) return;

                        attempts++;
                        const isFinalAttempt = attempts > retryCount;

                        let errorMessage = 'An error occurred';
                        if (axios.isAxiosError(err)) {
                            if (err.name === 'CanceledError') {
                                if (ENABLE_DEBUG_LOGS) console.warn('Request cancelled:', err.message);
                                return;
                            }

                            errorMessage = err.response?.data?.message || err.message || errorMessage;
                        } else if (err instanceof Error) {
                            errorMessage = err.message;
                        }

                        setError(errorMessage);
                        onError?.(err, errorMessage);

                        if (ENABLE_DEBUG_LOGS) console.error(`[useSafeApiCall] Error on attempt ${attempts}:`, err);

                        const shouldRetry = retryCondition && (axios.isAxiosError(err) || err instanceof Error) ? retryCondition(err) : true;
                        if (!shouldRetry || isFinalAttempt) break;

                        const delay = retryDelay * 2 ** (attempts - 1);
                        const jitter = Math.random() * 100;
                        await sleep(delay + jitter);
                    }
                }
            } catch (initErr) {
                console.error('[useSafeApiCall] Error during initialization:', initErr);
                setError('Initialization failed');
                onError?.(initErr, 'Initialization failed');
            } finally {
                if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Request completed');
                abortControllerRef.current = null;
                resetUploadProgress();
                setIsPending(false);
                onEnd?.();
            }
        },
        [apiClient, resetUploadProgress, onProgress]
    );

    useEffect(() => {
        isMounted.current = true;
        if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Mounted');

        return () => {
            isMounted.current = false;
            cancelRequest('Component unmounted');
            if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Unmounted');
        };
    }, [cancelRequest]);

    return {
        isPending,
        uploadState,
        error,
        data,
        makeApiCall,
        cancelRequest,
    };
};

export default useSafeApiCall;
