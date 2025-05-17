'use client';

import { ProgressProvider } from '@bprogress/next/app';

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ProgressProvider height="2px" color="#e1102c" options={{ showSpinner: false }} shallowRouting>
            {children}
        </ProgressProvider>
    );
};

export default ProgressBarProvider;
