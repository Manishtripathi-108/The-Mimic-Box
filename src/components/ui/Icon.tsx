import React, { memo } from 'react';

import { IconProps, Icon as Iconify } from '@iconify/react';

import IconSet from '@/constants/icons.constants';
import { T_IconType } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

type Props = {
    icon: T_IconType;
    className?: string;
} & Omit<IconProps, 'icon' | 'className'>;

const Icon = ({ icon, className, ...props }: Props) => {
    return <Iconify icon={IconSet[icon]} className={cn('size-full', className)} {...props} />;
};

export default memo(Icon);
