'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * A reference to a DOM element or a ref object pointing to it.
 */
type Target = HTMLElement | null;
type TargetRef = React.RefObject<Target>;
type TargetLike = Target | TargetRef;
type DocumentEventKey = keyof DocumentEventMap;

export interface UseClickOutsideOptions<T extends Event = Event> {
    /**
     * Callback invoked when a click outside the target(s) is detected.
     */
    onClickOutside: (event: T) => void;

    /**
     * Elements or refs to monitor for outside interactions.
     */
    targets: TargetLike[];

    /**
     * Events to listen to (e.g. 'mousedown', 'touchstart').
     * @default ['mousedown', 'touchstart']
     */
    events?: DocumentEventKey[];

    /**
     * If true, ignores clicks on the browser scrollbars.
     * @default true
     */
    excludeScrollbar?: boolean;

    /**
     * Class name(s) to ignore during click detection.
     * @default 'ignore-onClickOutside'
     */
    ignoreClass?: string | string[];

    /**
     * If true, detects iframe blur for focus-outside behavior.
     * @default true
     */
    detectIFrame?: boolean;

    /**
     * Temporarily disables the hook.
     * @default false
     */
    disabled?: boolean;
}

const DEFAULT_EVENTS: DocumentEventKey[] = ['mousedown', 'touchstart'];
const DEFAULT_IGNORE_CLASS = 'ignore-onClickOutside';

// --- Utility functions ---

const isRef = (target: unknown): target is TargetRef => (target as TargetRef)?.current !== undefined;
const resolveTarget = (target: TargetLike): Target => (isRef(target) ? target.current : target);

/**
 * Check if an element or any of its parents has the ignore class(es).
 */
const hasIgnoreClass = (el: HTMLElement | null, classNames: string | string[]): boolean => {
    while (el) {
        if (Array.isArray(classNames)) {
            if (classNames.some((cls) => el?.classList.contains(cls))) return true;
        } else if (el.classList.contains(classNames)) {
            return true;
        }
        el = el.parentElement;
    }
    return false;
};

/**
 * Detect clicks on the scrollbar area.
 */
const clickedOnScrollbar = (e: MouseEvent): boolean => {
    return document.documentElement.clientWidth <= e.clientX || document.documentElement.clientHeight <= e.clientY;
};

/**
 * Check if the browser supports passive event listeners.
 */
const canUsePassiveEvents = (() => {
    let supported = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get() {
                supported = true;
                return true;
            },
        });
        window.addEventListener('testPassive', null as unknown as EventListener, opts);
        window.removeEventListener('testPassive', null as unknown as EventListener, opts);
    } catch {}
    return () => supported;
})();

/**
 * Return event listener options, safe for `addEventListener`.
 */
const getEventOptions = (type: string): boolean | AddEventListenerOptions => {
    if (type.includes('touch') && canUsePassiveEvents()) {
        return { passive: true };
    }
    return false;
};

/**
 * Hook to detect clicks outside the given targets.
 */
export function useClickOutside<T extends Event = Event>({
    onClickOutside,
    targets,
    events = DEFAULT_EVENTS,
    excludeScrollbar = true,
    ignoreClass = DEFAULT_IGNORE_CLASS,
    detectIFrame = true,
    disabled = false,
}: UseClickOutsideOptions<T>): void {
    const callbackRef = useRef(onClickOutside);
    callbackRef.current = onClickOutside;

    const eventHandler = useCallback(
        (event: Event) => {
            const targetEls = targets.map(resolveTarget).filter(Boolean) as HTMLElement[];
            if (!targetEls.length) return;

            const clickedEl = event.target as HTMLElement | null;
            if (!clickedEl) return;

            if (hasIgnoreClass(clickedEl, ignoreClass) || (excludeScrollbar && event instanceof MouseEvent && clickedOnScrollbar(event))) return;

            const clickedInside = targetEls.some((el) => el.contains(clickedEl));
            if (!clickedInside) {
                callbackRef.current(event as T);
            }
        },
        [targets, ignoreClass, excludeScrollbar]
    );

    const iframeHandler = useCallback(
        (event: FocusEvent) => {
            setTimeout(() => {
                const active = document.activeElement as HTMLElement | null;
                if (!active) return;

                const targetEls = targets.map(resolveTarget).filter(Boolean) as HTMLElement[];
                if (!hasIgnoreClass(active, ignoreClass) && !targetEls.includes(active)) {
                    callbackRef.current(event as unknown as T);
                }
            }, 0);
        },
        [targets, ignoreClass]
    );

    useEffect(() => {
        if (disabled) return;

        const doc = document;

        events.forEach((eventName) => {
            const opts = getEventOptions(eventName);
            doc.addEventListener(eventName, eventHandler, opts as AddEventListenerOptions);
        });

        if (detectIFrame) {
            window.addEventListener('blur', iframeHandler);
        }

        return () => {
            events.forEach((eventName) => {
                const opts = getEventOptions(eventName);
                doc.removeEventListener(eventName, eventHandler, opts as AddEventListenerOptions);
            });

            if (detectIFrame) {
                window.removeEventListener('blur', iframeHandler);
            }
        };
    }, [events, eventHandler, iframeHandler, detectIFrame, disabled]);
}
