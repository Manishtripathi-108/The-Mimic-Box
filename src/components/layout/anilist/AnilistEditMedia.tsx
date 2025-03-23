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
import { closeModal } from '@/components/Modals';
import { ANILIST_VALID_STATUSES } from '@/constants/client.constants';
import ICON_SET from '@/constants/icons';
import { AnilistMediaEntry, AnilistMediaListStatus } from '@/lib/types/anilist.types';

const modalId = 'modal-anilist-edit-media';

const AnilistEditMedia = ({ token, entry }: { token: string; entry: AnilistMediaEntry }) => {
    const bannerStyle = { backgroundImage: `url(${entry?.media?.bannerImage})` };
    const [isLiked, setIsLiked] = useState(entry?.media?.isFavourite || false);
    const [isToggling, setIsToggling] = useState(false);
    const maxProgress = entry?.media?.episodes || entry?.media?.chapters || 100000;

    /** ✅ Zod validation schema */
    const validationSchema = z.object({
        status: z.string().refine((val) => ANILIST_VALID_STATUSES.includes(val as AnilistMediaListStatus), { message: 'Invalid status' }),
        progress: z.number().min(0, 'Progress must be zero or more').max(maxProgress, `Progress must be less than ${maxProgress}`),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm({
        resolver: zodResolver(validationSchema),
        defaultValues: { status: entry.status, progress: entry.progress || 0 },
    });

    /** ✅ Save media entry updates */
    const onSubmit = async (values: z.infer<typeof validationSchema>) => {
        if (!isDirty) {
            toast.success('No changes to save.');
            closeModal(modalId);
            return;
        }

        const result = await saveMediaEntry(token, entry.media.id, values.status, values.progress);

        if (result.success) {
            toast.success(result.message);
            closeModal(modalId);
        } else if (result.extraData?.retryAfterSeconds) {
            toast.error(`Rate limit exceeded. Try again in ${result.extraData?.retryAfterSeconds} seconds.`);
        } else {
            toast.error(result.message || 'An error occurred while updating.');
        }
    };

    /** ✅ Toggle favourite status */
    const toggleLike = async () => {
        setIsToggling(true);
        const result = await toggleFavourite(token, entry.media.id, entry.media.type);
        setIsToggling(false);

        if (result.success) {
            setIsLiked((prev) => !prev);
            toast.success(result.message);
        } else if (result.extraData?.retryAfterSeconds) {
            toast.error(`Rate limit exceeded. Try again in ${result.extraData?.retryAfterSeconds} seconds.`);
        } else {
            toast.error(result.message || 'An error occurred while toggling favourite status.');
        }
    };

    /** ✅ Delete media entry */
    const deleteEntry = async () => {
        setIsToggling(true);
        const result = await deleteMediaEntry(token, entry.id);
        setIsToggling(false);

        if (result.success) {
            toast.success(result.message);
            closeModal(modalId);
        } else if (result.extraData?.retryAfterSeconds) {
            toast.error(`Rate limit exceeded. Try again in ${result.extraData?.retryAfterSeconds} seconds.`);
        } else {
            toast.error(result.message || 'An error occurred while deleting.');
        }
    };

    return (
        <>
            {/* Banner image */}
            <div
                className="after:bg-secondary relative h-44 rounded-t-lg bg-cover bg-center after:absolute after:size-full after:rounded-t-lg after:opacity-40 md:h-64"
                style={bannerStyle}></div>

            {/* Cover image */}
            <div className="bg-primary shadow-neumorphic-inset-xs relative -mt-24 ml-5 w-full max-w-40 rounded-lg border p-3">
                <Image
                    width={200}
                    height={300}
                    className="size-full rounded-lg object-cover"
                    src={entry.media.coverImage?.large}
                    alt={entry.media.title?.english || entry.media.title?.native}
                    loading="lazy"
                />
            </div>

            {/* Title */}
            <h2 className="text-text-primary font-aladin mt-4 mb-6 ml-7 text-xl font-normal tracking-widest capitalize">
                {entry.media.title?.userPreferred ||
                    entry.media.title?.english ||
                    entry.media.title?.native ||
                    entry.media.title?.romaji ||
                    'Unknown Title'}
            </h2>

            {/* Favourite button */}
            <button
                type="button"
                className={`button absolute top-2/4 right-8 cursor-pointer rounded-full p-2 ${
                    isLiked ? 'shadow-neumorphic-inset-xs text-red-500 dark:text-red-500' : ''
                }`}
                onClick={toggleLike}
                disabled={isToggling}>
                <Icon icon={ICON_SET.HEART} className="size-5 text-inherit" />
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4">
                {/* Status and Progress fields */}
                <div className="grid grid-cols-2 place-items-center gap-4">
                    <div className="form-group">
                        <label htmlFor="media_status" className="form-text">
                            Status:
                        </label>
                        <select {...register('status')} id="media_status" data-invalid={!!errors.status} className="form-field">
                            {ANILIST_VALID_STATUSES.map((option) => (
                                <option key={option} value={option}>
                                    {option}
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

                {/* Action buttons */}
                <div className="mt-8 flex justify-end space-x-2">
                    <button type="button" className="button button-danger" onClick={deleteEntry} disabled={isToggling || isSubmitting}>
                        {isToggling || isSubmitting ? <Icon icon={ICON_SET.LOADING} className="size-5" /> : 'Delete'}
                    </button>
                    <button type="submit" className="button button-primary" disabled={isToggling || isSubmitting}>
                        {isToggling || isSubmitting ? <Icon icon={ICON_SET.LOADING} className="size-5" /> : 'Save'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default AnilistEditMedia;
