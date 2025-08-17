'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import useDebouncedCallback from '@/hooks/useDebouncedCallback';
import { isDev } from '@/lib/utils/core.utils';

type RectReadOnly = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}>;

type DebounceOptions = number | { scroll?: number; resize?: number };

interface UseMeasureOptions {
    debounce?: DebounceOptions;
    scroll?: boolean;
    offsetSize?: boolean;
    polyfill?: typeof ResizeObserver;
    onResize?: (bounds: RectReadOnly) => void;
}

type HTMLOrSVG = HTMLElement | SVGElement;

type UseMeasureReturn = [ref: (el: HTMLOrSVG | null) => void, bounds: RectReadOnly, forceRefresh: () => void];

const defaultRect: RectReadOnly = Object.freeze({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
});

const rectKeys: (keyof RectReadOnly)[] = ['x', 'y', 'width', 'height', 'top', 'right', 'bottom', 'left'];

/**
 * Compares two DOMRect objects for equality with a small tolerance for floating point precision.
 * @param a - First rect to compare
 * @param b - Second rect to compare
 * @returns True if the rects are equal within tolerance, false otherwise
 */
const areRectsEqual = (a: RectReadOnly, b: RectReadOnly): boolean => {
    return rectKeys.every((key) => Math.abs(a[key] - b[key]) < 0.001);
};

/**
 * Gets the bounding rectangle and dimensions of an HTML or SVG element.
 * @param el - The element to measure
 * @param offsetSize - Whether to use offsetWidth/offsetHeight for HTML elements instead of getBoundingClientRect
 * @returns A frozen object containing the element's bounds and dimensions
 */
const getElementBounds = (el: HTMLOrSVG, offsetSize: boolean): RectReadOnly => {
    const rect = el.getBoundingClientRect();
    const base = {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
    };

    return Object.freeze(offsetSize && el instanceof HTMLElement ? { ...base, width: el.offsetWidth, height: el.offsetHeight } : base);
};

/**
 * Finds all scrollable container elements in the parent hierarchy of the given element.
 * @param el - The element to start searching from
 * @returns A Set of elements that have scrollable overflow
 */
const findScrollableContainers = (el: HTMLOrSVG): Set<HTMLOrSVG> => {
    const containers = new Set<HTMLOrSVG>();
    let current = el;

    while (current && current !== document.body) {
        try {
            const { overflow, overflowX, overflowY } = getComputedStyle(current);
            if ([overflow, overflowX, overflowY].some((p) => ['auto', 'scroll'].includes(p))) {
                containers.add(current);
            }
            current = current.parentElement!;
        } catch {
            break;
        }
    }

    return containers;
};

/**
 * Sets up a ResizeObserver to watch for size changes on an element.
 * @param el - The element to observe
 * @param callback - Function to call when the element resizes
 * @param polyfill - Optional ResizeObserver polyfill
 * @returns The ResizeObserver instance or null if not supported
 */
const useResizeObserver = (el: HTMLOrSVG | null, callback: () => void, polyfill?: typeof ResizeObserver): ResizeObserver | null => {
    const ResizeObs = useMemo(() => {
        if (polyfill) return polyfill;
        if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
            if (isDev) throw new Error('ResizeObserver not supported. Provide a polyfill.');
            else return null;
        }
        return window.ResizeObserver;
    }, [polyfill]);

    const observer = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        if (!el || !ResizeObs) return;
        observer.current = new ResizeObs(callback);
        observer.current.observe(el);
        return () => observer.current?.disconnect();
    }, [el, ResizeObs, callback]);

    return observer.current;
};

/**
 * A React hook that measures the bounds of an element and tracks changes.
 * Provides a ref callback to attach to an element, the current bounds, and a manual refresh function.
 *
 * @param options - Configuration options for the measurement behavior
 * @param options.debounce - Debounce delay in milliseconds for resize/scroll events (default: 0)
 * @param options.scroll - Whether to listen for scroll events on parent containers (default: false)
 * @param options.offsetSize - Whether to use offsetWidth/offsetHeight for HTML elements (default: false)
 * @param options.polyfill - ResizeObserver polyfill to use if native is not available
 * @param options.onResize - Callback function called when bounds change
 * @returns A tuple containing [refCallback, bounds, forceRefresh]
 *
 * @example
 * ```tsx
 * const [measureRef, bounds] = useMeasure();
 *
 * return (
 *   <div ref={measureRef}>
 *     Size: {bounds.width} x {bounds.height}
 *   </div>
 * );
 * ```
 */
const useMeasure = (options: UseMeasureOptions = {}): UseMeasureReturn => {
    const { debounce = 0, scroll = false, offsetSize = false, polyfill, onResize } = options;
    const [bounds, setBounds] = useState<RectReadOnly>(defaultRect);
    const elementRef = useRef<HTMLOrSVG | null>(null);
    const lastBoundsRef = useRef<RectReadOnly>(defaultRect);

    const { scroll: scrollDelay, resize: resizeDelay } =
        typeof debounce === 'number' ? { scroll: debounce, resize: debounce } : { scroll: debounce.scroll ?? 0, resize: debounce.resize ?? 0 };

    const measure = useCallback(() => {
        const el = elementRef.current;
        if (!el) return;

        const next = getElementBounds(el, offsetSize);
        if (!areRectsEqual(lastBoundsRef.current, next)) {
            lastBoundsRef.current = next;
            setBounds(next);
            onResize?.(next);
        }
    }, [offsetSize, onResize]);

    const { callback: scrollHandler } = useDebouncedCallback(measure, scrollDelay);
    const { callback: resizeHandler } = useDebouncedCallback(measure, resizeDelay);

    const setupOrientationListener = useCallback(() => {
        const handler = () => requestAnimationFrame(resizeHandler);

        if ('orientation' in screen && 'addEventListener' in screen.orientation) {
            screen.orientation.addEventListener('change', handler);
            return () => screen.orientation.removeEventListener('change', handler);
        } else {
            window.addEventListener('orientationchange', handler);
            return () => window.removeEventListener('orientationchange', handler);
        }
    }, [resizeHandler]);

    useEffect(() => {
        if (!scroll || !elementRef.current) return;

        const containers = findScrollableContainers(elementRef.current);
        containers.forEach((c) => c.addEventListener('scroll', scrollHandler, { passive: true, capture: true }));

        return () => {
            containers.forEach((c) => c.removeEventListener('scroll', scrollHandler, true));
        };
    }, [scrollHandler, scroll]);

    useResizeObserver(elementRef.current, resizeHandler, polyfill);

    useEffect(() => {
        const cleanupOrientation = setupOrientationListener();
        return () => cleanupOrientation?.();
    }, [setupOrientationListener]);

    const refCallback = useCallback(
        (node: HTMLOrSVG | null) => {
            elementRef.current = node;
            measure();
        },
        [measure]
    );

    return [refCallback, bounds, measure];
};

export default useMeasure;
