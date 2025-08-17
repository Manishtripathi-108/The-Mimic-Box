'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import axios, { AxiosResponse } from 'axios';

import useUploadProgress from '@/hooks/useUploadProgress';
import { T_MakeApiCall, T_SuccessResponseOutput } from '@/lib/types/response.types';
import { isDev } from '@/lib/utils/core.utils';

const ENABLE_DEBUG_LOGS = isDev;
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const useSafeApiCall = <TReq = unknown, TRes = unknown>(apiClient: typeof axios = axios) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TRes | null>(null);

    const { uploadState, resetUploadProgress, onUploadProgress } = useUploadProgress();

    const isMounted = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const cancelRequest = useCallback((reason = 'Request cancelled') => {
        abortControllerRef.current?.abort(reason);
    }, []);

    const performRequestWithRetry = useCallback(
        async (config: T_MakeApiCall<TReq, TRes>) => {
            const {
                onStart,
                onSuccess,
                onError,
                onEnd,
                isExternalApiCall = false,
                retryCount = 0,
                retryDelay = 500,
                retryCondition,
                ...requestConfig
            } = config;

            let attempts = 0;

            try {
                if (onStart) {
                    const startResult = await onStart();
                    if (startResult === false) return { data: null, error: null };
                    if (startResult && !requestConfig.data && startResult !== true) {
                        requestConfig.data = startResult;
                    }
                }

                while (attempts <= retryCount) {
                    if (!isMounted.current) break;

                    abortControllerRef.current = new AbortController();
                    requestConfig.signal = abortControllerRef.current.signal;
                    requestConfig.onUploadProgress ||= onUploadProgress;

                    try {
                        if (ENABLE_DEBUG_LOGS) console.log(`[useSafeApiCall] Attempt ${attempts + 1}`, requestConfig);
                        const response = await apiClient.request(requestConfig);

                        if (!isMounted.current) return { data: null, error: null };

                        if (isExternalApiCall) {
                            (onSuccess as (res: AxiosResponse<TRes>) => void)?.(response);
                            return { data: response.data as TRes, error: null };
                        }

                        const successRes = response.data as T_SuccessResponseOutput<TRes>;

                        if (successRes.success) {
                            setData(successRes.payload);
                            (onSuccess as (data: TRes, res: AxiosResponse<T_SuccessResponseOutput<TRes>>) => void)?.(successRes.payload, response);
                            return { data: successRes.payload, error: null };
                        }

                        throw new Error(successRes.message || 'Unexpected response');
                    } catch (err) {
                        if (!isMounted.current) return { data: null, error: null };

                        attempts++;
                        const isFinal = attempts > retryCount;

                        let message = 'An error occurred';
                        if (axios.isAxiosError(err)) {
                            if (err.name === 'CanceledError') {
                                if (ENABLE_DEBUG_LOGS) console.warn('Request cancelled:', err.message);
                                return { data: null, error: null };
                            }
                            message = err.response?.data?.message || err.message || message;
                        } else if (err instanceof Error) {
                            message = err.message;
                        }

                        setError(message);
                        onError?.(err, message);
                        if (ENABLE_DEBUG_LOGS) console.error(`[useSafeApiCall] Error attempt ${attempts}:`, err);

                        const shouldRetry = retryCondition && (axios.isAxiosError(err) || err instanceof Error) ? retryCondition(err) : true;
                        if (!shouldRetry || isFinal) return { data: null, error: message };

                        const delay = retryDelay * 2 ** (attempts - 1);
                        await sleep(delay + Math.random() * 100);
                    }
                }
            } catch (initErr) {
                console.error('[useSafeApiCall] Initialization error:', initErr);
                setError('Initialization failed');
                onError?.(initErr, 'Initialization failed');
            } finally {
                onEnd?.();
                abortControllerRef.current = null;
            }

            return { data: null, error: null };
        },
        [apiClient, onUploadProgress]
    );

    const makeApiCall = useCallback(
        async (config: T_MakeApiCall<TReq, TRes>) => {
            setIsPending(true);
            setError(null);
            setData(null);

            const result = await performRequestWithRetry(config);

            resetUploadProgress();
            setIsPending(false);

            if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Request complete');
            return result;
        },
        [performRequestWithRetry, resetUploadProgress]
    );

    const makeParallelApiCalls = useCallback(
        async (configs: Array<T_MakeApiCall<TReq, TRes>>): Promise<TRes[]> => {
            setIsPending(true);
            setError(null);

            const settledResults = await Promise.allSettled(configs.map((config) => performRequestWithRetry(config)));

            const results = settledResults.map((res) => {
                if (res.status === 'fulfilled') return res.value;
                return { data: null, error: res.reason instanceof Error ? res.reason.message : String(res.reason) };
            });

            resetUploadProgress();
            setIsPending(false);

            return results
                .map((res) => {
                    if (res.error) {
                        setError(res.error);
                        if (ENABLE_DEBUG_LOGS) console.error('[useSafeApiCall] Parallel request error:', res.error);
                    }
                    if (res.data) {
                        setData(res.data);
                        if (ENABLE_DEBUG_LOGS) console.log('[useSafeApiCall] Parallel request success:', res.data);
                    }
                    return res.data;
                })
                .filter((res) => res !== null);
        },
        [performRequestWithRetry, resetUploadProgress]
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
        makeParallelApiCalls,
        cancelRequest,
    };
};

export default useSafeApiCall;
