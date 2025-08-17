'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type T_Equals<T> = (a: T, b: T) => boolean;

export type T_MultiToggleOptions<T> = {
    /**
     * Callback when a toggle value changes
     */
    onChange?: (key: string, value: T) => void;

    /**
     * Custom equality function for value comparison
     */
    equals?: T_Equals<T>;

    /**
     * Optional keybind for toggling all or individual keys
     * - `{ global: 'Escape' }` → toggles all
     * - `{ modal: 'Escape', sidebar: 's' }` → toggles individual keys
     */
    keybinds?: Partial<Record<string | 'global', string>>;

    /**
     * Value to toggle to on key press (optional, default: toggles to alternate)
     */
    toggleOnKeyTo?: T;
};

/**
 * Actions for the multi-toggle state.
 */
export type T_MultiToggleActions<T> = {
    /**
     * Toggles the value at the given key.
     * If `value` is provided, toggles to it.
     * If `value` is not provided, toggles to the alternate value.
     *
     * @example
     * const [state, { toggle }] = useMultiToggle<{ foo: boolean }>(false);
     * toggle('foo'); // toggles the value at the key 'foo'
     * toggle('foo', true); // sets the value at the key 'foo' to true
     */
    toggle: (key: string, value?: T) => void;
    /**
     * Sets the value at the given key to the default value.
     *
     * @example
     * const [state, { setDefault }] = useMultiToggle<{ foo: boolean }>(false);
     * setDefault('foo'); // sets the value at the key 'foo' to the default value
     */
    setDefault: (key: string) => void;
    /**
     * Sets the value at the given key to the alternate value.
     *
     * @example
     * const [state, { setAlternate }] = useMultiToggle<{ foo: boolean }>(false, true);
     * setAlternate('foo'); // sets the value at the key 'foo' to the alternate value
     */
    setAlternate: (key: string) => void;
    /**
     * Gets the value at the given key.
     *
     * @example
     * const [state, { get }] = useMultiToggle<{ foo: boolean }>(false);
     * const value = get('foo'); // gets the value at the key 'foo'
     */
    get: (key: string) => T;
};

/**
 * Creates a state hook that manages a record of toggled values.
 * Each key in the record is associated with a boolean value that can be toggled.
 * The hook returns an object with the current state and an object of actions.
 *
 * @param defaultVal The default value for each key in the record.
 * @param alternateVal The alternate value for each key in the record.
 * If not provided, the alternate value is the opposite of the default value.
 * @param options Options for the hook.
 * @returns An object with the current state and an object of actions.
 *
 * @example
 * const [state, { toggle }] = useMultiToggle<{ foo: boolean }>(false);
 * toggle('foo'); // toggles the value at the key 'foo'
 *
 */
const useMultiToggle = <T = boolean>(
    defaultVal: T = false as unknown as T,
    alternateVal?: T,
    options?: T_MultiToggleOptions<T>
): [Record<string, T>, T_MultiToggleActions<T>] => {
    const [state, setState] = useState<Record<string, T>>({});
    const resolvedAlt = useMemo(() => {
        return alternateVal === undefined ? (typeof defaultVal === 'boolean' ? (!defaultVal as T) : (null as T)) : alternateVal;
    }, [defaultVal, alternateVal]);

    const optsRef = useRef(options);
    optsRef.current = options;

    const isEqual = useMemo<T_Equals<T>>(() => optsRef.current?.equals ?? ((a, b) => a === b), []);

    const set = useCallback(
        (key: string, value: T) => {
            setState((prev) => {
                if (isEqual(prev[key], value)) return prev;
                const updated = { ...prev, [key]: value };
                optsRef.current?.onChange?.(key, value);
                return updated;
            });
        },
        [isEqual]
    );

    const toggle = useCallback(
        (key: string, value?: T) => {
            if (value !== undefined) return set(key, value);
            setState((prev) => {
                const current = prev[key] ?? defaultVal;
                const next = isEqual(current, defaultVal) ? resolvedAlt : defaultVal;
                if (isEqual(current, next)) return prev;
                const updated = { ...prev, [key]: next };
                optsRef.current?.onChange?.(key, next);
                return updated;
            });
        },
        [defaultVal, resolvedAlt, isEqual, set]
    );

    const setDefault = useCallback((key: string) => set(key, defaultVal), [set, defaultVal]);
    const setAlternate = useCallback((key: string) => set(key, resolvedAlt), [set, resolvedAlt]);

    const get = useCallback(
        (key: string) => {
            return state[key] ?? defaultVal;
        },
        [state, defaultVal]
    );

    // Keybind handling
    useEffect(() => {
        const keybinds = optsRef.current?.keybinds;
        if (!keybinds) return;

        const handle = (e: KeyboardEvent) => {
            const allKeys = Object.keys(state);
            const matchedKeys = [];

            for (const [key, bind] of Object.entries(keybinds)) {
                if (e.key === bind) {
                    matchedKeys.push(key);
                }
            }

            if (matchedKeys.includes('global')) {
                allKeys.forEach((key) => toggle(key, optsRef.current?.toggleOnKeyTo));
            } else {
                matchedKeys.forEach((key) => toggle(key, optsRef.current?.toggleOnKeyTo));
            }
        };

        window.addEventListener('keydown', handle);
        return () => window.removeEventListener('keydown', handle);
    }, [toggle, state]);

    return [state, useMemo(() => ({ toggle, setDefault, setAlternate, get }), [toggle, setDefault, setAlternate, get])];
};

export default useMultiToggle;
