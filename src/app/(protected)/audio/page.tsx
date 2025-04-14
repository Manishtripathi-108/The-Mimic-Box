'use client';

import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';

import CardContainer from '@/components/ui/CardContainer';
import FileUpload from '@/components/ui/FileUpload';
import FileUploadItem from '@/components/ui/FileUploadItem';
import Icon from '@/components/ui/Icon';
import RangeSlider from '@/components/ui/RangeSlider';
import Select from '@/components/ui/Select';
import TabNavigation from '@/components/ui/TabNavigation';
import { AUDIO_BITRATE_OPTIONS } from '@/constants/client.constants';
import { AudioFormatsSchema } from '@/lib/schema/client.validations';

// Upload configuration
const MAX_SIZE_MB = 50;
const MAX_FILES = 10;
const ACCEPTED_TYPES = 'audio/*';

export default function FileConverter() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const { control, register, watch, setValue } = useForm({
        defaultValues: {
            useGlobalSettings: false,
            global: {
                format: '',
                quality: 128,
            },
            fileSettings: [],
        },
    });

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputFiles = event.target.files;
            if (!inputFiles) return;

            const newFiles = Array.from(inputFiles);
            const validFiles: File[] = [];
            const acceptRegex = ACCEPTED_TYPES === '*' ? /.*/ : new RegExp(ACCEPTED_TYPES.replace(/\*/g, '.*'));

            setError(null);

            for (const file of newFiles) {
                if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                    setError(`File "${file.name}" exceeds ${MAX_SIZE_MB}MB.`);
                    continue;
                }

                if (!acceptRegex.test(file.type)) {
                    setError(`File "${file.name}" is not a valid audio type.`);
                    continue;
                }

                const isDuplicate = files.some((f) => f.name === file.name && f.size === file.size);
                if (!isDuplicate) validFiles.push(file);
            }

            const allFiles = [...files, ...validFiles].slice(0, MAX_FILES);
            setFiles(allFiles);
            event.target.value = '';
        },
        [files]
    );

    const handleRemoveFile = (target: File) => {
        setFiles((prev) => prev.filter((file) => file !== target));
    };

    return (
        <div className="min-h-calc-full-height text-text-secondary p-2 sm:p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="font-alegreya text-text-primary text-center text-4xl tracking-wide">File Converter</h1>
                <p className="text-highlight mt-2 mb-10 text-center text-lg">Convert your audio files to any format</p>

                {files.length === 0 ? (
                    <FileUpload onFilesSelected={setFiles} maxSizeMB={MAX_SIZE_MB} maxFiles={MAX_FILES} accept={ACCEPTED_TYPES} />
                ) : (
                    <CardContainer contentClassName="space-y-6">
                        <input id="file-upload" type="file" multiple accept={ACCEPTED_TYPES} className="hidden" onChange={handleFileSelect} />

                        <div role="list" className="space-y-2">
                            {files.map((file, index) => (
                                <FileUploadItem key={`${file.name}-${index}`} file={file} error={error} onRemove={() => handleRemoveFile(file)}>
                                    {!watch('useGlobalSettings') && files.length > 1 && (
                                        <div className="flex w-full items-center justify-between space-x-4 sm:w-auto">
                                            <Select
                                                name={`fileSettings.${index}.format`}
                                                control={control}
                                                options={AudioFormatsSchema.options}
                                                disabled={watch('useGlobalSettings')}
                                                classNames={{
                                                    container: 'w-full',
                                                    label: 'font-alegreya text-base tracking-wide',
                                                }}
                                            />

                                            {/* Settings */}
                                            <button
                                                title="Settings"
                                                type="button"
                                                className="sm:button size-5 shrink-0 cursor-pointer rounded-full sm:size-9 sm:p-2"
                                                // onClick={() =>
                                                //     openAdvancedSettings(
                                                //         values.fileSettings[index]?.advanceSettings,
                                                //         `fileSettings.${index}.advanceSettings`
                                                //     )
                                                // }
                                            >
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
                                    <span className="form-text">Use the same format and quality for all files</span>
                                </label>
                            </div>
                        )}

                        {error && (
                            <p role="alert" className="text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        <button
                            type="button"
                            className="button h-10 w-full"
                            onClick={() => {
                                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                                fileInput?.click();
                            }}>
                            <Icon icon="plus" className="h-full" /> Add More Files
                        </button>

                        <hr />

                        {(files.length < 2 || watch('useGlobalSettings')) && (
                            <div className="w-full">
                                <p className="text-text-primary font-alegreya mb-1 text-base tracking-wide">Format:</p>
                                <TabNavigation
                                    tabs={AudioFormatsSchema.options}
                                    currentTab={watch('global.format')}
                                    onTabChange={(tab) => setValue('global.format', tab)}
                                />

                                <div className="mt-4">
                                    <RangeSlider
                                        label="Quality:"
                                        control={control}
                                        classNames={{ field: 'border mt-1', label: 'font-alegreya text-base  tracking-wide' }}
                                        name="global.quality"
                                        min={64}
                                        max={320}
                                        step={64}
                                    />
                                    <div className="mt-2 flex justify-between text-sm">
                                        {AUDIO_BITRATE_OPTIONS.map(({ label, value }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className={`cursor-pointer transition-transform duration-300 ease-in-out focus:outline-none ${
                                                    watch('global.quality') === value ? 'text-highlight translate-y-0' : 'translate-y-1'
                                                }`}
                                                onClick={() => setValue('global.quality', value)}>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    title="Advanced Settings"
                                    className="button mt-4 ml-auto h-10"
                                    // onClick={() => openAdvancedSettings(values.global.advanceSettings, 'global.advanceSettings')}
                                >
                                    <Icon icon="settings" className="h-full" /> Advanced Settings
                                </button>
                            </div>
                        )}

                        <div className="mt-5 flex w-full justify-between">
                            <button className="button button-danger mr-2 h-10" type="button" onClick={() => setFiles([])}>
                                <Icon icon="trash" className="h-full" /> Clear
                            </button>
                            <button type="submit" className="button button-highlight h-10" onClick={() => console.log('Convert files')}>
                                <Icon icon="musicConvert" className="h-full" /> Convert Convert
                            </button>
                        </div>
                    </CardContainer>
                )}
            </div>
        </div>
    );
}
