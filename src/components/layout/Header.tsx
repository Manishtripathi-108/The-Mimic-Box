'use client';

import React, { useEffect } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import InstallPWAButton from '@/components/ui/InstallPWAButton';

import ProfileDropdown from './ProfileDropdown';
import Sidebar from './Sidebar';

const Header = () => {
    useEffect(() => {
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spacing-header-height').trim());
        const header = document.getElementById('page-header');
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (!header) return;

            // Show header when scrolling up or back to the top
            if (currentScrollY < lastScrollY || currentScrollY <= headerHeight) {
                header.style.transform = 'translateY(0)';
                header.style.opacity = '1';
            }
            // Hide header when scrolling down past the header height
            else if (currentScrollY > headerHeight) {
                header.style.transform = 'translateY(-100%)';
                header.style.opacity = '0';
            }

            lastScrollY = currentScrollY;
        };

        // Debounce scroll event for better performance
        const debouncedScroll = () => {
            window.requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', debouncedScroll);

        return () => {
            window.removeEventListener('scroll', debouncedScroll);
        };
    }, []);

    return (
        <>
            <header
                id="page-header"
                className="bg-primary shadow-floating-xs h-header-height sticky top-0 z-50 mb-0.5 flex w-full items-center justify-between gap-2 rounded-b-2xl p-2 transition-all duration-300 ease-in-out sm:gap-6">
                <Button
                    aria-label="Toggle Sidenav"
                    className="shrink-0 rounded-lg"
                    onClick={() => {
                        const sidebar = document.getElementById('sidebar') as HTMLDialogElement;
                        sidebar?.showModal();
                    }}
                    icon="menu"
                />

                <div className="flex w-full items-center justify-center">
                    <Link href="/" className="text-text-primary ml-5 flex items-center gap-2">
                        <p className="sr-only">Go to Home</p>
                        <Icon icon="appLogo" className="size-8" />
                    </Link>
                </div>

                <InstallPWAButton className="shrink-0" />

                <div className="shrink-0">
                    <ProfileDropdown />
                </div>
            </header>

            <Sidebar />
        </>
    );
};

export default Header;
