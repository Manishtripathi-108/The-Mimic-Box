'use client';

import Image from 'next/image';

type Props = {
    title: string;
    imageUrl: string;
    musicCount: number;
};

const MusicCategoryCard = ({ title, imageUrl, musicCount }: Props) => (
    <div className="group relative shrink-0 overflow-hidden rounded-xl">
        <Image src={imageUrl} alt={title} width={300} height={144} className="h-36 w-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-300">{musicCount} music</p>
        </div>
    </div>
);

export default MusicCategoryCard;
