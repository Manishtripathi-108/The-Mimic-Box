'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Icon from '@/components/ui/Icon';
import APP_ROUTES from '@/constants/routes/app.routes';

const A_Navbar = () => {
    const pathName = usePathname();

    return (
        <nav className="bg-secondary/75 backdrop-blur-xs backdrop-saturate-150">
            <ul className="flex justify-center">
                <li className="relative">
                    <button
                        id="search-button"
                        popoverTarget="search-popover"
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName.includes('/search')
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        <Icon icon="search" className="size-5" />
                        <span className="hidden md:inline">Search</span>
                    </button>

                    <div
                        id="search-popover"
                        popover="auto"
                        className="bg-tertiary text-text-secondary absolute inset-auto m-0 overflow-hidden rounded-md shadow-lg [position-area:bottom]">
                        <ul className="divide-y">
                            <li>
                                <Link
                                    href={APP_ROUTES.ANILIST.SEARCH('anime')}
                                    className="hover:bg-highlight hover:text-on-highlight block px-4 py-2">
                                    Anime
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={APP_ROUTES.ANILIST.SEARCH('manga')}
                                    className="hover:bg-highlight hover:text-on-highlight block px-4 py-2">
                                    Manga
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <Link
                        href={APP_ROUTES.ANILIST.USER.ANIME}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.ANILIST.USER.ANIME
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        <Icon icon="anime" className="size-5" />
                        <span className="hidden md:inline">Anime List</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={APP_ROUTES.ANILIST.USER.MANGA}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.ANILIST.USER.MANGA
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        {' '}
                        <Icon icon="manga" className="size-5" />
                        <span className="hidden md:inline">Manga List</span>
                    </Link>
                </li>
                <li>
                    <Link
                        href={APP_ROUTES.ANILIST.USER.FAVOURITES}
                        className={`flex items-center justify-center gap-2 border-b-2 px-4 py-3 transition-colors ${
                            pathName === APP_ROUTES.ANILIST.USER.FAVOURITES
                                ? 'text-highlight border-highlight'
                                : 'hover:text-highlight text-text-secondary hover:border-highlight border-transparent'
                        }`}>
                        {' '}
                        <Icon icon="heart" className="size-5" />
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
                        <Icon icon="upload" className="size-5" />
                        <span className="hidden md:inline">Import/Export</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default A_Navbar;
