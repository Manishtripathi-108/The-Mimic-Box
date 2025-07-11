'use client';

import { useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AnimatePresence, motion } from 'motion/react';
import { useSession } from 'next-auth/react';

import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import LogoutButton from '@/components/ui/LogoutButton';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import APP_ROUTES from '@/constants/routes/app.routes';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import { useClickOutside } from '@/hooks/useClickOutside';
import useTheme from '@/hooks/useTheme';
import useToggle from '@/hooks/useToggle';

const ProfileDropdown = () => {
    const { cycleTheme, nextTheme } = useTheme();
    const { data: session, status } = useSession();
    const [isOpen, { setDefault: hide, toggle }] = useToggle(false, true, {
        keybind: 'Escape',
        toggleOnKeyTo: false,
    });
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside({
        targets: [dropdownRef],
        onClickOutside: () => {
            if (isOpen) hide();
        },
        disabled: !isOpen,
    });

    // Show nothing until session is loaded to prevent flicker
    if (status === 'loading') return <Button className="cursor-wait" icon="loading" />;

    // If user is NOT logged in, show only the login button
    if (!session?.user) {
        return (
            <Button asChild className="rounded-full">
                <Link href={DEFAULT_AUTH_ROUTE}>
                    <Icon icon="login" className="size-5" />
                    Login
                </Link>
            </Button>
        );
    }

    const { name, email, image } = session.user;

    return (
        <div className="relative shrink-0" ref={dropdownRef}>
            {/* Profile Button */}
            <Button onClick={() => toggle()} className="ignore-onClickOutside mt-1 h-auto w-fit overflow-hidden rounded-full p-0.5">
                <Image src={image || IMAGE_FALLBACKS.PROFILE} alt="Profile" width={28} height={28} className="size-7 rounded-full object-cover" />
            </Button>

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
                                    src={image || IMAGE_FALLBACKS.PROFILE}
                                    alt="Profile"
                                    width={72}
                                    height={72}
                                    className="text-text-secondary size-18 rounded-2xl object-cover"
                                />
                            </div>
                            <h3 className="text-text-primary text-lg font-semibold">{name}</h3>
                            <p className="text-text-secondary text-sm">{email}</p>
                        </div>

                        <div className="text-text-secondary">
                            <Link
                                onClick={hide}
                                href={APP_ROUTES.USER.PROFILE}
                                className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon="person" className="size-5" />
                                <span>My Profile</span>
                            </Link>
                            <Link
                                onClick={hide}
                                href={APP_ROUTES.USER.LINKED_ACCOUNTS}
                                className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon="link" className="size-5" />
                                <span>Linked Accounts</span>
                            </Link>
                            <Link
                                onClick={hide}
                                href={APP_ROUTES.USER.SETTINGS}
                                className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon="settings" className="size-5" />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={() => cycleTheme()}
                                className="hover:bg-primary hover:text-text-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2">
                                <Icon icon={nextTheme === 'system' ? 'desktop' : nextTheme === 'dark' ? 'moon' : 'sun'} className="size-5" />
                                <span>Switch to {nextTheme} Mode</span>
                            </button>
                        </div>

                        <hr className="my-2" />

                        <LogoutButton className="hover:bg-primary flex w-full cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2 text-red-500">
                            <Icon icon="logout" className="size-5" />
                            <span>Logout</span>
                        </LogoutButton>

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
