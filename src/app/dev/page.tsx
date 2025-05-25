'use client';

import dynamic from 'next/dynamic';

const FfmpegLoader = dynamic(() => import('@/app/dev/_components/FfmpegLoader'), {
    ssr: false,
});

const Page = () => {
    return (
        <div className="mx-auto max-w-5xl pt-32">
            <div className="flex flex-col gap-10 px-6 pb-10 lg:grid lg:h-[calc(100dvh-130px)] lg:grid-cols-8 lg:px-0">
                <FfmpegLoader />
            </div>
        </div>
    );
};

export default Page;
