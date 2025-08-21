import { ReactNode } from 'react';

import Image from 'next/image';

import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import cn from '@/lib/utils/cn';

type NoDataCardProps = {
    message?: string;
    className?: string;
    children?: ReactNode;
};

export const NoDataCard = ({ message = 'Nothing to show here yet.', children, className }: NoDataCardProps) => {
    return (
        <section className={cn('shadow-floating-xs bg-gradient-secondary-to-tertiary gap-6 rounded-xl p-6 text-center', className)}>
            <Image src={IMAGE_FALLBACKS.NO_DATA} alt="No data available" className="mx-auto" width={250} height={250} />
            <h2 className="text-text-primary font-alegreya text-xl font-semibold tracking-wide">{message}</h2>

            {children && <div className="mt-4">{children}</div>}
        </section>
    );
};
