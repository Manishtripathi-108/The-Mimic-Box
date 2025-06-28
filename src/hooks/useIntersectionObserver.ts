'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { isBrowser } from '@/lib/utils/core.utils';

/**
 * Options for the `useIntersectionObserver` hook.
 */
export type T_UseIntersectionObserverOptions = {
    /**
     * The intersection threshold. The callback will be invoked when the intersection between the target element and the root element crosses this threshold.
     * A value of 0 means the callback will be called whenever the target element and root element are not intersecting.
     * A value of 1.0 means the callback will only be called when the target element and root element are fully intersecting.
     * A value between 0 and 1.0 will be called when the target element is intersecting with the root element at the given percentage.
     *
     * @default 0
     */
    threshold?: number | number[];
    /**
     * The element to use as the root when observing the target element.
     * If null, the root is the document.
     * If a RefObject, the current value of the ref is used.
     * If an Element, the element is used.
     * If a Document, the document is used.
     * @default null
     */
    root?: Element | Document | null | RefObject<Element | Document | null>;
    /**
     * The root margin to use when observing the target element.
     * @default '0px'
     */
    rootMargin?: string;
    /**
     * If true, the hook will automatically unobserve the element when it is removed from the DOM.
     * @default false
     */
    autoUnobserveIfRemoved?: boolean;
    /**
     * The callback to call when the intersection between the target element and the root element changes.
     * The callback will be called with the IntersectionObserverEntry object.
     * @default undefined
     */
    onChange?: (entry: IntersectionObserverEntry) => void;
    /**
     * If true, the callback will be called only once.
     * @default false
     */
    once?: boolean;
};

/**
 * The return type of the `useIntersectionObserver` hook.
 */
export type T_UseIntersectionObserverReturn<T extends Element> = {
    /**
     * The function to call to observe the given element.
     * @param element The element to observe.
     */
    observe: (element: T | null) => void;
    /**
     * The function to call to unobserve the given element.
     * @param element The element to unobserve.
     */
    unobserve: (element: T | null) => void;
    /**
     * The map of elements to IntersectionObserverEntry objects.
     */
    entries: Map<Element, IntersectionObserverEntry>;
    /**
     * The function to call to observe the given element via a ref.
     * @param node The element to observe via a ref.
     */
    observeRef: (node: T | null) => void;
    /**
     * The function to call to get the IntersectionObserverEntry for the given element.
     * @param el The element to get the IntersectionObserverEntry for.
     */
    getEntry: (el: Element) => IntersectionObserverEntry | undefined;
    /**
     * The map of elements that are currently intersecting to their IntersectionObserverEntry objects.
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
 * React hook that observes the intersection of an element with its root element.
 * Automatically observes the element when it is mounted and unobserve it when it is removed from the DOM.
 * Provides a map of elements to their IntersectionObserverEntry objects.
 * @param options The options for the hook.
 * @param options.root The root element to observe against. If null, the root is the document.
 * @param options.rootMargin The root margin to use when observing the element.
 * @param options.threshold The intersection threshold. The callback will be invoked when the intersection between the target element and the root element crosses this threshold.
 * @param options.once If true, the callback will be called only once.
 * @param options.onChange The callback to call when the intersection between the target element and the root element changes.
 * @param options.autoUnobserveIfRemoved If true, the hook will automatically unobserve the element when it is removed from the DOM.
 * @return An object with the following properties:
 * - observe: The function to call to observe the given element.
 * - unobserve: The function to call to unobserve the given element.
 * - entries: The map of elements to IntersectionObserverEntry objects.
 * - observeRef: The function to call to observe the given element via a ref.
 * - getEntry: The function to call to get the IntersectionObserverEntry for the given element.
 * - intersectingEntries: The map of elements that are currently intersecting to their IntersectionObserverEntry objects.
 */
const useIntersectionObserver = <T extends Element = Element>(options: T_UseIntersectionObserverOptions = {}): T_UseIntersectionObserverReturn<T> => {
    const { root = null, rootMargin = '0px', threshold = 0, once = false, autoUnobserveIfRemoved = false, onChange } = options;

    const [entryMap, setEntryMap] = useState<Map<Element, IntersectionObserverEntry>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);
    const mutationObserverRef = useRef<MutationObserver | null>(null);
    const watchedElements = useRef<Set<Element>>(new Set());

    const resolvedRoot = root && 'current' in root ? root.current : root;
    const observerKey = getObserverKey(resolvedRoot, rootMargin, threshold);

    const handleEntries = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            setEntryMap((prev) => {
                const nextMap = new Map(prev);

                for (const entry of entries) {
                    nextMap.set(entry.target, entry);

                    if (once && entry.isIntersecting) {
                        observerRef.current?.unobserve(entry.target);
                        watchedElements.current.delete(entry.target);
                    }

                    onChange?.(entry);
                }

                return nextMap;
            });
        },
        [once, onChange]
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
            const observer = getOrCreateObserver();
            observer.observe(element);
            watchedElements.current.add(element);
            observerRef.current = observer;

            if (autoUnobserveIfRemoved) {
                if (!mutationObserverRef.current) {
                    mutationObserverRef.current = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            for (const node of mutation.removedNodes) {
                                if (node instanceof Element && watchedElements.current.has(node)) {
                                    observer.unobserve(node);
                                    watchedElements.current.delete(node);
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
            }
        },
        [getOrCreateObserver, autoUnobserveIfRemoved]
    );

    const unobserve = useCallback((element: T | null) => {
        if (!element || !observerRef.current) return;
        observerRef.current.unobserve(element);
        watchedElements.current.delete(element);
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

    const intersectingEntries = useCallback(() => {
        const map = new Map<Element, IntersectionObserverEntry>();
        for (const [el, entry] of entryMap.entries()) {
            if (entry.isIntersecting) map.set(el, entry);
        }
        return map;
    }, [entryMap])();

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
