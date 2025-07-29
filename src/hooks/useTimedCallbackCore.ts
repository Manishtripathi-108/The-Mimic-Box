'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Supported timing modes for the callback */
type T_Mode = 'debounce' | 'throttle';

/** Configuration options for timing behavior */
type T_Options = {
    /** Execute function on leading edge of delay */
    leading?: boolean;
    /** Execute function on trailing edge of delay */
    trailing?: boolean;
};

/** Return type for the timed callback hook */
type T_TimedCallbackReturn<T extends (...args: any[]) => any> = {
    /** The wrapped callback function with timing behavior */
    callback: (...args: Parameters<T>) => void;
    /** Cancel any pending execution */
    cancel: () => void;
    /** Immediately flush/execute any pending call */
    flush: () => void;
    /** Whether there's a pending execution */
    isPending: boolean;
};

/**
 * Core hook for creating debounced or throttled callbacks with React hooks.
 *
 * This hook provides both debounce and throttle functionality with configurable
 * leading/trailing edge execution. It maintains proper React patterns and provides
 * utilities for managing the timed execution.
 *
 * @template T - The function type to be wrapped
 * @param fn - The function to debounce or throttle
 * @param delay - Delay in milliseconds
 * @param mode - Either 'debounce' or 'throttle'
 * @param options - Configuration for leading/trailing execution
 * @returns Object containing the wrapped callback and control functions
 *
 * @example
 * ```tsx
 * // Debounce search input
 * const { callback: debouncedSearch, isPending } = useTimedCallbackCore(
 *   (query: string) => fetchResults(query),
 *   300,
 *   'debounce',
 *   { trailing: true }
 * );
 *
 * // Throttle scroll handler
 * const { callback: throttledScroll } = useTimedCallbackCore(
 *   () => updateScrollPosition(),
 *   100,
 *   'throttle',
 *   { leading: true, trailing: false }
 * );
 * ```
 */
const useTimedCallbackCore = <T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    mode: T_Mode,
    options: T_Options = {}
): T_TimedCallbackReturn<T> => {
    const { leading = false, trailing = true } = options;

    // Refs for managing state without causing re-renders
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastArgsRef = useRef<Parameters<T> | null>(null);
    const leadingCalledRef = useRef(false);
    const fnRef = useRef(fn);

    // State for tracking pending execution
    const [isPending, setIsPending] = useState(false);

    // Keep function reference current
    fnRef.current = fn;

    /**
     * Cancels any pending execution and resets state
     */
    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        lastArgsRef.current = null;
        leadingCalledRef.current = false;
        setIsPending(false);
    }, []);

    /**
     * Immediately executes any pending call with the last arguments
     */
    const flush = useCallback(() => {
        if (timeoutRef.current && lastArgsRef.current) {
            fnRef.current(...lastArgsRef.current);
            cancel();
        }
    }, [cancel]);

    /**
     * The main callback function with timing behavior applied
     */
    const callback = useCallback(
        (...args: Parameters<T>) => {
            const shouldCallLeading = leading && !timeoutRef.current && !leadingCalledRef.current;

            if (shouldCallLeading) {
                fnRef.current(...args);
                leadingCalledRef.current = true;
            }

            if (mode === 'debounce') {
                // Clear existing timeout for debounce
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                lastArgsRef.current = args;

                // Set up trailing execution or clear pending state
                if (trailing || !leadingCalledRef.current) {
                    setIsPending(true);
                    timeoutRef.current = setTimeout(() => {
                        if (trailing && lastArgsRef.current) {
                            fnRef.current(...lastArgsRef.current);
                        }
                        cancel();
                    }, delay);
                } else {
                    setIsPending(false);
                }
            } else if (mode === 'throttle') {
                // If already throttling, just update args for potential trailing call
                if (timeoutRef.current) {
                    if (trailing) lastArgsRef.current = args;
                    return;
                }

                // Execute immediately for throttle
                if (!shouldCallLeading) {
                    fnRef.current(...args);
                }

                setIsPending(true);
                timeoutRef.current = setTimeout(() => {
                    timeoutRef.current = null;
                    leadingCalledRef.current = false;
                    setIsPending(false);

                    // Execute trailing call if needed
                    if (trailing && lastArgsRef.current) {
                        callback(...lastArgsRef.current);
                        lastArgsRef.current = null;
                    }
                }, delay);
            }
        },
        [delay, mode, leading, trailing, cancel]
    );

    // Cleanup on unmount
    useEffect(() => cancel, [cancel]);

    return {
        callback,
        cancel,
        flush,
        isPending,
    };
};

export default useTimedCallbackCore;
