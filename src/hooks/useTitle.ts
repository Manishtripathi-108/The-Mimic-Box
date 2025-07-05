import { useEffect, useRef } from 'react';

import { isBrowser } from '@/lib/utils/core.utils';

type UseTitleOptions = {
    /**
     * Restore the previous document title when the component unmounts.
     */
    restoreOnUnmount?: boolean;

    /**
     * Append or prepend app name (like “My App | Page Title”).
     * Can be "prepend" | "append" | undefined.
     * Default is "append".
     */
    appNamePosition?: 'prepend' | 'append';

    /**
     * App name to include (if `appNamePosition` is set).
     */
    appName?: string;

    /**
     * Separator to use between app name and title.
     * Default is ' | '
     */
    separator?: string;
};

/**
 * Set the document title reactively and optionally restore old title on unmount.
 */
export function useDocumentTitle(title: string, options: UseTitleOptions = {}): void {
    const { restoreOnUnmount = false, appNamePosition = 'append', appName = process.env.NEXT_PUBLIC_APP_NAME, separator = ' | ' } = options;

    const previousTitleRef = useRef<string | null>(null);

    useEffect(() => {
        if (!isBrowser) return;

        // Store previous title if needed
        if (restoreOnUnmount) {
            previousTitleRef.current = document.title;
        }

        let fullTitle = title;

        if (appName && appNamePosition === 'prepend') {
            fullTitle = `${appName}${separator}${title}`;
        } else if (appName && appNamePosition === 'append') {
            fullTitle = `${title}${separator}${appName}`;
        }

        document.title = fullTitle;

        return () => {
            if (restoreOnUnmount && previousTitleRef.current !== null) {
                document.title = previousTitleRef.current;
            }
        };
    }, [title, restoreOnUnmount, appName, appNamePosition, separator]);
}
