'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import cn from '@/lib/utils/cn';

const NavLink = ({
    href,
    children,
    className,
    activeClassName,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
    activeClassName?: string;
}) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={cn(className, isActive && activeClassName)}>
            {children}
        </Link>
    );
};

export default NavLink;
