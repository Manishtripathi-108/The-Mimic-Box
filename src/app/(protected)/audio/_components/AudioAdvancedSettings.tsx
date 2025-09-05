'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsPanel, TabsTrigger } from '@/components/ui/Tabs';
import Checkbox from '@/components/ui/form/Checkbox';
import FormField from '@/components/ui/form/FormField';
import Input from '@/components/ui/form/Input';
import Select from '@/components/ui/form/Select';
import { AUDIO_ADVANCED_SETTINGS_DEFAULTS, AUDIO_CHANNEL_OPTIONS } from '@/constants/client.constants';
import {
    AudioBitrateSchema,
    AudioFormatsSchema,
    AudioPlaybackSpeedsSchema,
    AudioSampleRatesSchema,
    audioAdvanceSettingsSchema,
} from '@/lib/schema/audio.validations';
import { T_AudioAdvanceSettings } from '@/lib/types/common.types';

const AudioAdvancedSettings = ({ values, onApply }: { values?: T_AudioAdvanceSettings; onApply: (data: T_AudioAdvanceSettings) => void }) => {
    const parsedValues = audioAdvanceSettingsSchema.safeParse(values);
    const mergedValues = parsedValues.success ? parsedValues.data : AUDIO_ADVANCED_SETTINGS_DEFAULTS;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(audioAdvanceSettingsSchema),
        defaultValues: mergedValues,
    });

    useEffect(() => {
        if (values) reset(mergedValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values, reset]);

    if (!values) return null;

    const onSubmit = (data: T_AudioAdvanceSettings) => onApply(data);

    return (
        <form className="w-full max-w-sm space-y-4 p-6" onSubmit={handleSubmit(onSubmit)}>
            <Tabs defaultValue="Audio">
                <TabsList className="mx-auto w-full">
                    <TabsTrigger value="Audio" className="h-10">
                        Audio
                    </TabsTrigger>
                    <TabsTrigger value="Effects" className="h-10">
                        Effects
                    </TabsTrigger>
                    <TabsTrigger value="Trim" className="h-10">
                        Trim
                    </TabsTrigger>
                    <TabsIndicator />
                </TabsList>

                <TabsContent className="min-h-52 w-full">
                    {/* Audio Tab */}
                    <TabsPanel value="Audio" className="grid w-full grid-cols-2 gap-4 p-0">
                        <FormField label="Format" error={errors.audio?.format?.message}>
                            <Select {...register('audio.format')}>
                                {AudioFormatsSchema.options.map((o) => (
                                    <option key={o} value={o}>
                                        {o}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Bitrate Rate (kbps)" error={errors.audio?.bitrate?.message}>
                            <Select {...register('audio.bitrate')}>
                                {AudioBitrateSchema.options.map((o) => (
                                    <option key={o} value={o}>
                                        {o}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Channels" error={errors.audio?.channels?.message}>
                            <Select {...register('audio.channels')}>
                                {AUDIO_CHANNEL_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Sample Rate" error={errors.audio?.sampleRate?.message}>
                            <Select {...register('audio.sampleRate')} className="capitalize *:capitalize">
                                {AudioSampleRatesSchema.options.map((o) => (
                                    <option key={o} value={o}>
                                        {o.toLowerCase()}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <FormField label="Volume" error={errors.audio?.volume?.message}>
                            <Input type="number" min={0} max={500} {...register('audio.volume')} />
                        </FormField>
                    </TabsPanel>

                    {/* Effects Tab */}
                    <TabsPanel value="Effects" className="grid w-full grid-cols-2 gap-4 p-0">
                        <FormField label="Fade In (seconds)" error={errors.effects?.fadeIn?.message}>
                            <Input placeholder="ie., 5" min={0} max={10} type="number" {...register('effects.fadeIn')} />
                        </FormField>

                        <FormField label="Fade Out (seconds)" error={errors.effects?.fadeOut?.message}>
                            <Input placeholder="ie., 5" min={0} max={10} type="number" {...register('effects.fadeOut')} />
                        </FormField>

                        <FormField label="Pitch Shift" error={errors.effects?.pitchShift?.message}>
                            <Input placeholder="ie., 5" min={-12} max={12} type="number" {...register('effects.pitchShift')} />
                        </FormField>

                        <FormField label="Playback Speed" error={errors.effects?.playbackSpeed?.message} className="font-alegreya text-base">
                            <Select {...register('effects.playbackSpeed')} className="capitalize *:capitalize">
                                {AudioPlaybackSpeedsSchema.options.map((o) => (
                                    <option key={o} value={o}>
                                        {o.toLowerCase()}
                                    </option>
                                ))}
                            </Select>
                        </FormField>

                        <div className="col-span-2 flex justify-end">
                            <Checkbox {...register('effects.normalize')}>Normalize Audio</Checkbox>
                        </div>
                    </TabsPanel>

                    {/* Trim Tab */}
                    <TabsPanel value="Trim" className="grid w-full grid-cols-2 gap-4 p-0">
                        <FormField label="Trim Start" error={errors.trim?.trimStart?.message}>
                            <Input {...register('trim.trimStart')} />
                        </FormField>

                        <FormField label="Trim End" error={errors.trim?.trimEnd?.message}>
                            <Input {...register('trim.trimEnd')} />
                        </FormField>
                    </TabsPanel>
                </TabsContent>
            </Tabs>

            <hr />

            <div className="flex justify-between px-4 pb-2">
                <Button variant="danger" title="Reset" onClick={() => reset(AUDIO_ADVANCED_SETTINGS_DEFAULTS)}>
                    Reset
                </Button>
                <Button title="Apply Changes" variant="highlight" type="submit">
                    Apply Changes
                </Button>
            </div>
        </form>
    );
};

export default AudioAdvancedSettings;
