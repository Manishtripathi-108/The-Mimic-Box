'use client';

import dynamic from 'next/dynamic';

const FfmpegLoader = dynamic(() => import('@/app/dev/_components/FfmpegLoader'), {
    ssr: false,
});

const Page = () => {
    return (
        <div className="mx-auto max-w-5xl pt-32">
            <FfmpegLoader />
        </div>
    );
};

export default Page;
