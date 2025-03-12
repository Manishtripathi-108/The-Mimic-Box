'use client';

import React from 'react';

import { signOut } from 'next-auth/react';

import cn from '@/lib/utils/cn';

const LogoutButton = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    return (
        <button type="button" onClick={() => signOut()} title="Logout" className={cn(className)}>
            {children || 'Logout'}
        </button>
    );
};

export default LogoutButton;
