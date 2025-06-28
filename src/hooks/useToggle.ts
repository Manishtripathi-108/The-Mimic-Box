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
 * Hook to create a toggleable state and corresponding actions.
 *
 * @param defaultValue - default value of the state
 * @param alternateValue - alternate value of the state (default: opposite of `defaultValue`)
 * @param options - options
 * @param options.onChange - callback when state changes
 * @param options.equals - custom comparison function (default: strict equality)
 * @returns an array containing the state and an object with the following properties:
 *   - `toggle`: a function to toggle the state between `defaultValue` and `alternateValue`.
 *   - `setToDefault`: a function to set the state to `defaultValue`.
 *   - `setToAlternate`: a function to set the state to `alternateValue`.
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
