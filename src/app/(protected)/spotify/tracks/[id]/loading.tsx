'use client';

import CardContainer from '@/components/ui/CardContainer';

const Loading = () => {
    return (
        <section className="min-h-calc-full-height flex items-center justify-center p-6">
            <main className="w-full max-w-4xl">
                <CardContainer contentClassName="animate-pulse">
                    {/* Album Image */}
                    <div className="shadow-pressed-xs bg-secondary relative mx-auto -mt-32 size-40 rounded-2xl sm:size-60" />

                    {/* Track Name */}
                    <div className="bg-primary mx-auto mt-6 h-10 w-64 rounded sm:h-16 sm:w-96" />

                    {/* Artists */}
                    <div className="bg-primary mx-auto mt-3 h-4 w-52 rounded sm:w-72" />

                    {/* Album Name */}
                    <div className="bg-primary mx-auto mt-2 h-3 w-40 rounded sm:w-60" />

                    {/* Metadata (duration, date, popularity) */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <div key={idx} className="bg-primary h-3 w-16 rounded" />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center justify-center gap-6">
                        <div className="bg-primary size-9 rounded-full" />
                        <div className="bg-primary size-14 rounded-full" />
                        <div className="bg-primary size-9 rounded-full" />
                    </div>
                </CardContainer>
            </main>
        </section>
    );
};

export default Loading;
