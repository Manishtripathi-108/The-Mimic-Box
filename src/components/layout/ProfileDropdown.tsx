'use client';

import ICON_SET from '@/constants/icons';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes.constants';
import useTheme from '@/hooks/useTheme';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const session = useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // If user is NOT logged in, show only the login button
    if (!session.data) {
        return (
            <Link
                href={DEFAULT_AUTH_ROUTE}
                className="bg-primary hover:text-text-primary text-text-secondary shadow-floating-xs flex cursor-pointer items-center gap-x-1 rounded-full px-4 py-2">
                <Icon icon={ICON_SET.LOGIN} className="size-5" />
                <span>Login</span>
            </Link>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="relative flex w-fit cursor-pointer items-center rounded-full">
                <Image
                    src={session.data?.user?.image || 'https://picsum.photos/200'}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="text-text-secondary rounded-full object-cover"
                />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="from-secondary to-tertiary shadow-floating-xs absolute right-2 z-50 mt-5 w-72 rounded-3xl border bg-linear-150 from-15% to-85% p-2">
                        <div className="shadow-pressed-xs mb-2 flex aspect-[4/3] w-full flex-col items-center justify-center rounded-2xl border">
                            <div className="shadow-floating-xs mb-2 flex items-center justify-center rounded-3xl border p-2">
                                <Image
                                    src={session.data?.user?.image || 'https://picsum.photos/200'}
                                    alt="Profile"
                                    width={72}
                                    height={72}
                                    className="text-text-secondary aspect-square w-18 rounded-2xl object-cover"
                                />
                            </div>
                            <h3 className="text-text-primary text-lg font-semibold">{session.data?.user?.name}</h3>
                            <p className="text-text-secondary text-sm">{session.data?.user?.email}</p>
                        </div>

                        <div className="text-text-secondary">
                            <button className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon={ICON_SET.PERSON} className="size-5" />
                                <span>My Profile</span>
                            </button>
                            <button className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon={ICON_SET.EMAIL} className="size-5" />
                                <span>Email Settings</span>
                            </button>
                            <button className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon={ICON_SET.SETTINGS} className="size-5" />
                                <span>Settings</span>
                            </button>
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon={ICON_SET[theme === 'dark' ? 'SUN' : 'MOON']} className="size-5" />
                                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                            </button>
                        </div>

                        <hr className="my-2" />

                        <button
                            onClick={() => signOut()}
                            className="hover:bg-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2 text-red-500">
                            <Icon icon={ICON_SET.LOGOUT} className="size-5" />
                            <span>Logout</span>
                        </button>

                        <hr className="mt-2 mb-1" />

                        <div className="text-text-secondary text-center text-xs">
                            <div className="inline hover:underline">Privacy Policy</div> •{' '}
                            <div className="inline hover:underline">Terms of Service</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
