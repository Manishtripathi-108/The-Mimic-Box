'use client';

import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const sidebarMenuItems = [
    {
        title: 'AniList',
        icon: ICON_SET.ANIME,
        children: [
            { name: 'Anime', link: APP_ROUTES.ANILIST.ANIME },
            { name: 'Manga', link: APP_ROUTES.ANILIST.MANGA },
            { name: 'Favourites', link: APP_ROUTES.ANILIST.FAVOURITES },
            { name: 'Import/Export', link: APP_ROUTES.ANILIST.IMPORT_EXPORT },
        ],
    },
    {
        title: 'Games',
        icon: ICON_SET.GAMEPAD,
        children: [
            {
                name: 'Tic Tac Toe',
                children: [
                    { name: 'Classic', link: APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC },
                    { name: 'Ultimate', link: APP_ROUTES.GAMES.TIC_TAC_TOE.ULTIMATE },
                ],
            },
            { name: 'Ludo', link: '/games/ludo' },
        ],
    },
    {
        title: 'Audio',
        icon: ICON_SET.MUSIC,
        children: [
            { name: 'Converter', link: APP_ROUTES.AUDIO.CONVERTER },
            { name: 'Tags Editor', link: APP_ROUTES.AUDIO.TAGS_EDITOR },
        ],
    },
    {
        title: 'Profile',
        badge: 14,
        icon: ICON_SET.PERSON,
        link: APP_ROUTES.SPOTIFY.LOGIN,
    },
];

const Sidebar = () => {
    const closeSidebar = () => {
        const sidebar = document.getElementById('sidebar') as HTMLDialogElement;
        sidebar?.close();
    };

    return (
        <dialog
            id="sidebar"
            className="bg-primary backdrop:bg-primary shadow-neumorphic-md my-auto flex h-screen max-h-dvh w-72 -translate-x-full -translate-y-full scale-0 flex-col overflow-hidden rounded-e-lg border-r opacity-0 transition-all transition-discrete duration-300 backdrop:opacity-65 backdrop:transition-opacity backdrop:transition-discrete backdrop:duration-300 open:translate-x-0 open:translate-y-0 open:scale-100 open:opacity-100 starting:open:-translate-x-full starting:open:-translate-y-full starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:opacity-0"
            onClick={(e) => e.target === e.currentTarget && closeSidebar()}>
            {/* Profile Section */}
            <div className="flex items-center justify-between gap-4 border-b border-dotted p-4">
                <div className="flex items-center gap-3">
                    <Image className="h-12 w-12 rounded-full" width={48} height={48} src="https://picsum.photos/200" alt="Avatar" />
                    <div>
                        <p className="text-text-primary font-semibold">Roronoa Zoro</p>
                        <p className="text-text-secondary text-sm">Sword Master</p>
                    </div>
                </div>
                <button
                    type="button"
                    aria-label="Close"
                    title="Close"
                    className="text-text-secondary hover:text-text-primary cursor-pointer"
                    onClick={closeSidebar}>
                    <Icon icon={ICON_SET.CLOSE} className="size-6" />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="scrollbar-thin space-y-1 overflow-y-auto p-4">
                {sidebarMenuItems.map((item, index) => (
                    <div key={index} className="group">
                        {item.link ? (
                            <Link
                                href={item.link}
                                onClick={closeSidebar}
                                className="hover:text-text-primary text-text-secondary hover: hover:shadow-neumorphic-xs flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left transition">
                                <div className="flex items-center gap-3">
                                    <Icon icon={item.icon} className="size-6" />
                                    <span className="flex-1">{item.title}</span>
                                </div>
                                {item.badge && <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>}
                            </Link>
                        ) : (
                            <>
                                <input type="radio" name="menu" id={`menu-${index}`} className="peer hidden" />
                                <label
                                    htmlFor={`menu-${index}`}
                                    className="peer-checked:text-text-primary hover:text-text-primary text-text-secondary hover: hover:shadow-neumorphic-xs peer-checked: peer-checked:shadow-neumorphic-xs dark:peer-checked:border-secondary flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-inherit p-3 text-left transition">
                                    <div className="flex items-center gap-3">
                                        <Icon icon={item.icon} className="size-6" />
                                        <span className="flex-1">{item.title}</span>
                                    </div>
                                    {item.children && <Icon icon={ICON_SET.DOWN} className="size-5 transition-transform peer-checked:rotate-180" />}
                                    {item.badge && <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">{item.badge}</span>}
                                </label>
                            </>
                        )}

                        {item.children && (
                            <div className="max-h-0 overflow-hidden rounded-lg transition-all duration-300 ease-in-out peer-checked:max-h-screen peer-checked:px-1 peer-checked:py-2">
                                {item.children.map((child, idx) => (
                                    <div key={idx} className="group pl-4">
                                        {child.link ? (
                                            <Link
                                                href={child.link}
                                                onClick={closeSidebar}
                                                className="text-text-secondary hover:text-text-primary hover: hover:shadow-neumorphic-xs flex w-full items-center gap-3 rounded-lg border border-transparent bg-inherit p-2 text-sm transition">
                                                {child.name}
                                            </Link>
                                        ) : (
                                            <>
                                                <input type="radio" name="sub-menu" id={`sub-menu-${index}-${idx}`} className="peer hidden" />
                                                <label
                                                    htmlFor={`sub-menu-${index}-${idx}`}
                                                    className="peer-checked:text-text-primary hover:text-text-primary text-text-secondary flex w-full items-center justify-between rounded-lg border border-transparent p-2 text-sm transition">
                                                    <span className="flex-1">{child.name}</span>
                                                    {child.children && (
                                                        <Icon icon={ICON_SET.DOWN} className="size-5 transition-transform peer-checked:rotate-180" />
                                                    )}
                                                </label>
                                            </>
                                        )}

                                        {/* Sub-Children */}
                                        {child.children && (
                                            <div className="max-h-0 overflow-hidden rounded-lg transition-all duration-300 ease-in-out peer-checked:max-h-screen peer-checked:px-1 peer-checked:py-2">
                                                {child.children.map((subChild, subIdx) => (
                                                    <Link
                                                        key={subIdx}
                                                        href={subChild.link}
                                                        onClick={closeSidebar}
                                                        className="text-text-secondary hover:text-text-primary hover: hover:shadow-neumorphic-xs ml-4 block rounded-lg border border-transparent bg-inherit p-2 text-sm transition">
                                                        {subChild.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <div className="border-t border-dotted"></div>

                <Link href="/" onClick={closeSidebar} className="text-text-secondary flex items-center gap-3 p-3 transition">
                    <Icon icon={ICON_SET.SETTINGS} className="size-6" />
                    <span className="flex-1">Settings</span>
                </Link>

                <Link href="#" onClick={closeSidebar} className="flex items-center gap-3 p-3 text-red-500 transition">
                    <Icon icon={ICON_SET.LOGOUT} className="size-6" />
                    <span className="flex-1">Log Out</span>
                </Link>
            </nav>
        </dialog>
    );
};

export default Sidebar;
