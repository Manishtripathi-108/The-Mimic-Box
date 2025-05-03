'use client';

import ErrorCard from '@/components/layout/ErrorCard';

const Error = ({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) => {
    return <ErrorCard message={error.message} reset={reset} error={error} />;
};

export default Error;
