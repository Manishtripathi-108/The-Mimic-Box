'use client';

import React, { KeyboardEvent, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import Slot from '@/components/Slot';
import { DISABLED, FOCUS_RING } from '@/lib/styles/tailwind.helpers';
import cn from '@/lib/utils/cn';

type TabsOrientation = 'horizontal' | 'vertical';
type TabsActivation = 'manual' | 'automatic';

type TabsContextType = {
    activeTab: string;
    setActiveTab: (val: string) => void;
    focusTab: (val: string) => void;
    orientation: TabsOrientation;
    activation: TabsActivation;
    loopFocus: boolean;
    registerTrigger: (val: string, ref: HTMLButtonElement | null) => void;
    triggerOrder: string[];
    lazyMount: boolean;
    unmountOnExit: boolean;
    indicatorStyle: React.CSSProperties;
    updateIndicator: () => void;
};

const TabsContext = createContext<TabsContextType | null>(null);
const useTabsContext = (componentName: string) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error(`${componentName} must be used within <Tabs>`);
    }
    return context;
};

export const Tabs = ({
    defaultValue = '',
    value,
    asChild = false,
    onValueChange,
    onFocusChange,
    activation = 'automatic',
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
    onValueChange?: (val: string) => void;
    onFocusChange?: (val: string) => void;
    activation?: TabsActivation;
    orientation?: TabsOrientation;
    loopFocus?: boolean;
    className?: string;
    children: ReactNode;
    lazyMount?: boolean;
    unmountOnExit?: boolean;
} & React.HTMLAttributes<HTMLElement>) => {
    const isControlled = value !== undefined;
    const [internalTab, setInternalTab] = useState(defaultValue);
    const [triggerOrder, setTriggerOrder] = useState<string[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const currentTab = isControlled ? value! : internalTab;

    const setActiveTab = useCallback(
        (val: string) => {
            if (!isControlled) setInternalTab(val);
            onValueChange?.(val);
        },
        [isControlled, onValueChange]
    );

    const focusTab = useCallback(
        (val: string) => {
            triggerRefs.current[val]?.focus();
            onFocusChange?.(val);
            if (activation === 'automatic') setActiveTab(val);
        },
        [activation, onFocusChange, setActiveTab]
    );

    const registerTrigger = useCallback((val: string, ref: HTMLButtonElement | null) => {
        triggerRefs.current[val] = ref;
        setTriggerOrder((prev) => (prev.includes(val) ? prev : [...prev, val]));
    }, []);

    const updateIndicator = useCallback(() => {
        const el = triggerRefs.current[currentTab];
        if (el?.parentElement) {
            const { left, width } = el.getBoundingClientRect();
            const parentLeft = el.parentElement.getBoundingClientRect().left;

            setIndicatorStyle({
                width: `${width}px`,
                left: `${left - parentLeft}px`,
            });
        }
    }, [currentTab]);

    useEffect(() => {
        updateIndicator();
        window.addEventListener('resize', updateIndicator);
        return () => window.removeEventListener('resize', updateIndicator);
    }, [updateIndicator]);

    const contextValue = useMemo(
        () => ({
            activeTab: currentTab,
            setActiveTab,
            focusTab,
            orientation,
            activation,
            loopFocus,
            registerTrigger,
            triggerOrder,
            lazyMount,
            unmountOnExit,
            indicatorStyle,
            updateIndicator,
        }),
        [
            currentTab,
            setActiveTab,
            focusTab,
            orientation,
            activation,
            loopFocus,
            registerTrigger,
            triggerOrder,
            lazyMount,
            unmountOnExit,
            indicatorStyle,
            updateIndicator,
        ]
    );

    const Component = asChild ? Slot : 'div';

    return (
        <TabsContext.Provider value={contextValue}>
            <Component
                data-scope="tabs"
                data-part="root"
                data-orientation={orientation}
                className={cn('flex gap-2', orientation === 'vertical' ? 'flex-row' : 'flex-col', className)}
                {...props}>
                {children}
            </Component>
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
    const ctx = useTabsContext('TabsList');

    const Component = asChild ? Slot : 'div';

    return (
        <Component
            role="tablist"
            data-part="list"
            data-orientation={ctx.orientation}
            className={cn(
                'shadow-floating-xs from-secondary to-tertiary relative inline-flex w-fit flex-wrap items-center justify-center gap-1 rounded-xl bg-linear-150 from-15% to-85% p-[3px]',
                ctx.orientation === 'vertical' && 'flex-col',
                className
            )}
            {...props}>
            {children}
        </Component>
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
    const ctx = useTabsContext('TabsTrigger');

    const ref = useRef<HTMLButtonElement>(null);
    const isActive = ctx.activeTab === value;

    useEffect(() => {
        ctx.registerTrigger(value, ref.current);
    }, [ctx, value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;

        const key = e.key;
        const keys = {
            next: ['ArrowRight', 'ArrowDown'],
            prev: ['ArrowLeft', 'ArrowUp'],
            home: 'Home',
            end: 'End',
        };

        const relevantKeys =
            ctx.orientation === 'horizontal' ? [...keys.prev, ...keys.next, keys.home, keys.end] : [...keys.next, ...keys.prev, keys.home, keys.end];

        if (!relevantKeys.includes(key)) return;

        const enabled = ctx.triggerOrder.filter((val) => !document.getElementById(`tab-${val}`)?.hasAttribute('disabled'));
        let idx = enabled.indexOf(value);

        if (keys.next.includes(key)) idx++;
        else if (keys.prev.includes(key)) idx--;
        else if (key === keys.home) idx = 0;
        else if (key === keys.end) idx = enabled.length - 1;

        if (ctx.loopFocus) idx = (idx + enabled.length) % enabled.length;
        else if (idx < 0 || idx >= enabled.length) return;

        ctx.focusTab(enabled[idx]);
        e.preventDefault();
    };

    const Component = asChild ? Slot : 'button';

    return (
        <Component
            ref={ref}
            role="tab"
            id={`tab-${value}`}
            aria-selected={isActive}
            aria-controls={`content-${value}`}
            disabled={disabled}
            data-part="trigger"
            data-selected={isActive}
            className={cn(
                'hover:text-text-primary z-30 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow]',
                isActive ? 'text-text-primary' : 'text-text-secondary',
                DISABLED,
                FOCUS_RING,
                className
            )}
            onClick={() => !disabled && ctx.setActiveTab(value)}
            onKeyDown={handleKeyDown}
            {...props}>
            {children}
        </Component>
    );
};

export const TabsIndicator = ({
    className,
    style,
    children,
    asChild = false,
}: {
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
    asChild?: boolean;
}) => {
    const ctx = useTabsContext('TabsIndicator');
    const Component = asChild ? Slot : 'div';

    return (
        <Component
            role="presentation"
            data-part="indicator"
            className={cn(
                'bg-primary shadow-pressed-xs ease-out-circ absolute bottom-1 z-10 h-[calc(100%-0.5rem)] rounded-lg border transition-all duration-500',
                className
            )}
            style={{ ...ctx.indicatorStyle, ...style }}>
            {children}
        </Component>
    );
};

export const TabsContent = ({
    children,
    className,
    asChild = false,
    ...props
}: {
    children: ReactNode;
    className?: string;
    asChild?: boolean;
} & React.HTMLAttributes<HTMLElement>) => {
    const Component = asChild ? Slot : 'div';
    return (
        <Component className={cn('relative flex-1', className)} {...props}>
            {children}
        </Component>
    );
};

export const TabsPanel = ({
    value,
    children,
    className,
    asChild = false,
    lazyMount = false,
    unmountOnExit = false,
    ...props
}: {
    value: string;
    lazyMount?: boolean;
    unmountOnExit?: boolean;
    children: ReactNode;
    className?: string;
    asChild?: boolean;
} & React.HTMLAttributes<HTMLElement>) => {
    const ctx = useTabsContext('TabsPanel');

    const isActive = ctx.activeTab === value;
    const mountedRef = useRef(false);

    useEffect(() => {
        if (isActive) mountedRef.current = true;
    }, [isActive]);

    const shouldHide = (unmountOnExit ?? ctx.unmountOnExit) && !isActive;
    const shouldLazy = (lazyMount ?? ctx.lazyMount) && !mountedRef.current && !isActive;

    if (shouldHide || shouldLazy) return null;

    const Component = asChild ? Slot : 'div';

    return (
        <Component
            role="tabpanel"
            id={`content-${value}`}
            aria-labelledby={`tab-${value}`}
            hidden={!isActive}
            data-part="panel"
            className={cn('p-4 outline-none', className)}
            {...props}>
            {children}
        </Component>
    );
};
