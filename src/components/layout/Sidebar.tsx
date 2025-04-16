'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

import Icon from '@/components/ui/Icon';
import { IMAGE_URL } from '@/constants/client.constants';
import IconSet from '@/constants/icons.constants';
import { APP_ROUTES } from '@/constants/routes.constants';

const sidebarMenuItems = [
    {
        title: 'AniList',
        icon: 'anilist',
        children: [
            { name: 'Anime', link: APP_ROUTES.ANILIST_ANIME },
            { name: 'Manga', link: APP_ROUTES.ANILIST_MANGA },
            { name: 'Favourites', link: APP_ROUTES.ANILIST_FAVOURITES },
            { name: 'Import/Export', link: APP_ROUTES.IMPORT_ANIME_MANGA },
        ],
    },
    {
        title: 'Games',
        icon: 'gamepad',
        children: [
            {
                name: 'Tic Tac Toe',
                children: [
                    { name: 'Classic', link: APP_ROUTES.GAMES_TIC_TAC_TOE_CLASSIC },
                    { name: 'Ultimate', link: APP_ROUTES.GAMES_TIC_TAC_TOE_ULTIMATE },
                ],
            },
            { name: 'Ludo', link: '/games/ludo' },
        ],
    },
    {
        title: 'Audio',
        icon: 'music',
        children: [
            { name: 'Converter', link: APP_ROUTES.AUDIO_CONVERTER },
            { name: 'Tags Editor', link: APP_ROUTES.AUDIO_TAGS_EDITOR },
        ],
    },
    {
        title: 'Profile',
        badge: 14,
        icon: 'person',
        link: APP_ROUTES.DEV,
    },
];

const Sidebar = () => {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const { data: session } = useSession();

    // Close sidebar
    const closeSidebar = () => {
        const sidebar = document.getElementById('sidebar') as HTMLDialogElement;
        sidebar?.close();
        setOpenMenus({});
    };

    const toggleMenu = (index: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <dialog
            id="sidebar"
            className="bg-primary backdrop:bg-primary shadow-floating-md my-auto flex h-screen max-h-dvh w-82 -translate-x-full -translate-y-full scale-0 flex-col overflow-hidden rounded-e-lg border-r opacity-0 transition-all transition-discrete duration-300 backdrop:opacity-65 backdrop:transition-opacity backdrop:transition-discrete backdrop:duration-300 open:translate-x-0 open:translate-y-0 open:scale-100 open:opacity-100 starting:open:-translate-x-full starting:open:-translate-y-full starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:opacity-0"
            onClick={(e) => e.target === e.currentTarget && closeSidebar()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-title">
            {/* Profile Section */}
            <div className="flex items-center justify-between gap-4 border-b p-4">
                <div className="flex items-center gap-3">
                    <Image className="rounded-2xl" width={48} height={48} src={session?.user?.image || IMAGE_URL.PROFILE} alt="Avatar" />
                    <div>
                        <p id="sidebar-title" className="text-text-primary font-alegreya tracking-wide">
                            {session?.user?.name}
                        </p>
                        <p className="text-text-secondary text-xs">{session?.user?.email}</p>
                    </div>
                </div>
                <button
                    type="button"
                    title="Close sidebar"
                    aria-label="Close sidebar"
                    className="text-text-secondary hover:text-text-primary bg-tertiary rounded-full p-1"
                    onClick={() => closeSidebar()}>
                    <Icon icon="close" className="size-6" />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="overflow-y-auto px-4 py-2">
                {sidebarMenuItems.map((item, index) => (
                    <div key={index} className="group mb-1">
                        {item.link ? (
                            <Link
                                href={item.link}
                                className="hover:bg-secondary text-text-secondary hover:text-text-primary flex items-center gap-2 rounded-lg p-2.5 transition"
                                onClick={() => closeSidebar()}>
                                <Icon icon={item.icon as keyof typeof IconSet} className="size-5" />
                                <span className="flex-1">{item.title}</span>
                                {item.badge && <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>}
                            </Link>
                        ) : (
                            <button
                                onClick={() => toggleMenu(`${index}`)}
                                className="hover:bg-secondary text-text-secondary hover:text-text-primary flex w-full items-center justify-between rounded-lg p-2.5 transition"
                                aria-expanded={openMenus[index]}>
                                <div className="flex items-center gap-2">
                                    <Icon icon={item.icon as keyof typeof IconSet} className="size-5" />
                                    <span className="flex-1">{item.title}</span>
                                </div>
                                {item.children && (
                                    <Icon icon="down" className={`size-5 transition-transform ${openMenus[index] ? 'rotate-180' : ''}`} />
                                )}
                            </button>
                        )}

                        {/* Animated Child Menu */}
                        <AnimatePresence>
                            {item.children && openMenus[index] && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pl-6">
                                    {item.children.map((child, idx) => (
                                        <div key={idx}>
                                            {child.link ? (
                                                <Link
                                                    href={child.link}
                                                    className="hover:bg-secondary text-text-secondary hover:text-text-primary block rounded-lg p-2 text-sm transition"
                                                    onClick={() => closeSidebar()}>
                                                    {child.name}
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => toggleMenu(`${index}-${idx}`)}
                                                    className="hover:bg-secondary text-text-secondary hover:text-text-primary flex w-full items-center justify-between rounded-lg p-2 text-sm transition">
                                                    <span className="flex-1 text-left">{child.name}</span>
                                                    {child.children && (
                                                        <Icon
                                                            icon="down"
                                                            className={`size-5 transition-transform ${openMenus[`${index}-${idx}`] ? 'rotate-180' : ''}`}
                                                        />
                                                    )}
                                                </button>
                                            )}

                                            <AnimatePresence>
                                                {child.children && openMenus[`${index}-${idx}`] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="pl-6">
                                                        {child.children.map((subChild, i) => (
                                                            <Link
                                                                key={i}
                                                                href={subChild.link}
                                                                className="hover:bg-secondary text-text-secondary hover:text-text-primary block rounded-lg p-2 text-sm transition"
                                                                onClick={() => closeSidebar()}>
                                                                {subChild.name}
                                                            </Link>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {/* Divider */}
                <div className="my-3 border-t"></div>

                {/* Settings & Logout */}
                <Link
                    href="/"
                    className="hover:bg-secondary text-text-secondary hover:text-text-primary mb-1 flex items-center gap-2 rounded-lg p-2.5 transition">
                    <Icon icon="settings" className="size-5" />
                    <span>Settings</span>
                </Link>

                <Link href="#" className="flex items-center gap-2 rounded-lg p-2.5 text-red-500 transition hover:bg-red-700">
                    <Icon icon="logout" className="size-5" />
                    <span>Log Out</span>
                </Link>
            </nav>
        </dialog>
    );
};

export default Sidebar;
