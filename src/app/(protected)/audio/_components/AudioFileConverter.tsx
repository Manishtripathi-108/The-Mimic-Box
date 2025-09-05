'use client';

import { useCallback, useState } from 'react';

import { Path, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { handleConvertAudio } from '@/actions/audio.actions';
import AudioAdvancedSettings from '@/app/(protected)/audio/_components/AudioAdvancedSettings';
import UploadProgressCard from '@/components/layout/UploadProgressCard';
import { Button } from '@/components/ui/Button';
import CardContainer from '@/components/ui/CardContainer';
import FileUpload from '@/components/ui/FileUpload';
import FileUploadItem from '@/components/ui/FileUploadItem';
import FormRangeSlider from '@/components/ui/FormRangeSlider';
import FormSelect from '@/components/ui/FormSelect';
import Modal, { closeModal, openModal } from '@/components/ui/Modals';
import TabSwitcher from '@/components/ui/TabSwitcher';
import Checkbox from '@/components/ui/form/Checkbox';
import ErrorAlert from '@/components/ui/form/ErrorAlert';
import { AUDIO_ADVANCED_SETTINGS_DEFAULTS, AUDIO_BITRATE_OPTIONS } from '@/constants/client.constants';
import AUDIO_ROUTES from '@/constants/external-routes/audio.routes';
import useSafeApiCall from '@/hooks/useSafeApiCall';
import { AudioFormatsSchema } from '@/lib/schema/audio.validations';
import { T_AudioAdvanceSettings } from '@/lib/types/common.types';
import { downloadFile } from '@/lib/utils/file.utils';

const MAX_SIZE_MB = 50;
const MAX_FILES = 10;
const ACCEPTED_TYPES = 'audio/*';

type T_FormValues = {
    useGlobalSettings: boolean;
    global: T_AudioAdvanceSettings;
    fileSettings: T_AudioAdvanceSettings[];
    files: File[];
};

const defaultValues: T_FormValues = {
    useGlobalSettings: true,
    global: AUDIO_ADVANCED_SETTINGS_DEFAULTS,
    fileSettings: [],
    files: [],
};

const AudioFileConverter = () => {
    const [open, setOpen] = useState<{
        values: T_AudioAdvanceSettings | null;
        name: Path<T_FormValues> | null;
    }>({ values: null, name: null });

    const { makeApiCall, isPending, uploadState } = useSafeApiCall();

    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        setError,
        clearErrors,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<T_FormValues>({ defaultValues });

    const { append, remove } = useFieldArray({ control, name: 'fileSettings' });
    const [files, useGlobalSettings, globalSettings, fileSettings] = watch(['files', 'useGlobalSettings', 'global', 'fileSettings']);

    const openAdvancedSettings = (values: T_AudioAdvanceSettings, name: Path<T_FormValues>) => {
        setOpen({ values, name });
        openModal('advancedSettingsModal');
    };

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement> | File[]) => {
            const inputFiles = Array.isArray(event) ? event : event.target.files;
            if (!inputFiles) return;

            clearErrors('root');

            const fileArray = Array.isArray(inputFiles) ? inputFiles : Array.from(inputFiles);
            const validFiles: File[] = [];

            for (const file of fileArray) {
                if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                    setError('root', {
                        message: `File "${file.name}" exceeds ${MAX_SIZE_MB}MB.`,
                    });
                    continue;
                }

                if (!/audio\/.*/.test(file.type)) {
                    setError('root', {
                        message: `File "${file.name}" is not a valid audio type.`,
                    });
                    continue;
                }

                const isDuplicate = files.some((f) => f.name === file.name && f.size === file.size);
                if (!isDuplicate) validFiles.push(file);
            }

            const updatedFiles = [...files, ...validFiles].slice(0, MAX_FILES);
            setValue('files', updatedFiles);

            validFiles.forEach(() => append(defaultValues.global));

            if (!Array.isArray(event)) {
                (event as React.ChangeEvent<HTMLInputElement>).target.value = '';
            }
        },
        [files, setValue, append, setError, clearErrors]
    );

    const handleRemoveFile = (target: File, index: number) => {
        const updated = files.filter((f) => f !== target);
        setValue('files', updated);
        remove(index);
    };

    const submitAudioConvert = async (values: T_FormValues) => {
        if (process.env.NEXT_PUBLIC_EXTERNAL_AUDIO_BASE_URL) {
            makeApiCall({
                url: AUDIO_ROUTES.CONVERTER,
                isExternalApiCall: true,
                method: 'post',
                responseType: 'blob',
                headers: { 'Content-Type': 'multipart/form-data' },
                onStart: () => {
                    const formData = new FormData();
                    values.files.forEach((file) => formData.append('files', file));

                    values.fileSettings.forEach((settings) => {
                        formData.append('formats', values.useGlobalSettings ? values.global.audio.format : settings.audio.format);
                        formData.append('qualities', values.useGlobalSettings ? values.global.audio.bitrate : settings.audio.bitrate);
                        formData.append('advanceSettings', values.useGlobalSettings ? JSON.stringify(values.global) : JSON.stringify(settings));
                    });

                    return formData;
                },
                onSuccess: (response) => {
                    toast.success('Files converted successfully!');
                    const filename = response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'converted_audio';
                    downloadFile(response.data as Blob, filename);
                    reset(defaultValues);
                },
                onError: (_, errorMessage) => {
                    toast.error(errorMessage);
                    setError('root', { message: errorMessage });
                },
            });
        } else {
            const response = await handleConvertAudio(
                values.files,
                values.files.length < 2 || values.useGlobalSettings ? values.global : values.fileSettings
            );
            if (response.success) {
                toast.success(response.message);
                downloadFile(response.payload.downloadUrl, response.payload.fileName);
                reset(defaultValues);
            } else {
                toast.error(response.message);
                setError('root', { message: response.message });
            }
        }
    };

    // Handle file upload progress
    if (isPending && uploadState.progress !== 100) {
        return (
            <div className="min-h-calc-full-height grid place-items-center p-2 sm:p-6">
                <UploadProgressCard uploadState={uploadState} />
            </div>
        );
    }

    // Handle file conversion progress
    if ((isPending && uploadState.progress === 100) || isSubmitting) {
        return (
            <div className="min-h-calc-full-height grid place-items-center p-2 sm:p-6">
                <CardContainer contentClassName="w-full items-center flex-col flex justify-center" className="relative w-full max-w-md">
                    <div className="via-highlight after:animate-tape before:animate-tape relative mt-6 h-20 w-40 bg-linear-174 from-black/0 from-49% via-50% to-black/0 to-51% before:absolute before:-right-5 before:bottom-12.5 before:size-9 before:rotate-0 before:rounded-full before:border-2 before:border-dashed before:border-black before:[box-shadow:0_0_0_4px_#000,_0_0_0_34px_var(--color-theme-highlight),_0_0_5px_34px_#00000000] before:[animation-duration:2s] after:absolute after:bottom-11 after:-left-4 after:size-9 after:rotate-0 after:rounded-full after:border-2 after:border-dashed after:border-black after:[box-shadow:0_0_0_4px_#000,_0_0_0_64px_var(--color-theme-highlight),_0_0_5px_64px_#00000000]"></div>
                    <p className="font-alegreya text-text-primary text-center text-4xl tracking-wide">Processing...</p>
                </CardContainer>
            </div>
        );
    }

    return (
        <div className="min-h-calc-full-height text-text-secondary p-2 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="font-alegreya text-text-primary text-center text-4xl tracking-wide">File Converter</h1>
                <p className="text-highlight mt-2 mb-10 text-center text-lg">Convert your audio files to any format</p>

                <form onSubmit={handleSubmit(submitAudioConvert)}>
                    {files.length === 0 ? (
                        <FileUpload
                            onFilesSelected={handleFileSelect}
                            accept={ACCEPTED_TYPES}
                            description="MP3, M4A, WAV, FLAC, etc."
                            maxSizeMB={MAX_SIZE_MB}
                            maxFiles={MAX_FILES}
                        />
                    ) : (
                        <CardContainer contentClassName="space-y-6">
                            <input id="file-upload" type="file" multiple accept={ACCEPTED_TYPES} className="hidden" onChange={handleFileSelect} />

                            <div role="list" className="space-y-2">
                                {files.map((file, index) => (
                                    <FileUploadItem key={`${file.name}-${index}`} file={file} onRemove={() => handleRemoveFile(file, index)}>
                                        {!useGlobalSettings && files.length > 1 && (
                                            <div className="flex w-full items-center justify-between space-x-4 sm:w-auto">
                                                <FormSelect
                                                    name={`fileSettings.${index}.audio.format`}
                                                    control={control}
                                                    options={AudioFormatsSchema.options}
                                                    disabled={useGlobalSettings}
                                                    classNames={{
                                                        container: 'w-full',
                                                        label: 'font-alegreya text-base tracking-wide',
                                                    }}
                                                />
                                                <Button
                                                    title="Settings"
                                                    className="sm:bg-primary sm:shadow-floating-xs size-5 shrink-0 bg-transparent p-0 shadow-none sm:size-8 sm:p-1.5"
                                                    onClick={() => openAdvancedSettings(fileSettings[index], `fileSettings.${index}`)}
                                                    icon="settings"
                                                />
                                            </div>
                                        )}
                                    </FileUploadItem>
                                ))}
                            </div>

                            {files.length > 1 && (
                                <div className="mr-2 flex items-center justify-end">
                                    <Checkbox {...register('useGlobalSettings')}>Use the same format and quality for all files</Checkbox>
                                </div>
                            )}

                            <ErrorAlert text={errors.root?.message} />

                            <Button className="w-full" icon="plus" onClick={() => document.getElementById('file-upload')?.click()}>
                                Add More Files
                            </Button>

                            <hr />

                            {(files.length < 2 || useGlobalSettings) && (
                                <div className="w-full">
                                    <p className="text-text-primary font-alegreya mb-1 text-base tracking-wide">Format:</p>
                                    <TabSwitcher
                                        tabs={AudioFormatsSchema.options}
                                        currentTab={globalSettings.audio.format}
                                        onTabChange={(tab) => setValue('global.audio.format', tab)}
                                    />
                                    <div className="mt-4">
                                        <FormRangeSlider
                                            label="Quality:"
                                            control={control}
                                            name="global.audio.bitrate"
                                            min={64}
                                            max={320}
                                            step={64}
                                            sliderProps={{ margin: 0.5 }}
                                            classNames={{ field: 'border mt-1 w-full', label: 'font-alegreya text-base  tracking-wide' }}
                                        />
                                        <div className="mt-2 flex justify-between text-sm">
                                            {AUDIO_BITRATE_OPTIONS.map(({ label, value }) => (
                                                <button
                                                    key={value}
                                                    className={`cursor-pointer text-xs transition-transform duration-300 ease-in-out ${
                                                        Number(globalSettings.audio.bitrate) === value
                                                            ? 'text-highlight translate-y-0'
                                                            : 'translate-y-1'
                                                    }`}
                                                    onClick={() =>
                                                        setValue('global.audio.bitrate', String(value) as T_FormValues['global']['audio']['bitrate'])
                                                    }>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        title="Advanced Settings"
                                        className="mt-4 ml-auto"
                                        icon="settings"
                                        onClick={() => openAdvancedSettings(globalSettings, 'global')}>
                                        Advanced Settings
                                    </Button>
                                </div>
                            )}

                            <div className="mt-5 flex w-full justify-between">
                                <Button variant="danger" className="mr-2" onClick={() => reset(defaultValues)} icon="trash">
                                    Clear
                                </Button>
                                <Button variant="highlight" type="submit" icon="musicConvert">
                                    Convert
                                </Button>
                            </div>
                        </CardContainer>
                    )}
                </form>

                {files.length > 0 && (
                    <Modal
                        modalId="advancedSettingsModal"
                        onClose={() => setOpen({ values: null, name: null })}
                        className="w-fit"
                        title="Advanced Settings">
                        {open.values && open.name && (
                            <AudioAdvancedSettings
                                values={open.values!}
                                onApply={(values) => {
                                    setValue(open.name!, values);
                                    closeModal('advancedSettingsModal');
                                }}
                            />
                        )}
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default AudioFileConverter;
