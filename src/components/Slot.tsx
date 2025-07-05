/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLAttributes, ReactNode, cloneElement, isValidElement } from 'react';

import cn from '@/lib/utils/cn';

type SlotProps = {
    children: ReactNode;
    className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

const Slot = ({ children, className, ...props }: SlotProps) => {
    const validChild = Array.isArray(children) ? children.find((c) => isValidElement(c)) : isValidElement(children) ? children : null;

    if (validChild) {
        return cloneElement(validChild as React.ReactElement<any>, {
            ...props,
            className: cn(className, (validChild as React.ReactElement<any>).props.className),
        });
    }

    return <>{children}</>;
};

export default Slot;
