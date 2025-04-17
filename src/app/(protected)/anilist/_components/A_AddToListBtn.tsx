'use client';

import React from 'react';

import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { getUserMediaEntry, updateMediaProgress } from '@/actions/anilist.actions';
import Icon from '@/components/ui/Icon';
import { ConnectAccount } from '@/components/ui/LinkedAccountButtons';
import { AnilistMediaListStatusSchema } from '@/lib/schema/anilist.validations';
import { AnilistMediaListStatus, AnilistMediaType } from '@/lib/types/anilist.types';
import cn from '@/lib/utils/cn';

type Props = {
    mediaId: number;
    type: AnilistMediaType;
    className?: string;
};

const A_AddToListBtn = ({ mediaId, type, className }: Props) => {
    const { data: session, status } = useSession();
    const anilist = session?.user?.linkedAccounts?.anilist;

    const [isPending, startTransition] = React.useTransition();
    const [mediaStatus, setMediaStatus] = React.useState<AnilistMediaListStatus | 'add to list'>('add to list');

    React.useEffect(() => {
        if (!anilist?.accessToken) return;

        const fetchMediaStatus = async () => {
            const response = await getUserMediaEntry(anilist.accessToken, anilist.id, mediaId, type);
            if (response.success && response.payload?.status) {
                setMediaStatus(response.payload.status);
            }
        };

        fetchMediaStatus();
    }, [anilist, mediaId, type]);

    if (status === 'loading') return null;

    if (!anilist?.accessToken) {
        return (
            <ConnectAccount account="anilist" className={cn('button button-highlight mt-4 capitalize', className)}>
                Connect Anilist Account to add to list
            </ConnectAccount>
        );
    }

    const handleAddToList = (value: AnilistMediaListStatus | 'add to list') => {
        if (isPending) return;

        const popover = document.getElementById('add-to-list');
        if (popover) popover.hidePopover();

        const parsed = AnilistMediaListStatusSchema.safeParse(value);
        if (!parsed.success) return toast.error('Invalid status selected.');

        startTransition(async () => {
            const result = await updateMediaProgress(anilist.accessToken, type, mediaId, parsed.data, 0);
            toast[result.success ? 'success' : 'error'](result.message || 'Failed to add to list.');
            if (result.success) setMediaStatus(parsed.data);
        });
    };

    return (
        <div className="relative">
            <button popoverTarget="add-to-list" disabled={isPending} className={cn('button button-highlight mt-4 gap-1 capitalize', className)}>
                {isPending ? (
                    <>
                        <Icon icon="loading" className="size-5" /> Saving...
                    </>
                ) : (
                    <>
                        <Icon icon="down" className="size-5" /> {mediaStatus?.toLowerCase() ?? 'Add to list'}
                    </>
                )}
            </button>

            <div
                id="add-to-list"
                popover="auto"
                role="menu"
                aria-label="Add to list"
                className="bg-primary text-text-secondary absolute z-10 mt-2 origin-top scale-y-0 rounded-md shadow-lg transition-transform [position-area:bottom] open:scale-y-100 starting:open:scale-y-0">
                <ul className="divide-y">
                    {AnilistMediaListStatusSchema.options.map((option) => (
                        <li
                            role="menuitem"
                            tabIndex={0}
                            key={option}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddToList(option);
                                }
                            }}
                            onClick={() => handleAddToList(option)}
                            className="hover:bg-highlight hover:text-text-primary cursor-pointer px-4 py-2 capitalize">
                            {option.toLowerCase()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default A_AddToListBtn;
