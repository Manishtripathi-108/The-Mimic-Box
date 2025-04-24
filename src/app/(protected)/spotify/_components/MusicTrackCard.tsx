'use client';

import Image from 'next/image';

import Icon from '@/components/ui/Icon';

type Props = {
    name: string;
    description: string | null;
    imageUrl: string;
    isPlaying?: boolean;
    liked?: boolean;
    tracksHref?: string;
};

const MusicTrackCard = ({ name, description, imageUrl, isPlaying, liked }: Props) => (
    <div className="from-secondary to-tertiary shadow-floating-xs flex items-center justify-between gap-4 rounded-2xl bg-linear-150 from-15% to-85% p-3 pr-5">
        <div className="flex items-center gap-3">
            <button className="hover:text-text-primary size-7 shrink-0 transition-colors">
                <Icon icon={isPlaying ? 'pauseToPlay' : 'playToPause'} className="size-full" />
            </button>
            <Image src={imageUrl} alt={name} width={50} height={50} className="shrink-0 rounded-xl object-cover" />
            <div>
                <p title={name} className="text-text-primary line-clamp-1 font-semibold">
                    {name}
                </p>
                {description && (
                    <p title={description} className="line-clamp-1 text-sm">
                        {description}
                    </p>
                )}
            </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
            <span>2:30</span>
            <button className={`size-5 transition-colors ${liked ? 'hover:text-text-primary' : 'text-red-500'}`} title={liked ? 'Unlike' : 'Like'}>
                <Icon icon="heart" className="size-full" />
            </button>
        </div>
    </div>
);

export default MusicTrackCard;
