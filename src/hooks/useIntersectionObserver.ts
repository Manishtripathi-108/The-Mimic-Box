'use client';

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Options for `useIntersectionObserver`
 */
export type T_UseIntersectionObserverOptions = {
    /**
     * The intersection ratio at which to trigger the callback. Must be a number between 0 and 1.
     * If a single number is provided, it will be used as the threshold for both the enter and exit events.
     * If a list of numbers is provided, the first number will be used as the threshold for the enter event,
     * and the second number will be used as the threshold for the exit event.
     */
    threshold?: number | number[];
    /**
     * The element that is used as the viewport for checking visibility of the target. Defaults to the browser viewport if not specified or if null.
     */
    root?: Element | Document | null | RefObject<Element | Document | null>;
    /**
     * The margin around the root element that is used to calculate the intersection area.
     * The value is specified in pixels. Defaults to '0px'.
     */
    rootMargin?: string;
    /**
     * Whether to trigger the callback when the element is first observed.
     */
    once?: boolean;
    /**
     * Whether to automatically unobserve the element when it is removed from the DOM.
     */
    autoUnobserveIfRemoved?: boolean;
    /**
     * A callback that is called whenever the intersection ratio changes.
     */
    onChange?: (entry: IntersectionObserverEntry) => void;
    /**
     * A callback that is called whenever the element intersects with the root element.
     */
    onEntry?: (entry: IntersectionObserverEntry) => void;
    /**
     * A callback that is called whenever the element no longer intersects with the root element.
     */
    onLeave?: (entry: IntersectionObserverEntry) => void;
};

/**
 * The return value of `useIntersectionObserver`
 */
export type T_UseIntersectionObserverReturn<T extends Element> = {
    /**
     * Observe an element and start watching its intersection status.
     */
    observe: (el: T | null) => void;
    /**
     * Stop watching an element's intersection status.
     */
    unobserve: (el: T | null) => void;
    /**
     * Convenience method to observe an element that is passed as a ref.
     */
    observeRef: (node: T | null) => void;
    /**
     * Get the intersection status of an element.
     */
    getEntry: (el: Element) => IntersectionObserverEntry | undefined;
    /**
     * A map of all the elements that are currently being observed.
     * The key is the element, and the value is its intersection status.
     */
    entries: Map<Element, IntersectionObserverEntry>;
    /**
     * A map of all the elements that are currently intersecting with the root element.
     * The key is the element, and the value is its intersection status.
     */
    intersectingEntries: Map<Element, IntersectionObserverEntry>;
};

/**
 * Resolve the root element from a ref or an element.
 */
function resolveRoot(root?: Element | Document | null | RefObject<Element | Document | null>): Element | Document | null {
    if (!root) return null;
    if ('current' in root) return root.current;
    return root;
}

/**
 * Create a unique key for the observer based on root, margin, and threshold.
 * This allows us to reuse observers for the same configuration.
 */
function createObserverKey(root: Element | Document | null, margin: string, threshold: number | number[]) {
    const rootId = root instanceof Element ? root.tagName + root.className : 'document';
    return JSON.stringify([rootId, margin, threshold]);
}

/**
 * A custom hook to observe elements for intersection changes.
 */
const observerPool = new Map<string, IntersectionObserver>();

/**
 * Hook to observe intersection changes for specified DOM elements.
 */
export function useIntersectionObserver<T extends Element = Element>(
    options: T_UseIntersectionObserverOptions = {}
): T_UseIntersectionObserverReturn<T> {
    const { threshold = 0, root = null, rootMargin = '0px', once = false, autoUnobserveIfRemoved = false, onChange, onEntry, onLeave } = options;

    const [entryMap, setEntryMap] = useState<Map<Element, IntersectionObserverEntry>>(new Map());

    // Refs to store observer instances and tracked elements
    const observerRef = useRef<IntersectionObserver | null>(null);
    const mutationRef = useRef<MutationObserver | null>(null);
    const elementsRef = useRef<Set<Element>>(new Set());
    const prevIntersectingRef = useRef<Map<Element, boolean>>(new Map());
    const observedOnceRef = useRef<WeakSet<Element>>(new WeakSet());
    const resolvedRootRef = useRef<Element | Document | null>(null);

    /**
     * Callback to handle intersection observer entries.
     */
    const handleIO = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            setEntryMap((prev) => {
                const nextMap = new Map(prev);

                for (const entry of entries) {
                    const el = entry.target;
                    const wasIntersecting = prevIntersectingRef.current.get(el) ?? false;
                    const isIntersecting = entry.isIntersecting;

                    nextMap.set(el, entry);
                    prevIntersectingRef.current.set(el, isIntersecting);

                    onChange?.(entry);

                    if (isIntersecting && !wasIntersecting) onEntry?.(entry);
                    if (!isIntersecting && wasIntersecting) onLeave?.(entry);

                    if (once && isIntersecting) {
                        observerRef.current?.unobserve(el);
                        elementsRef.current.delete(el);
                        observedOnceRef.current.add(el);
                    }
                }

                return nextMap;
            });
        },
        [onChange, onEntry, onLeave, once]
    );

    /**
     * Setup the intersection observer.
     */
    const setupObserver = useCallback(() => {
        const rootEl = resolveRoot(root);
        resolvedRootRef.current = rootEl;

        const key = createObserverKey(rootEl, rootMargin, threshold);

        if (observerPool.has(key)) {
            observerRef.current = observerPool.get(key)!;
        } else {
            const observer = new IntersectionObserver(handleIO, {
                root: rootEl,
                rootMargin,
                threshold,
            });
            observerPool.set(key, observer);
            observerRef.current = observer;
        }

        // Re-observe all elements with new observer
        elementsRef.current.forEach((el) => observerRef.current?.observe(el));
    }, [root, rootMargin, threshold, handleIO]);

    /**
     * Observe a new element.
     */
    const observe = useCallback(
        (el: T | null) => {
            if (!el || elementsRef.current.has(el)) return;
            if (once && observedOnceRef.current.has(el)) return;

            elementsRef.current.add(el);
            observerRef.current?.observe(el);

            if (autoUnobserveIfRemoved && !mutationRef.current) {
                mutationRef.current = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        m.removedNodes.forEach((node) => {
                            if (node instanceof Element && elementsRef.current.has(node)) {
                                observerRef.current?.unobserve(node);
                                elementsRef.current.delete(node);
                                prevIntersectingRef.current.delete(node);
                                setEntryMap((prev) => {
                                    const map = new Map(prev);
                                    map.delete(node);
                                    return map;
                                });
                            }
                        });
                    }
                });

                mutationRef.current.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }
        },
        [autoUnobserveIfRemoved, once]
    );

    /**
     * Unobserve an element.
     */
    const unobserve = useCallback((el: T | null) => {
        if (!el || !observerRef.current) return;

        observerRef.current.unobserve(el);
        elementsRef.current.delete(el);
        prevIntersectingRef.current.delete(el);

        setEntryMap((prev) => {
            const next = new Map(prev);
            next.delete(el);
            return next;
        });
    }, []);

    /**
     * Convenience method to observe an element using a ref.
     */
    const observeRef = useCallback(
        (node: T | null) => {
            observe(node);
        },
        [observe]
    );

    /**
     * Retrieve the intersection entry for a given element.
     */
    const getEntry = useCallback((el: Element) => entryMap.get(el), [entryMap]);

    /**
     * Map of elements currently intersecting with the root.
     */
    const intersectingEntries = useMemo(() => {
        const map = new Map<Element, IntersectionObserverEntry>();
        for (const [el, entry] of entryMap.entries()) {
            if (entry.isIntersecting) map.set(el, entry);
        }
        return map;
    }, [entryMap]);

    // Setup observer on mount and cleanup on unmount
    useEffect(() => {
        setupObserver();
    }, [setupObserver]);

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
            mutationRef.current?.disconnect();
            observerRef.current = null;
            mutationRef.current = null;
        };
    }, []);

    return {
        observe,
        unobserve,
        observeRef,
        getEntry,
        entries: entryMap,
        intersectingEntries,
    };
}

export default useIntersectionObserver;
