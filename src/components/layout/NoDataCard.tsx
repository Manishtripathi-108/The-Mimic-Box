import { ReactNode } from 'react';

import Image from 'next/image';

import { IMAGE_URL } from '@/constants/client.constants';
import cn from '@/lib/utils/cn';

type NoDataCardProps = {
    message?: string;
    className?: string;
    children?: ReactNode;
};

export const NoDataCard = ({ message = 'Nothing to show here yet.', children, className }: NoDataCardProps) => {
    return (
        <section
            className={cn('shadow-floating-xs from-secondary to-tertiary gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6 text-center', className)}>
            <Image src={IMAGE_URL.NO_DATA} alt="No data available" className="mx-auto" width={250} height={250} />
            <h2 className="text-text-primary font-alegreya text-xl font-semibold tracking-wide">{message}</h2>

            {children && <div className="mt-4">{children}</div>}
        </section>
    );
};
