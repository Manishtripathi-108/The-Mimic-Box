import Link from 'next/link';

import { APP_ROUTES } from '@/constants/routes.constants';

const features = [
    {
        category: 'AniList',
        items: [
            { name: 'Anime', href: APP_ROUTES.ANILIST.USER.ANIME },
            { name: 'Manga', href: APP_ROUTES.ANILIST.USER.MANGA },
            { name: 'Favourites', href: APP_ROUTES.ANILIST.USER.FAVOURITES },
        ],
    },
    {
        category: 'Audio',
        items: [
            { name: 'Converter', href: APP_ROUTES.AUDIO.CONVERTER },
            { name: 'Tags Editor', href: APP_ROUTES.AUDIO.TAGS_EDITOR },
            { name: 'Search Lyrics', href: APP_ROUTES.AUDIO.SEARCH_LYRICS },
        ],
    },
    {
        category: 'Music',
        items: [
            { name: 'Dashboard', href: APP_ROUTES.MUSIC.DASHBOARD },
            { name: 'Playlists', href: APP_ROUTES.MUSIC.PLAYLISTS },
        ],
    },
    {
        category: 'Games',
        items: [
            { name: 'Tic Tac Toe', href: APP_ROUTES.GAMES.TIC_TAC_TOE.ROOT },
            { name: 'Classic', href: APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC },
            { name: 'Ultimate', href: APP_ROUTES.GAMES.TIC_TAC_TOE.ULTIMATE },
        ],
    },
    {
        category: 'Tune Sync',
        items: [{ name: 'Remove Duplicates', href: APP_ROUTES.TUNE_SYNC.REMOVE_DUPLICATES.ROOT }],
    },
];

const Page = () => {
    return (
        <div className="bg-primary text-text-secondary min-h-screen p-6">
            <div className="mx-auto max-w-5xl">
                <h1 className="text-text-primary font-alegreya mb-10 text-center text-4xl font-bold tracking-wide">
                    Welcome to <span className="text-highlight">The Mimic Box</span>
                </h1>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
                    {features.map((section) => (
                        <div key={section.category} className="from-secondary to-tertiary shadow-floating-sm rounded-2xl bg-linear-150 p-6">
                            <h2 className="text-highlight mb-4 text-2xl font-semibold">{section.category}</h2>
                            <ul className="space-y-3">
                                {section.items.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="bg-primary hover:text-text-primary block rounded-lg px-4 py-2 text-sm transition">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
