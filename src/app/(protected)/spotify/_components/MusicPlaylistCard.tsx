'use client';

import Image from 'next/image';

type Props = {
    name: string;
    description: string | null;
    imageUrl: string;
    tracksHref: string;
};

const MusicPlaylistCard = ({ name, description, imageUrl, tracksHref }: Props) => (
    <div
        data-href={tracksHref}
        className="from-secondary to-tertiary shadow-floating-xs flex items-center gap-4 rounded-2xl bg-linear-150 from-15% to-85% p-3 pr-5">
        <Image src={imageUrl} alt={name} width={50} height={50} className="shrink-0 rounded-xl object-cover" />
        <div>
            <p title={name} className="text-text-primary line-clamp-1 font-semibold">
                {name}
            </p>
            <p className="line-clamp-1 text-sm">{description}</p>
        </div>
    </div>
);

export default MusicPlaylistCard;
