/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneElement, isValidElement } from 'react';

import cn from '@/lib/utils/cn';

const Slot = <T extends React.ElementType>({ children, className, ...props }: React.ComponentProps<T>) => {
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
