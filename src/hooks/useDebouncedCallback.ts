'use client';

import useTimedCallbackCore from './useTimedCallbackCore';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Creates a debounced version of a function that delays invoking function until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @template T The function type to be wrapped
 * @param fn The function to debounce
 * @param delay The number of milliseconds to delay
 * @param options Configuration for leading edge execution and trailing edge execution
 * @returns Object containing the debounced callback and control functions
 *
 * @example
 * ```tsx
 * const { callback, cancel } = useDebouncedCallback(() => {
 *     console.log('Debounced!');
 * }, 300);
 * ```
 *
 * This hook provides a debounced callback that can be used in React components to prevent excessive function calls, such as during user input or window resizing events.
 * It returns the debounced function, a cancel function to clear any pending execution, and a flush function to immediately execute the last call.
 * The `isPending` flag indicates if there is a pending execution.
 * It supports both leading and trailing edge execution based on the provided options.
 */
const useDebouncedCallback = <T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    options?: {
        leading?: boolean;
        trailing?: boolean;
    }
) => {
    return useTimedCallbackCore(fn, delay, 'debounce', options);
};

export default useDebouncedCallback;
