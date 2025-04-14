'use client';

import { useCallback, useState } from 'react';

import { Path, useFieldArray, useForm } from 'react-hook-form';

import AudioAdvancedSettings from '@/app/(protected)/audio/_components/AudioAdvancedSettings';
import CardContainer from '@/components/ui/CardContainer';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FileUpload from '@/components/ui/FileUpload';
import FileUploadItem from '@/components/ui/FileUploadItem';
import Icon from '@/components/ui/Icon';
import Modal, { closeModal, openModal } from '@/components/ui/Modals';
import RangeSlider from '@/components/ui/RangeSlider';
import Select from '@/components/ui/Select';
import TabNavigation from '@/components/ui/TabNavigation';
import { AUDIO_ADVANCED_SETTINGS_DEFAULTS, AUDIO_BITRATE_OPTIONS } from '@/constants/client.constants';
import { AudioFormatsSchema } from '@/lib/schema/client.validations';
import { T_AudioAdvanceSettings } from '@/lib/types/client.types';

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

export default function FileConverter() {
    const [open, setOpen] = useState<{
        values: T_AudioAdvanceSettings | null;
        name: Path<T_FormValues> | null;
    }>({ values: null, name: null });

    const {
        control,
        handleSubmit,
        register,
        setValue,
        watch,
        setError,
        clearErrors,
        reset,
        formState: { errors },
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

    const handleConvert = (data: T_FormValues) => {
        console.log('Convert files', data);
    };

    return (
        <div className="min-h-calc-full-height text-text-secondary p-2 sm:p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="font-alegreya text-text-primary text-center text-4xl tracking-wide">File Converter</h1>
                <p className="text-highlight mt-2 mb-10 text-center text-lg">Convert your audio files to any format</p>

                <form onSubmit={handleSubmit(handleConvert)}>
                    {files.length === 0 ? (
                        <FileUpload onFilesSelected={handleFileSelect} maxSizeMB={MAX_SIZE_MB} maxFiles={MAX_FILES} />
                    ) : (
                        <CardContainer contentClassName="space-y-6">
                            <input id="file-upload" type="file" multiple accept={ACCEPTED_TYPES} className="hidden" onChange={handleFileSelect} />

                            <div role="list" className="space-y-2">
                                {files.map((file, index) => (
                                    <FileUploadItem key={`${file.name}-${index}`} file={file} onRemove={() => handleRemoveFile(file, index)}>
                                        {!useGlobalSettings && files.length > 1 && (
                                            <div className="flex w-full items-center justify-between space-x-4 sm:w-auto">
                                                <Select
                                                    name={`fileSettings.${index}.audio.format`}
                                                    control={control}
                                                    options={AudioFormatsSchema.options}
                                                    disabled={useGlobalSettings}
                                                    classNames={{
                                                        container: 'w-full',
                                                        label: 'font-alegreya text-base tracking-wide',
                                                    }}
                                                />
                                                <button
                                                    title="Settings"
                                                    type="button"
                                                    className="sm:button size-5 shrink-0 cursor-pointer rounded-full sm:size-9 sm:p-2"
                                                    onClick={() => openAdvancedSettings(fileSettings[index], `fileSettings.${index}`)}>
                                                    <Icon icon="settings" className="size-full" />
                                                </button>
                                            </div>
                                        )}
                                    </FileUploadItem>
                                ))}
                            </div>

                            {files.length > 1 && (
                                <div className="mr-2 flex items-center justify-end">
                                    <label htmlFor="useGlobalSettings" className="form-checkbox">
                                        <input id="useGlobalSettings" className="checkbox-field" type="checkbox" {...register('useGlobalSettings')} />
                                        <span className="form-text select-none">Use the same format and quality for all files</span>
                                    </label>
                                </div>
                            )}

                            <ErrorMessage message={errors.root?.message} />

                            <button type="button" className="button h-10 w-full" onClick={() => document.getElementById('file-upload')?.click()}>
                                <Icon icon="plus" className="h-full" /> Add More Files
                            </button>

                            <hr />

                            {(files.length < 2 || useGlobalSettings) && (
                                <div className="w-full">
                                    <p className="text-text-primary font-alegreya mb-1 text-base tracking-wide">Format:</p>
                                    <TabNavigation
                                        tabs={AudioFormatsSchema.options}
                                        currentTab={globalSettings.audio.format}
                                        onTabChange={(tab) => setValue('global.audio.format', tab)}
                                    />
                                    <div className="mt-4">
                                        <RangeSlider
                                            label="Quality:"
                                            control={control}
                                            name="global.audio.bitrate"
                                            min={64}
                                            max={320}
                                            step={64}
                                            classNames={{ field: 'border mt-1', label: 'font-alegreya text-base  tracking-wide' }}
                                        />
                                        <div className="mt-2 flex justify-between text-sm">
                                            {AUDIO_BITRATE_OPTIONS.map(({ label, value }) => (
                                                <button
                                                    key={value}
                                                    type="button"
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

                                    <button
                                        type="button"
                                        title="Advanced Settings"
                                        className="button mt-4 ml-auto h-10"
                                        onClick={() => openAdvancedSettings(globalSettings, 'global')}>
                                        <Icon icon="settings" className="h-full" /> Advanced Settings
                                    </button>
                                </div>
                            )}

                            <div className="mt-5 flex w-full justify-between">
                                <button className="button button-danger mr-2 h-10" type="button" onClick={() => reset(defaultValues)}>
                                    <Icon icon="trash" className="h-full" /> Clear
                                </button>
                                <button className="button button-highlight h-10" type="submit">
                                    <Icon icon="musicConvert" className="h-full" /> Convert
                                </button>
                            </div>
                        </CardContainer>
                    )}
                </form>

                {files.length > 1 && (
                    <Modal
                        modalId="advancedSettingsModal"
                        onClose={() => setOpen({ values: null, name: null })}
                        className="w-fit"
                        title="Advanced Settings">
                        {open.values && open.name && (
                            <AudioAdvancedSettings
                                values={open.values}
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
}
