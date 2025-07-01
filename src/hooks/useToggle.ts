'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type TToggleActions<T> = {
    /** Set value to default (initial value) */
    setDefault: () => void;

    /** Set value to alternate */
    setAlternate: () => void;

    /** Toggle value between default and alternate, or to a specific value */
    toggle: (value?: T) => void;
};

type T_Equals<T> = {
    (a: T, b: T): boolean;
};

export type TUseToggleOptions<T> = {
    /**
     * Callback triggered when value changes
     */
    onChange?: (value: T) => void;

    /**
     * Custom equality checker for values
     * @default (a, b) => a === b
     */
    equals?: T_Equals<T>;

    /**
     * Keyboard key (e.g., 'Escape') to toggle via keydown
     */
    keybind?: string;

    /**
     * Value to toggle to when key is pressed (optional, default toggles)
     */
    toggleOnKeyTo?: T;
};

/**
 * A hook to create toggleable state with actions and optional keyboard binding.
 *
 * @template T The type of the toggled value
 * @param defaultVal Initial value of the toggle (defaults to false)
 * @param alternateVal Value to toggle to (defaults to !defaultVal if boolean)
 * @param options Additional options (onChange callback, keybind listener, etc)
 * @returns A tuple [value, { toggle, setDefault, setAlternate }]
 */
const useToggle = <T = boolean>(defaultVal: T = false as unknown as T, alternateVal?: T, options?: TUseToggleOptions<T>): [T, TToggleActions<T>] => {
    const [state, setState] = useState<T>(defaultVal);

    const resolvedAlt = (alternateVal === undefined ? ((typeof defaultVal === 'boolean' ? !defaultVal : null) as T) : alternateVal) as T;
    const { onChange, equals, keybind, toggleOnKeyTo } = options ?? {};

    const isEqual = useMemo<T_Equals<T>>(() => equals ?? ((a, b) => a === b), [equals]);

    const update = useCallback(
        (val: T | ((prev: T) => T)) => {
            setState((prev) => {
                const next = typeof val === 'function' ? (val as (p: T) => T)(prev) : val;
                onChange?.(next);
                return next;
            });
        },
        [onChange]
    );

    const toggle = useCallback(
        (value?: T) => {
            if (value !== undefined) return update(value);
            update((prev) => (isEqual(prev, defaultVal) ? resolvedAlt : defaultVal));
        },
        [update, isEqual, defaultVal, resolvedAlt]
    );

    const setDefault = useCallback(() => update(defaultVal), [update, defaultVal]);
    const setAlternate = useCallback(() => update(resolvedAlt), [update, resolvedAlt]);

    // Keybind support
    useEffect(() => {
        if (!keybind) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === keybind) {
                toggle(toggleOnKeyTo);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [toggle, keybind, toggleOnKeyTo]);

    return [state, useMemo(() => ({ toggle, setDefault, setAlternate }), [toggle, setDefault, setAlternate])];
};

export default useToggle;
