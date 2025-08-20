'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { removeMediaFromList, toggleMediaFavouriteStatus, updateMediaProgress } from '@/actions/anilist.actions';
import { Button } from '@/components/ui/Button';
import FromInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import Icon from '@/components/ui/Icon';
import { closeModal } from '@/components/ui/Modals';
import { AnilistMediaListStatusSchema } from '@/lib/schema/anilist.validations';
import { AnilistMediaEntry } from '@/lib/types/anilist.types';

const modalId = 'modal-anilist-edit-media';

const A_EditMedia = ({ token, entry }: { token: string; entry: AnilistMediaEntry }) => {
    const [isLiked, setIsLiked] = useState(entry.media?.isFavourite || false);
    const [isToggling, setIsToggling] = useState(false);
    const maxProgress = entry.media?.episodes || entry.media?.chapters || 100000;

    const validationSchema = z.object({
        status: AnilistMediaListStatusSchema,
        progress: z.coerce.number().min(0).max(maxProgress),
    });

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: { status: entry.status, progress: entry.progress || 0 },
    });

    const onSubmit = async (values: z.infer<typeof validationSchema>) => {
        if (!isDirty) return (toast.success('No changes to save.'), closeModal(modalId));

        const result = await updateMediaProgress(token, entry.media.type, entry.media.id, values.status, values.progress);
        toast[result.success ? 'success' : 'error'](result.message || 'Update failed.');
        closeModal(modalId);
    };

    const toggleLike = async () => {
        setIsToggling(true);
        const result = await toggleMediaFavouriteStatus(token, entry.media.id, entry.media.type);
        setIsToggling(false);

        if (result.success) setIsLiked((prev) => !prev);
        toast[result.success ? 'success' : 'error'](result.message || 'Failed to toggle favourite.');
    };

    const deleteEntry = async () => {
        setIsToggling(true);
        const result = await removeMediaFromList(token, entry.id);
        setIsToggling(false);

        if (result.success) closeModal(modalId);
        toast[result.success ? 'success' : 'error'](result.message || 'Failed to delete entry.');
    };

    return (
        <>
            <div
                className="relative h-44 rounded-t-lg bg-cover bg-center after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/60 after:to-transparent md:h-64"
                style={{ backgroundImage: `url(${entry.media?.bannerImage})` }}
            />

            <div className="bg-primary shadow-neumorphic-inset-xs relative -mt-24 ml-5 max-w-40 rounded-lg border p-3">
                <Image
                    width={500}
                    height={700}
                    className="size-full rounded-lg object-cover"
                    src={entry.media.coverImage.extraLarge}
                    alt={entry.media.title.english || entry.media.title.native}
                    loading="lazy"
                />
            </div>

            <h2 className="text-text-primary font-aladin mt-4 mb-6 ml-7 text-xl tracking-widest capitalize">
                {entry.media.title.english || entry.media.title.native || entry.media.title.romaji || 'Unknown Title'}
            </h2>

            <Button
                icon="heart"
                className={`absolute top-2/4 right-8 rounded-full p-2 ${isLiked ? 'text-danger' : ''}`}
                active={isLiked}
                onClick={toggleLike}
                disabled={isToggling}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4">
                <div className="grid grid-cols-2 place-items-center gap-4">
                    <FormSelect
                        name="status"
                        label="Status:"
                        options={AnilistMediaListStatusSchema.options.map((option) => ({ value: option, label: option.toLowerCase() }))}
                        control={control}
                        classNames={{ field: 'capitalize' }}
                        disabled={isToggling || isSubmitting}
                    />

                    <FromInput
                        name="progress"
                        label="Episode Progress"
                        type="number"
                        disabled={isToggling || isSubmitting}
                        classNames={{ label: 'font-alegreya text-base' }}
                        control={control}
                    />
                </div>

                <div className="mt-8 flex justify-end space-x-2">
                    <Button variant="danger" onClick={deleteEntry} disabled={isToggling || isSubmitting}>
                        {isToggling || isSubmitting ? <Icon icon="loading" className="size-5" /> : 'Remove'}
                    </Button>
                    <Button type="submit" disabled={isToggling || isSubmitting}>
                        {isToggling || isSubmitting ? <Icon icon="loading" className="size-5" /> : 'Save'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default A_EditMedia;
