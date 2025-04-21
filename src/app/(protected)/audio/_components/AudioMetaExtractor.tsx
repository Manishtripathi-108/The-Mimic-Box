'use client';

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { handleExtractAudioMetaTags } from '@/actions/audio.actions';
import UploadProgressCard from '@/components/layout/UploadProgressCard';
import CardContainer from '@/components/ui/CardContainer';
import FileUpload from '@/components/ui/FileUpload';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { EXTERNAL_ROUTES } from '@/constants/routes.constants';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import { AudioFileValidationSchema } from '@/lib/schema/audio.validations';

const AudioMetadataEditor = lazy(() => import('@/app/(protected)/audio/_components/AudioMetadataEditor'));

const validationSchema = z.object({
    audio: AudioFileValidationSchema,
});

type FormValue = z.infer<typeof validationSchema>;

const INITIAL_EXTRACT_STATE: {
    metaTags: Record<string, string | number>;
    coverImage: string;
    audioFileName: string | null;
} = {
    metaTags: {},
    coverImage: IMAGE_FALLBACKS.AUDIO_COVER,
    audioFileName: null,
};

export default function AudioMetaExtractor() {
    const [extractedData, setExtractedData] = useState(INITIAL_EXTRACT_STATE);
    const formRef = useRef<HTMLFormElement>(null);

    const { makeApiCall, cancelRequest, isPending, uploadState } = useSafeApiCall<
        FormData,
        {
            metadata: Record<string, string | number>;
            coverImage: string;
            audioFileName: string;
        }
    >();

    const {
        handleSubmit,
        setValue,
        watch,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValue>({
        resolver: zodResolver(validationSchema),
    });

    const audioFile = watch('audio');

    // Auto-submit when a valid audio file is selected
    useEffect(() => {
        if (audioFile) {
            const timer = setTimeout(() => {
                formRef.current?.requestSubmit();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [audioFile]);

    const resetState = useCallback(() => {
        cancelRequest();
        setExtractedData(INITIAL_EXTRACT_STATE);
        reset();
    }, [reset, cancelRequest]);

    const handleTagsExtraction = async (values: FormValue) => {
        if (process.env.NODE_ENV === 'production') {
            makeApiCall({
                url: EXTERNAL_ROUTES.AUDIO.EXTRACT_METADATA,
                method: 'POST',
                isExternalApiCall: true,
                onStart: () => {
                    const formData = new FormData();
                    formData.append('audio', values.audio);
                    return formData;
                },
                onSuccess: ({ data }) => {
                    toast.success('Metadata extracted successfully!');
                    setExtractedData({
                        metaTags: data.metadata,
                        coverImage: data.coverImage,
                        audioFileName: data.audioFileName,
                    });
                    reset();
                },
                onError: (_, errorMessage) => {
                    toast.error(errorMessage);
                    setError('root', { message: errorMessage });
                },
            });
        } else {
            const response = await handleExtractAudioMetaTags(values.audio);
            if (response.success) {
                toast.success('Metadata extracted successfully!');
                setExtractedData({
                    metaTags: response.payload.metaTags || {},
                    coverImage: response.payload.coverImage,
                    audioFileName: response.payload.fileName,
                });
                reset();
            } else {
                toast.error(response.message);
                setError('root', { message: response.message });
            }
        }
    };

    const shouldShowProgress = isPending && uploadState.progress !== 100;
    const isProcessing = (isPending && uploadState.progress === 100) || isSubmitting;

    if (shouldShowProgress) {
        return (
            <div className="min-h-calc-full-height grid place-items-center p-2 sm:p-6">
                <UploadProgressCard onCancel={resetState} uploadState={uploadState} />
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="min-h-calc-full-height grid place-items-center p-2 sm:p-6">
                <CardContainer contentClassName="w-full flex flex-col items-center justify-center" className="relative w-full max-w-md">
                    <div className="via-highlight after:animate-tape before:animate-tape relative mt-6 h-20 w-40 bg-linear-174 from-black/0 from-49% via-50% to-black/0 to-51% before:absolute before:-right-5 before:bottom-12.5 before:size-9 before:rotate-0 before:rounded-full before:border-2 before:border-dashed before:border-black before:[box-shadow:0_0_0_4px_#000,_0_0_0_34px_var(--color-theme-highlight),_0_0_5px_34px_#00000000] before:[animation-duration:2s] after:absolute after:bottom-11 after:-left-4 after:size-9 after:rotate-0 after:rounded-full after:border-2 after:border-dashed after:border-black after:[box-shadow:0_0_0_4px_#000,_0_0_0_64px_var(--color-theme-highlight),_0_0_5px_64px_#00000000]" />
                    <p className="font-alegreya text-text-primary text-center text-4xl tracking-wide">Processing...</p>
                </CardContainer>
            </div>
        );
    }

    return (
        <div className="min-h-calc-full-height text-text-secondary p-2 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="font-alegreya text-text-primary text-center text-4xl tracking-wide">Audio MetaTags Editor</h1>
                <p className="text-highlight mt-2 mb-10 text-center text-lg">Edit the meta tags for your audio file</p>

                {!extractedData.audioFileName ? (
                    <form ref={formRef} onSubmit={handleSubmit(handleTagsExtraction)}>
                        <FileUpload
                            accept="audio/*"
                            maxFiles={1}
                            maxSizeMB={50}
                            description="MP3, M4A, WAV, FLAC, etc."
                            onFilesSelected={(files) => setValue('audio', files[0])}
                            errorMessage={errors.audio?.message || errors.root?.message}
                        />
                    </form>
                ) : (
                    <Suspense fallback={<div>Loading editor...</div>}>
                        <AudioMetadataEditor
                            metaTags={extractedData.metaTags}
                            coverImage={extractedData.coverImage}
                            audioFileName={extractedData.audioFileName}
                            onSuccess={resetState}
                            onCancel={resetState}
                        />
                    </Suspense>
                )}
            </div>
        </div>
    );
}
