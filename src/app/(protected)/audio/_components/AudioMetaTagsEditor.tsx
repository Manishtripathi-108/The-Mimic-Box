'use client';

import React, { useMemo, useState } from 'react';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { handleEditMetaTags } from '@/actions/audio.actions';
import SearchLyrics from '@/app/(protected)/audio/_components/SearchLyrics';
import { Button } from '@/components/ui/Button';
import CardContainer from '@/components/ui/CardContainer';
import FormInput from '@/components/ui/FormInput';
import FromTextarea from '@/components/ui/FromTextarea';
import Modal, { closeModal, openModal } from '@/components/ui/Modals';
import ErrorMessage from '@/components/ui/form/ErrorMessage';
import { META_TAGS } from '@/constants/client.constants';
import AUDIO_ROUTES from '@/constants/external-routes/audio.routes';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import { AudioMetaTagsSchema } from '@/lib/schema/audio.validations';
import { T_AudioMetaTags } from '@/lib/types/common.types';
import { downloadFile } from '@/lib/utils/file.utils';

type Props = {
    metaTags: Record<string, string | number>;
    coverImage: string;
    audioFileName: string;
    onCancel: () => void;
    onSuccess: () => void;
};

const AudioMetaTagsEditor: React.FC<Props> = ({ metaTags, coverImage, audioFileName, onCancel, onSuccess }) => {
    const { makeApiCall, cancelRequest } = useSafeApiCall<FormData, Blob>();
    const [cover, setCover] = useState(coverImage);
    const [showAllTags, setShowAllTags] = useState(false);

    const parsedMetadata = useMemo(() => {
        const result = AudioMetaTagsSchema.safeParse(metaTags);
        if (result.success) return result.data;

        return Object.keys(META_TAGS).reduce(
            (acc, key) => {
                acc[key] = metaTags[key] || '';
                return acc;
            },
            {} as Record<string, string | number>
        );
    }, [metaTags]);

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(AudioMetaTagsSchema),
        defaultValues: { ...parsedMetadata, cover: undefined },
    });

    const submitEditTags = async (values: T_AudioMetaTags) => {
        const { cover, ...metaTags } = values;

        if (process.env.NEXT_PUBLIC_EXTERNAL_AUDIO_BASE_URL) {
            await makeApiCall({
                url: AUDIO_ROUTES.EDIT_META_TAGS,
                method: 'post',
                responseType: 'blob',
                isExternalApiCall: true,
                onStart: () => {
                    const formData = new FormData();
                    formData.append('audioFileName', audioFileName);
                    if (cover) formData.append('cover', cover);
                    formData.append('metadata', JSON.stringify(metaTags));
                    return formData;
                },
                onSuccess: (response) => {
                    toast.success('Metadata updated successfully!');
                    const filename = response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'edited_audio';
                    downloadFile(response.data, filename);
                    onSuccess();
                    reset();
                },
                onError: (_, errorMessage) => {
                    toast.error(errorMessage);
                    setError('root', { message: errorMessage });
                },
            });
        } else {
            const response = await handleEditMetaTags(audioFileName, metaTags, cover);

            if (response.success) {
                toast.success('Metadata updated successfully!');
                downloadFile(response.payload.fileName, response.payload.fileName);
                onSuccess();
                reset();
            } else {
                toast.error(response.message);
                setError('root', { message: response.message });
            }
        }
    };

    const tagsToRender = useMemo(() => (showAllTags ? Object.entries(META_TAGS) : Object.entries(META_TAGS).slice(0, 10)), [showAllTags]);

    return (
        <CardContainer className={isSubmitting ? 'pointer-events-none animate-pulse' : ''}>
            <h2 className="text-text-primary font-aladin mb-4 text-center text-3xl tracking-wider">Edit Tags</h2>

            <form
                onSubmit={handleSubmit(submitEditTags)}
                className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:items-start">
                {/* Cover Image */}
                <div className="relative size-3/4 max-w-72 shrink-0">
                    <label htmlFor="cover" className="shadow-pressed-xs block aspect-square cursor-pointer overflow-hidden rounded-xl border p-2">
                        <Image src={cover} width={640} height={640} alt="Cover" className="size-full rounded-lg object-cover" />
                    </label>

                    <Controller
                        control={control}
                        name="cover"
                        render={({ field }) => (
                            <input
                                id="cover"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                disabled={isSubmitting}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                        setCover(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        )}
                    />

                    <ErrorMessage message={errors.cover?.message?.toString()} className="absolute bottom-2 left-2" />
                </div>

                {/* Metadata Inputs */}
                <div className="grid w-full grid-cols-1 place-items-center gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {tagsToRender.map(([key, config]) =>
                        config.type === 'textarea' ? (
                            <div key={key} className={`relative ${config.className} flex w-full items-center justify-center`}>
                                <FromTextarea
                                    label={key}
                                    control={control}
                                    name={key as keyof T_AudioMetaTags}
                                    placeholder={config.placeholder}
                                    classNames={{ container: config.className }}
                                    disabled={isSubmitting}
                                />

                                <Button
                                    title="search lyrics"
                                    onClick={() => openModal('modal-search-lyrics')}
                                    className="absolute right-2 bottom-4"
                                    icon="search"
                                    iconClassName="-rotate-90"
                                />
                            </div>
                        ) : (
                            <FormInput
                                key={key}
                                label={key.replace('_', ' ')}
                                control={control}
                                name={key as keyof T_AudioMetaTags}
                                type={config.type}
                                placeholder={config.placeholder}
                                classNames={{ container: config.className }}
                                disabled={isSubmitting}
                            />
                        )
                    )}

                    {/* Toggle Tags Button */}
                    <Button
                        className="order-last col-span-full"
                        icon={showAllTags ? 'minus' : 'plus'}
                        onClick={() => setShowAllTags((prev) => !prev)}>
                        {showAllTags ? 'Show Less Tags' : 'Show All Tags'}
                    </Button>

                    <ErrorMessage message={errors.root?.message} className="order-last col-span-full" />

                    {/* Form Buttons */}
                    <div className="order-last col-span-full flex w-full justify-end gap-3 pt-6">
                        <Button type="submit" variant="highlight" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                reset();
                                setCover(coverImage);
                            }}
                            disabled={isSubmitting}>
                            Reset
                        </Button>
                        <Button
                            onClick={() => {
                                cancelRequest();
                                onCancel();
                            }}
                            disabled={isSubmitting}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </form>

            <Modal modalId="modal-search-lyrics">
                <SearchLyrics
                    defaultParams={{ trackName: parsedMetadata.title as string }}
                    onSelect={(lyrics) => {
                        closeModal('modal-search-lyrics');
                        setValue('lyrics', lyrics);
                    }}
                />
            </Modal>
        </CardContainer>
    );
};

export default AudioMetaTagsEditor;
