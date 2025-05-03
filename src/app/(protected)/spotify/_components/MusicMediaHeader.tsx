import { ReactNode } from 'react';

import Image from 'next/image';

const MusicMediaHeader = ({
    title,
    description,
    coverImage,
    metadata,
    children,
}: {
    title: string;
    description?: string | null;
    coverImage?: string;
    metadata?: string;
    children?: ReactNode;
}) => {
    return (
        <>
            <h1 className="font-alegreya text-center text-2xl font-bold tracking-wide sm:hidden">{title}</h1>

            <section className="text-text-primary mt-4 mb-8 flex flex-col gap-6 px-4 sm:flex-row sm:items-end">
                <div className="bg-secondary shadow-floating-sm relative mx-auto aspect-square w-full max-w-60 shrink-0 rounded-2xl p-2 sm:mx-0">
                    {coverImage && (
                        <Image src={coverImage} alt={`${title} Cover`} width={240} height={240} className="aspect-square rounded-xl border" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="hidden text-4xl font-extrabold sm:block md:text-5xl">{title}</h1>

                    {description && <p className="text-text-secondary text-center text-sm sm:text-left">{description}</p>}

                    {(metadata || children) && (
                        <p className="text-text-secondary text-center text-sm sm:text-left">
                            {children}
                            {metadata && children ? '\u00A0•\u00A0' : ''}
                            {metadata}
                        </p>
                    )}
                </div>
            </section>
        </>
    );
};
export const MusicMediaHeaderSkeleton = () => {
    return (
        <>
            <div className="bg-secondary mx-auto h-8 w-40 animate-pulse rounded sm:hidden" />

            <section className="text-text-primary mt-4 mb-8 flex animate-pulse flex-col gap-6 px-4 sm:flex-row sm:items-end">
                <div className="shadow-floating-sm bg-secondary mx-auto aspect-square w-full max-w-60 shrink-0 rounded-xl p-2 sm:mx-0" />

                <div className="flex flex-col gap-3">
                    <div className="bg-secondary hidden h-10 w-60 rounded sm:block md:h-12 lg:h-16" />
                    <div className="bg-secondary h-4 w-64 rounded sm:w-80" />
                    <div className="text-text-secondary flex gap-2 text-sm">
                        <div className="bg-secondary h-4 w-24 rounded" />
                        <div className="bg-secondary h-4 w-16 rounded" />
                    </div>
                </div>
            </section>
        </>
    );
};

export default MusicMediaHeader;
