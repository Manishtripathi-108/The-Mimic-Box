'use client';

import React from 'react';

import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { saveMediaEntry } from '@/actions/anilist.actions';
import { ConnectAccount } from '@/components/ui/LinkedAccountButtons';
import { AnilistMediaListStatusSchema } from '@/lib/schema/client.validations';
import cn from '@/lib/utils/cn';

type Props = {
    mediaId: number;
    className?: string;
};

const A_AddToListBtn = ({ mediaId, className }: Props) => {
    const { data: session, status } = useSession();
    const token = session?.user?.linkedAccounts?.anilist?.accessToken;
    const [isPending, startTransition] = React.useTransition();

    if (status === 'loading') return null;

    if (!token) {
        return (
            <ConnectAccount account="anilist" className={cn('button button-highlight mt-4 capitalize', className)}>
                Connect Anilist Account to add to list
            </ConnectAccount>
        );
    }

    const handleAddToList = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (isPending) return;
        const rawValue = e.target.value.toUpperCase();
        const parsed = AnilistMediaListStatusSchema.safeParse(rawValue);

        if (!parsed.success) return toast.error('Invalid status selected.');

        startTransition(async () => {
            const result = await saveMediaEntry(token, mediaId, parsed.data, 0);
            toast[result.success ? 'success' : 'error'](result.message || 'Failed to add to list.');
        });
    };

    return (
        <select onChange={handleAddToList} disabled={isPending} className={cn('button button-highlight mt-4 capitalize', className)} defaultValue="">
            <option disabled value="">
                {isPending ? 'Saving...' : 'Add to list'}
            </option>

            {AnilistMediaListStatusSchema.options.map((option) => (
                <option key={option} value={option}>
                    {option.toLowerCase()}
                </option>
            ))}
        </select>
    );
};

export default A_AddToListBtn;
