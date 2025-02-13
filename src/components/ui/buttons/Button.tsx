'use client';

import cn from '@/lib/utils/cn';
import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => {
    return (
        <button className={cn('button', className)} {...props}>
            {children}
        </button>
    );
};

export default Button;
