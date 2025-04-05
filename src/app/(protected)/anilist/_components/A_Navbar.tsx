'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@iconify/react';

import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';

const A_Navbar = () => {
    const pathName = usePathname();

    return (
        <nav className="bg-secondary/75 saturate-150 backdrop-blur-xs">
            <ul className="flex justify-center">
                <li>
                    <Link
                        href={APP_ROUTES.ANILIST_SEARCH('anime')}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.ANILIST_SEARCH('anime')
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        <Icon icon={ICON_SET.SEARCH} className="size-5" />
                        <span className="hidden md:inline">Search</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={APP_ROUTES.ANILIST_ANIME}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.ANILIST_ANIME
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        <Icon icon={ICON_SET.ANIME} className="size-5" />
                        <span className="hidden md:inline">Anime List</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={APP_ROUTES.ANILIST_MANGA}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.ANILIST_MANGA
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        {' '}
                        <Icon icon={ICON_SET.MANGA} className="size-5" />
                        <span className="hidden md:inline">Manga List</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={APP_ROUTES.ANILIST_FAVOURITES}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.ANILIST_FAVOURITES
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        {' '}
                        <Icon icon={ICON_SET.HEART} className="size-5" />
                        <span className="hidden md:inline">Favourites</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={APP_ROUTES.IMPORT_ANIME_MANGA}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.IMPORT_ANIME_MANGA
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        {' '}
                        <Icon icon={ICON_SET.UPLOAD} className="size-5" />
                        <span className="hidden md:inline">Import/Export</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default A_Navbar;
