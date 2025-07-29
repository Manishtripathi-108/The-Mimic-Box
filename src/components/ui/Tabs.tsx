'use client';

import React, { KeyboardEvent, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import Slot from '@/components/Slot';
import { DISABLED, FOCUS_RING } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

interface TabsContextProps {
    /** The currently active tab value */
    readonly activeTab: string;
    /** Function to set the active tab */
    readonly setActiveTab: (value: string) => void;
    /** Function to focus a specific tab */
    readonly focusTab: (value: string) => void;
    /** The orientation of the tabs, either horizontal or vertical */
    readonly orientation: 'horizontal' | 'vertical';
    /** The activation mode - manual requires explicit activation, automatic activates on focus */
    readonly activationMode: 'manual' | 'automatic';
    /** Whether focus should loop around when reaching the first/last tab */
    readonly loopFocus: boolean;
    /** Function to register a tab trigger element */
    readonly registerTrigger: (value: string, ref: HTMLButtonElement | null) => void;
    /** Array of tab values in their registration order */
    readonly triggerOrder: readonly string[];
    /** Whether tab content should be lazily mounted only when first activated */
    readonly lazyMount: boolean;
    /** Whether tab content should be unmounted when not active */
    readonly unmountOnExit: boolean;
    /** CSS styles for the tab indicator element */
    readonly indicatorStyle: React.CSSProperties;
    /** Function to update the indicator position and size */
    readonly updateIndicator: () => void;
}

const TabsContext = createContext<TabsContextProps | null>(null);

export const Tabs = ({
    defaultValue = '',
    value,
    asChild = false,
    onValueChange,
    onFocusChange,
    activationMode = 'automatic',
    orientation = 'horizontal',
    loopFocus = true,
    className,
    children,
    lazyMount = false,
    unmountOnExit = false,
    ...props
}: {
    defaultValue?: string;
    value?: string;
    asChild?: boolean;
    onValueChange?: (value: string) => void;
    onFocusChange?: (value: string) => void;
    activationMode?: 'manual' | 'automatic';
    orientation?: 'horizontal' | 'vertical';
    loopFocus?: boolean;
    className?: string;
    children: ReactNode;
    lazyMount?: boolean;
    unmountOnExit?: boolean;
} & React.HTMLAttributes<HTMLElement>) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [triggerOrder, setTriggerOrder] = useState<string[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

    const activeTab = isControlled ? value! : internalValue;
    const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const setActiveTab = useCallback(
        (val: string) => {
            if (!isControlled) setInternalValue(val);
            onValueChange?.(val);
        },
        [isControlled, onValueChange]
    );

    const focusTab = useCallback(
        (val: string) => {
            triggerRefs.current[val]?.focus();
            onFocusChange?.(val);
            if (activationMode === 'automatic') setActiveTab(val);
        },
        [onFocusChange, setActiveTab, activationMode]
    );

    const registerTrigger = useCallback((val: string, ref: HTMLButtonElement | null) => {
        triggerRefs.current[val] = ref;
        setTriggerOrder((prev) => (prev.includes(val) ? prev : [...prev, val]));
    }, []);

    const updateIndicator = useCallback(() => {
        const el = triggerRefs.current[activeTab];
        if (el?.parentElement) {
            const rect = el.getBoundingClientRect();
            const parentRect = el.parentElement.getBoundingClientRect();

            setIndicatorStyle({
                width: `${rect.width}px`,
                left: `${rect.left - parentRect.left}px`,
            });
        }
    }, [activeTab]);

    useEffect(() => {
        updateIndicator();
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator, triggerOrder.length]);

    const ctx = useMemo(
        () => ({
            activeTab,
            setActiveTab,
            focusTab,
            orientation,
            activationMode,
            loopFocus,
            registerTrigger,
            triggerOrder,
            lazyMount,
            unmountOnExit,
            indicatorStyle,
            updateIndicator,
        }),
        [
            activeTab,
            setActiveTab,
            focusTab,
            orientation,
            activationMode,
            loopFocus,
            registerTrigger,
            triggerOrder,
            lazyMount,
            unmountOnExit,
            indicatorStyle,
            updateIndicator,
        ]
    );

    const Comp = asChild ? Slot : 'div';

    return (
        <TabsContext.Provider value={ctx}>
            <Comp
                data-scope="tabs"
                data-part="root"
                data-orientation={orientation}
                className={cn('flex gap-2', orientation === 'vertical' ? 'flex-row' : 'flex-col', className)}
                {...props}>
                {children}
            </Comp>
        </TabsContext.Provider>
    );
};

export const TabsList = ({
    className,
    children,
    asChild,
    ...props
}: {
    className?: string;
    children: ReactNode;
    asChild?: boolean;
} & React.HTMLAttributes<HTMLElement>) => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('TabsList must be used within Tabs');

    const Comp = asChild ? Slot : 'div';

    return (
        <Comp
            role="tablist"
            data-part="list"
            data-orientation={ctx.orientation}
            className={cn(
                'from-secondary to-tertiary shadow-floating-xs bg-muted text-muted-foreground relative inline-flex w-fit flex-wrap items-center justify-center gap-1 rounded-xl bg-linear-150 from-15% to-85% p-[3px]',
                ctx.orientation === 'vertical' && 'flex-col',
                className
            )}
            {...props}>
            {children}
        </Comp>
    );
};

export const TabsTrigger = ({
    value,
    disabled = false,
    className,
    children,
    asChild = false,
    ...props
}: {
    value: string;
    disabled?: boolean;
    className?: string;
    children: ReactNode;
    asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('TabsTrigger must be used within Tabs');

    const ref = useRef<HTMLButtonElement>(null);
    const isActive = ctx.activeTab === value;

    useEffect(() => {
        ctx.registerTrigger(value, ref.current);
    }, [ctx, value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;

        const isNext = ['ArrowRight', 'ArrowDown'].includes(e.key);
        const isPrev = ['ArrowLeft', 'ArrowUp'].includes(e.key);
        const isHome = e.key === 'Home';
        const isEnd = e.key === 'End';

        const isRelevant = ctx.orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight', 'Home', 'End'] : ['ArrowUp', 'ArrowDown', 'Home', 'End'];

        if (!isRelevant.includes(e.key)) return;

        const enabledTabs = ctx.triggerOrder.filter((val) => !document.getElementById(`tab-${val}`)?.hasAttribute('disabled'));
        const index = enabledTabs.indexOf(value);
        let nextIndex = index;

        if (isNext) nextIndex++;
        else if (isPrev) nextIndex--;
        else if (isHome) nextIndex = 0;
        else if (isEnd) nextIndex = enabledTabs.length - 1;

        if (ctx.loopFocus) {
            nextIndex = (nextIndex + enabledTabs.length) % enabledTabs.length;
        } else if (nextIndex < 0 || nextIndex >= enabledTabs.length) {
            return;
        }

        ctx.focusTab(enabledTabs[nextIndex]);
        e.preventDefault();
    };

    const triggerProps = {
        ref,
        role: 'tab',
        id: `tab-${value}`,
        'aria-selected': isActive,
        'aria-controls': `content-${value}`,
        disabled,
        'data-part': 'trigger',
        'data-selected': isActive,
        className: cn(
            'hover:text-text-primary z-30 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium transition-[color,box-shadow] whitespace-nowrap',
            isActive ? 'text-text-primary' : 'text-text-secondary',
            DISABLED,
            FOCUS_RING,
            className
        ),
        onClick: () => !disabled && ctx.setActiveTab(value),
        onKeyDown: handleKeyDown,
        ...props,
    };

    const Comp = asChild ? Slot : 'button';
    return <Comp {...triggerProps}>{children}</Comp>;
};

export const TabIndicator = ({
    className,
    asChild,
    children,
    ...props
}: {
    className?: string;
    asChild?: boolean;
    children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('TabIndicator must be used within Tabs');

    const Comp = asChild ? Slot : 'div';

    return (
        <Comp
            className={cn(
                'bg-primary shadow-pressed-xs absolute bottom-1 z-10 h-[calc(100%-0.5rem)] rounded-lg border transition-all duration-300 ease-out',
                className
            )}
            style={{ ...ctx.indicatorStyle, ...props.style }}
            {...props}>
            {children}
        </Comp>
    );
};

export const TabsContent = ({
    value,
    lazyMount,
    unmountOnExit,
    className,
    children,
    asChild = false,
    ...props
}: {
    value: string;
    lazyMount?: boolean;
    unmountOnExit?: boolean;
    className?: string;
    children: ReactNode;
    asChild?: boolean;
} & React.HTMLAttributes<HTMLElement>) => {
    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error('TabsContent must be used within Tabs');

    const mountedRef = useRef(false);
    const isActive = ctx.activeTab === value;

    useEffect(() => {
        if (isActive) mountedRef.current = true;
    }, [isActive]);

    const shouldUnmount = unmountOnExit ?? ctx.unmountOnExit;
    const shouldLazy = lazyMount ?? ctx.lazyMount;

    if ((shouldUnmount && !isActive) || (shouldLazy && !mountedRef.current && !isActive)) return null;

    const Comp = asChild ? Slot : 'div';

    return (
        <Comp
            role="tabpanel"
            id={`content-${value}`}
            aria-labelledby={`tab-${value}`}
            data-part="content"
            hidden={!isActive}
            className={cn('shadow-pressed-xs flex-1 rounded-xl p-4 outline-none', className)}
            {...props}>
            {children}
        </Comp>
    );
};
