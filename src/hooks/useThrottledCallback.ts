'use client';

import useTimedCallbackCore from './useTimedCallbackCore';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Creates a throttled version of a callback function. The returned function will
 * only call the original function at most once per `delay` milliseconds.
 *
 * @param fn The function to throttle
 * @param delay The delay in milliseconds
 * @param options - Configuration for leading/trailing execution
 * @returns A throttled version of the original function
 *
 * @example
 * ```tsx
 * const { callback, cancel } = useThrottledCallback(() => {
 *     console.log('Throttled!');
 * }, 300);
 * ```
 *
 * This hook provides a throttled callback that can be used in React components to limit the rate at which a function can be executed, such as during scroll or resize events.
 * It returns the throttled function, a cancel function to clear any pending execution, and a
 * flush function to immediately execute the last call.
 * The `isPending` flag indicates if there is a pending execution.
 * It supports both leading and trailing edge execution based on the provided options.
 */
const useThrottledCallback = <T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    options?: {
        leading?: boolean;
        trailing?: boolean;
    }
) => {
    return useTimedCallbackCore(fn, delay, 'throttle', options);
};

export default useThrottledCallback;
