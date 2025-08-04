'use client';

import React, { memo, useEffect, useRef, useState } from 'react';

import cn from '@/lib/utils/cn';

const TabSwitcher = <T extends string>({
    tabs,
    currentTab,
    onTabChange,
    className,
    buttonClassName,
}: {
    tabs: T[];
    currentTab?: T | null;
    onTabChange: (tab: T) => void;
    className?: string;
    buttonClassName?: string;
}): React.JSX.Element => {
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const buttonRefs = useRef<HTMLButtonElement[]>([]);

    useEffect(() => {
        if (currentTab && buttonRefs.current.length > 0) {
            const currentIndex = tabs.indexOf(currentTab);
            const currentButton = buttonRefs.current[currentIndex];

            if (currentButton) {
                setIndicatorStyle({
                    height: `${currentButton.offsetHeight}px`,
                    top: `${currentButton.offsetTop}px`,
                    width: `${currentButton.offsetWidth}px`,
                    left: `${currentButton.offsetLeft}px`,
                });
            }
        } else {
            setIndicatorStyle({ width: 0, height: 0 });
        }
    }, [currentTab, tabs]);

    return (
        <nav
            role="tablist"
            aria-label="Navigation Tabs"
            className={cn(
                'from-secondary to-tertiary shadow-floating-xs relative flex w-fit flex-wrap gap-1 rounded-xl bg-linear-150 from-15% to-85% p-1',
                className
            )}>
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    id={`tab-${index}`}
                    title={tab}
                    role="tab"
                    type="button"
                    ref={(el) => {
                        if (el) buttonRefs.current[index] = el;
                    }}
                    data-selected={currentTab === tab}
                    aria-selected={currentTab === tab}
                    aria-controls={`tabpanel-${index}`}
                    onClick={() => onTabChange(tab)}
                    className={cn(
                        'hover:text-text-primary text-text-secondary data-selected:text-text-primary z-30 flex-1 cursor-pointer rounded-lg px-4 py-2 transition-colors',
                        buttonClassName
                    )}>
                    {tab}
                </button>
            ))}
            <div
                className="bg-primary shadow-pressed-xs absolute top-1 max-h-[calc(100%-0.5rem)] rounded-lg border transition-all duration-500 ease-out"
                style={indicatorStyle}></div>
        </nav>
    );
};

export default memo(TabSwitcher) as <T extends string>(props: {
    tabs: T[];
    currentTab?: T | null;
    onTabChange: (tab: T) => void;
    className?: string;
    buttonClassName?: string;
}) => React.JSX.Element;
