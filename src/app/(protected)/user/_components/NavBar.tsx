'use client';

import { APP_ROUTES } from '@/constants/routes.constants';
import Link from 'next/link';
import React from 'react';

const NavBar = () => {
    return (
        <div className="shadow-floating-xs to-tertiary from-secondary mx-auto mb-5 flex w-4/6 gap-x-2 rounded-xl bg-linear-120 from-15% to-85% p-2">
            <Link href={APP_ROUTES.USER.PROFILE} className="button active w-full text-nowrap">
                My Profile
            </Link>
            <Link href={APP_ROUTES.USER.LINKED_ACCOUNTS} className="button w-full text-nowrap">
                Linked Accounts
            </Link>
            <Link href={APP_ROUTES.USER.SETTINGS} className="button w-full text-nowrap">
                Settings
            </Link>
        </div>
    );
};

export default NavBar;
