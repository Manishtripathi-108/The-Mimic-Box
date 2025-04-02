'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { deleteMediaEntry, saveMediaEntry, toggleFavourite } from '@/actions/anilist.actions';
import Modal, { closeModal } from '@/components/Modals';
import ICON_SET from '@/constants/icons';
import { AnilistMediaListStatusSchema } from '@/lib/schema/client.validations';
import { AnilistMediaEntry } from '@/lib/types/anilist.types';

const modalId = 'modal-anilist-edit-media';

const A_EditMedia = ({ token, entry, onClose }: { token: string; entry: AnilistMediaEntry; onClose?: () => void }) => {
    const [isLiked, setIsLiked] = useState(entry.media?.isFavourite || false);
    const [isToggling, setIsToggling] = useState(false);
    const maxProgress = entry.media?.episodes || entry.media?.chapters || 100000;

    const validationSchema = z.object({
        status: AnilistMediaListStatusSchema,
        progress: z.number().min(0).max(maxProgress),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: { status: entry.status, progress: entry.progress || 0 },
    });

    const onSubmit = async (values: z.infer<typeof validationSchema>) => {
        if (!isDirty) return toast.success('No changes to save.'), closeModal(modalId);

        const result = await saveMediaEntry(token, entry.media.id, values.status, values.progress);
        toast[result.success ? 'success' : 'error'](result.message || 'Update failed.');
        closeModal(modalId);
    };

    const toggleLike = async () => {
        setIsToggling(true);
        const result = await toggleFavourite(token, entry.media.id, entry.media.type);
        setIsToggling(false);

        if (result.success) setIsLiked((prev) => !prev);
        toast[result.success ? 'success' : 'error'](result.message || 'Failed to toggle favourite.');
    };

    const deleteEntry = async () => {
        setIsToggling(true);
        const result = await deleteMediaEntry(token, entry.id);
        setIsToggling(false);

        if (result.success) closeModal(modalId);
        toast[result.success ? 'success' : 'error'](result.message || 'Failed to delete entry.');
    };

    return (
        <Modal modalId="modal-anilist-edit-media" onClose={onClose}>
            <div
                className="relative h-44 rounded-t-lg bg-cover bg-center after:absolute after:size-full after:opacity-40 md:h-64"
                style={{ backgroundImage: `url(${entry.media?.bannerImage})` }}
            />

            <div className="bg-primary shadow-neumorphic-inset-xs relative -mt-24 ml-5 max-w-40 rounded-lg border p-3">
                <Image
                    width={200}
                    height={300}
                    className="size-full rounded-lg object-cover"
                    src={entry.media.coverImage?.large}
                    alt={entry.media.title?.english || entry.media.title?.native}
                    loading="lazy"
                />
            </div>

            <h2 className="text-text-primary font-aladin mt-4 mb-6 ml-7 text-xl tracking-widest capitalize">
                {entry.media.title?.english || entry.media.title?.native || entry.media.title?.romaji || 'Unknown Title'}
            </h2>

            <button
                type="button"
                className={`button absolute top-2/4 right-8 cursor-pointer rounded-full p-2 ${
                    isLiked ? 'shadow-neumorphic-inset-xs text-red-500 dark:text-red-500' : ''
                }`}
                onClick={toggleLike}
                disabled={isToggling}>
                <Icon icon={ICON_SET.HEART} className="size-5 text-inherit" />
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4">
                <div className="grid grid-cols-2 place-items-center gap-4">
                    <div className="form-group">
                        <label htmlFor="media_status" className="form-text">
                            Status:
                        </label>
                        <select {...register('status')} id="media_status" data-invalid={!!errors.status} className="form-field capitalize">
                            {AnilistMediaListStatusSchema.options.map((option) => (
                                <option key={option} value={option}>
                                    {option.toLowerCase()}
                                </option>
                            ))}
                        </select>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="status" aria-live="polite" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="media_progress" className="form-text">
                            Episode Progress:
                        </label>
                        <input
                            {...register('progress', { valueAsNumber: true })}
                            type="number"
                            id="media_progress"
                            min="0"
                            max={maxProgress}
                            data-invalid={!!errors.progress}
                            className="form-field text-center"
                        />

                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="progress" aria-live="polite" />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-2">
                    <button type="button" className="button button-danger" onClick={deleteEntry} disabled={isToggling || isSubmitting}>
                        {isToggling || isSubmitting ? <Icon icon={ICON_SET.LOADING} className="size-5" /> : 'Delete'}
                    </button>
                    <button type="submit" className="button button-primary" disabled={isToggling || isSubmitting}>
                        {isToggling || isSubmitting ? <Icon icon={ICON_SET.LOADING} className="size-5" /> : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default A_EditMedia;
