'use client';

import { useCallback, useMemo, useState } from 'react';

export type T_ToggleActions<T> = {
    /**
     * Set value to default value (initial value of `defaultValue` prop)
     */
    setToDefault: () => void;

    /**
     * Set value to alternate value (initial value of `alternateValue` prop)
     */
    setToAlternate: () => void;

    /**
     * Toggle value between default and alternate
     * @param nextValue Optionally set value to specific value
     */
    toggle: (nextValue?: T) => void;
};

type T_Equals<T> = {
    (a: T, b: T): boolean;
};

/**
 * A hook to create a toggleable state and functions to interact with it.
 *
 * @param defaultValue The default value of the state. Defaults to false.
 * @param alternateValue The alternate value of the state. Defaults to the opposite of `defaultValue`.
 * @param options
 * @param options.onChange Called when the state changes.
 * @param options.equals A function that checks if two values are equal. Defaults to `(a, b) => a === b`.
 *
 * @returns An array containing the current state and an object with three functions: `toggle`, `setToDefault`, and `setToAlternate`.
 * - `toggle` toggles the state between `defaultValue` and `alternateValue`.
 * - `setToDefault` sets the state to `defaultValue`.
 * - `setToAlternate` sets the state to `alternateValue`.
 */
const useToggle = <D = boolean, R = D>(
    defaultValue: D = false as unknown as D,
    alternateValue?: R,
    options?: {
        onChange?: (value: D | R) => void;
        equals?: T_Equals<D | R>;
    }
): [D | R, T_ToggleActions<D | R>] => {
    const [state, setState] = useState<D | R>(defaultValue);

    const resolvedAlternate = (alternateValue === undefined ? (!defaultValue as unknown as R) : alternateValue) as D | R;

    const { onChange, equals } = options ?? {};

    const isEqual = useMemo<T_Equals<D | R>>(() => equals ?? ((a, b) => a === b), [equals]);

    const updateState = useCallback(
        (value: D | R | ((prev: D | R) => D | R)) => {
            setState((prev) => {
                const next = typeof value === 'function' ? (value as (prev: D | R) => D | R)(prev) : value;
                onChange?.(next);
                return next;
            });
        },
        [onChange]
    );

    const toggle = useCallback(
        (nextValue?: D | R) => {
            if (nextValue !== undefined) {
                updateState(nextValue);
            } else {
                updateState((prev) => (isEqual(prev, defaultValue) ? resolvedAlternate : defaultValue));
            }
        },
        [defaultValue, resolvedAlternate, updateState, isEqual]
    );

    const setToDefault = useCallback(() => updateState(defaultValue), [defaultValue, updateState]);
    const setToAlternate = useCallback(() => updateState(resolvedAlternate), [resolvedAlternate, updateState]);

    const actions = useMemo(
        () => ({
            toggle,
            setToDefault,
            setToAlternate,
        }),
        [toggle, setToDefault, setToAlternate]
    );

    return [state, actions];
};

export default useToggle;
