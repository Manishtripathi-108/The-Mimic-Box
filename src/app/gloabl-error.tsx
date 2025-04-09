'use client';

import ErrorCard from '@/components/ErrorCard';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html>
            <body className="bg-primary h-calc-full-height grid place-items-center rounded-lg p-6 text-center">
                <ErrorCard message={error.message} reset={reset} error={error} />
            </body>
        </html>
    );
}
