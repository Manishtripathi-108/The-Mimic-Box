import Image from 'next/image';
import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import { T_IconType } from '@/lib/types/client.types';

type LinkCardProps = {
    title: string;
    sub?: string;
    thumbnailUrl: string;
    href: string;
    icon?: T_IconType;
    srText?: string;
};

const LinkCard = ({ title, sub, thumbnailUrl, href, icon, srText }: LinkCardProps) => {
    return (
        <article className="text-text-primary relative grid w-40 shrink-0 grid-rows-[auto_1fr] gap-1">
            <Link
                href={href}
                className="group relative block aspect-square w-full overflow-hidden rounded-xl focus:outline-none"
                title={`${title}`}
                aria-label={`${title}`}>
                <Image
                    src={thumbnailUrl}
                    alt={`${title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105 group-focus:scale-105"
                />

                {/* Overlay */}
                {icon && (
                    <div className="bg-secondary/40 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-xs backdrop-saturate-150 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                        <Icon icon={icon} className="size-14" />
                    </div>
                )}

                {/* Screen reader text */}
                <span className="sr-only">{srText}</span>
            </Link>

            <div className="flex flex-col gap-0.5 overflow-hidden">
                <h3 className="text-text-primary line-clamp-2 text-sm font-semibold">{title}</h3>
                {sub && <p className="text-text-secondary truncate text-sm">{sub}</p>}
            </div>
        </article>
    );
};

export const LinkCardSkeleton = () => {
    return (
        <div className="text-text-primary relative grid w-40 shrink-0 animate-pulse grid-rows-[auto_1fr] gap-1">
            <div className="bg-secondary relative block aspect-square w-full overflow-hidden rounded-xl" />

            <div className="flex flex-col gap-0.5 overflow-hidden">
                <div className="bg-secondary h-4 w-full rounded" />
                <div className="bg-secondary h-3 w-2/3 rounded" />
            </div>
        </div>
    );
};

export default LinkCard;
