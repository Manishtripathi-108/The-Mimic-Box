'use client';

import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import APP_ROUTES from '@/constants/routes/app.routes';
import { T_IconType } from '@/lib/types/client.types';

const platforms: {
    name: string;
    icon: T_IconType;
    route: string;
    color: string;
}[] = [
    {
        name: 'Spotify',
        icon: 'spotify',
        route: APP_ROUTES.TUNE_SYNC.REMOVE_DUPLICATES.SPOTIFY,
        color: 'text-success',
    },
    {
        name: 'JioSaavn',
        icon: 'jiosaavn',
        route: APP_ROUTES.TUNE_SYNC.REMOVE_DUPLICATES.SAAVN,
        color: 'text-blue-500',
    },
    {
        name: 'Apple Music',
        icon: 'apple',
        route: APP_ROUTES.TUNE_SYNC.REMOVE_DUPLICATES.ITUNES,
        color: 'text-black',
    },
];

const Page = () => {
    return (
        <main className="bg-primary p-2 sm:p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold tracking-wider">Remove Duplicate Tracks</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {platforms.map((platform) => (
                    <Link
                        key={platform.route}
                        href={platform.route}
                        className={`shadow-floating-xs group text-text-secondary hover:text-accent flex items-center justify-start gap-4 rounded-xl p-4 transition-colors`}>
                        <Icon icon={platform.icon} className={`group-hover:text-accent size-10 transition-colors ${platform.color}`} />
                        <span className="text-xl font-medium">{platform.name}</span>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default Page;
