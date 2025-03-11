'use client';

import cn from '@/lib/utils/cn';
import { signOut } from 'next-auth/react';
import React from 'react';

const LogoutButton = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
    return (
        <button type="button" onClick={() => signOut()} title="Logout" className={cn(className)}>
            {children || 'Logout'}
        </button>
    );
};

export default LogoutButton;
