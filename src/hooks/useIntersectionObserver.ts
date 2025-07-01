'use client';

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { isBrowser } from '@/lib/utils/core.utils';

/**
 * Options for configuring the IntersectionObserver.
 */
export type T_UseIntersectionObserverOptions = {
    /**
     * A single number or an array of numbers indicating at what percentage of the target's
     * visibility the observer's callback should be executed.
     * Default is 0.
     */
    threshold?: number | number[];

    /**
     * The element that is used as the viewport for checking visibility of the target.
     * Must be the ancestor of the target. Defaults to the browser viewport if null.
     */
    root?: Element | Document | null | RefObject<Element | Document | null>;

    /**
     * Margin around the root. Can have values similar to the CSS margin property.
     * The values can be percentages or pixels (e.g., "10px 20px 30px 40px").
     */
    rootMargin?: string;

    /**
     * If true, the observer will automatically unobserve the element when it is removed from the DOM.
     */
    autoUnobserveIfRemoved?: boolean;

    /**
     * If true, the observer will unobserve the target after it has intersected once.
     */
    once?: boolean;

    /**
     * Callback function that is called whenever there is a change in the intersection status
     * of the elements being observed.
     */
    onChange?: (entry: IntersectionObserverEntry) => void;

    /**
     * Callback function that is called whenever an observed element becomes visible.
     */
    onEntry?: (entry: IntersectionObserverEntry) => void;

    /**
     * Callback function that is called whenever an observed element becomes invisible.
     */
    onLeave?: (entry: IntersectionObserverEntry) => void;
};

/**
 * Return type for the useIntersectionObserver hook.
 */
export type T_UseIntersectionObserverReturn<T extends Element> = {
    /**
     * Function to start observing the specified element.
     */
    observe: (element: T | null) => void;

    /**
     * Function to stop observing the specified element.
     */
    unobserve: (element: T | null) => void;

    /**
     * A map of elements being observed and their corresponding IntersectionObserverEntry.
     */
    entries: Map<Element, IntersectionObserverEntry>;

    /**
     * Function to observe a reference to a React node element.
     */
    observeRef: (node: T | null) => void;

    /**
     * Function to get the IntersectionObserverEntry for a specified element.
     */
    getEntry: (el: Element) => IntersectionObserverEntry | undefined;

    /**
     * A map of elements that are currently intersecting and their corresponding IntersectionObserverEntry.
     */
    intersectingEntries: Map<Element, IntersectionObserverEntry>;
};

const observerPool = new Map<string, IntersectionObserver>();

const getObserverKey = (root: Element | Document | null, rootMargin: string, threshold: number | number[]) => {
    if (!isBrowser) return 'document';
    const rootId = root instanceof Element ? root.tagName + root.className : 'document';
    return JSON.stringify([rootId, rootMargin, threshold]);
};

/**
 * React hook that wraps IntersectionObserver API.
 */
const useIntersectionObserver = <T extends Element = Element>(options: T_UseIntersectionObserverOptions = {}): T_UseIntersectionObserverReturn<T> => {
    const { root = null, rootMargin = '0px', threshold = 0, once = false, autoUnobserveIfRemoved = false, onChange, onEntry, onLeave } = options;

    const [entryMap, setEntryMap] = useState<Map<Element, IntersectionObserverEntry>>(new Map());

    const observerRef = useRef<IntersectionObserver | null>(null);
    const mutationObserverRef = useRef<MutationObserver | null>(null);

    // Use a ref to keep track of elements being observed
    const watchedElements = useRef<Set<Element>>(new Set());
    // Use a ref to track elements that have been observed once
    const observedOnce = useRef<WeakSet<Element>>(new WeakSet());
    // Use a ref to track previous intersection state
    const prevIntersecting = useRef<Map<Element, boolean>>(new Map());

    const resolvedRoot = root && 'current' in root ? root.current : root;
    const observerKey = getObserverKey(resolvedRoot, rootMargin, threshold);

    const handleEntries = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            setEntryMap((prev) => {
                const nextMap = new Map(prev);

                for (const entry of entries) {
                    const target = entry.target;
                    const wasIntersecting = prevIntersecting.current.get(target) ?? false;
                    const isIntersecting = entry.isIntersecting;

                    nextMap.set(target, entry);
                    prevIntersecting.current.set(target, isIntersecting);

                    // If the element is observed once and is intersecting, unobserve it and remove it from observed,
                    if (once && isIntersecting) {
                        observerRef.current?.unobserve(target);
                        watchedElements.current.delete(target);
                        observedOnce.current.add(target);
                    }

                    onChange?.(entry);

                    // Call onEntry or onLeave callbacks based on intersection state
                    if (isIntersecting && !wasIntersecting) {
                        onEntry?.(entry);
                    } else if (!isIntersecting && wasIntersecting) {
                        onLeave?.(entry);
                    }
                }

                return nextMap;
            });
        },
        [once, onChange, onEntry, onLeave]
    );

    const getOrCreateObserver = useCallback(() => {
        if (observerPool.has(observerKey)) {
            return observerPool.get(observerKey)!;
        }

        const observer = new IntersectionObserver(handleEntries, {
            root: resolvedRoot,
            rootMargin,
            threshold,
        });

        observerPool.set(observerKey, observer);
        return observer;
    }, [observerKey, handleEntries, resolvedRoot, rootMargin, threshold]);

    const observe = useCallback(
        (element: T | null) => {
            if (!element) return;

            // If the element is already being observed, skip
            if (watchedElements.current.has(element)) return;
            console.log('🪵 > useIntersectionObserver.ts:81 > observe called with element:');

            // Once already intersected, don't observe again
            if (once && observedOnce.current.has(element)) return;

            const observer = getOrCreateObserver();
            observer.observe(element);
            watchedElements.current.add(element);
            observerRef.current = observer;

            // handle unobserve when the element is removed from the DOM
            if (autoUnobserveIfRemoved && !mutationObserverRef.current) {
                mutationObserverRef.current = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        for (const node of mutation.removedNodes) {
                            if (node instanceof Element && watchedElements.current.has(node)) {
                                observer.unobserve(node);
                                watchedElements.current.delete(node);
                                prevIntersecting.current.delete(node);
                                setEntryMap((prev) => {
                                    const next = new Map(prev);
                                    next.delete(node);
                                    return next;
                                });
                            }
                        }
                    });
                });

                mutationObserverRef.current.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }
        },
        [getOrCreateObserver, autoUnobserveIfRemoved, once]
    );

    const unobserve = useCallback((element: T | null) => {
        if (!element || !observerRef.current) return;
        observerRef.current.unobserve(element);
        watchedElements.current.delete(element);
        prevIntersecting.current.delete(element);
        setEntryMap((prev) => {
            const next = new Map(prev);
            next.delete(element);
            return next;
        });
    }, []);

    const observeRef = useCallback(
        (node: T | null) => {
            observe(node);
        },
        [observe]
    );

    const getEntry = useCallback((el: Element) => entryMap.get(el), [entryMap]);

    const intersectingEntries = useMemo(() => {
        const map = new Map<Element, IntersectionObserverEntry>();
        for (const [el, entry] of entryMap.entries()) {
            if (entry.isIntersecting) map.set(el, entry);
        }
        return map;
    }, [entryMap]);

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect();
            mutationObserverRef.current?.disconnect();
            observerRef.current = null;
            mutationObserverRef.current = null;
        };
    }, []);

    return {
        observe,
        unobserve,
        entries: entryMap,
        observeRef,
        getEntry,
        intersectingEntries,
    };
};

export default useIntersectionObserver;
