'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import FromInput from '@/components/ui/FormInput';
import FormSelect from '@/components/ui/FormSelect';
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsPanel, TabsTrigger } from '@/components/ui/Tabs';
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

    const { control, register, handleSubmit, reset } = useForm({
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
                    <TabsPanel value="Audio" className="grid w-full grid-cols-2 gap-4 p-0">
                        <FormSelect label="Format" name="audio.format" options={AudioFormatsSchema.options} control={control} />
                        <FormSelect label="Bitrate Rate (kbps)" name="audio.bitrate" options={AudioBitrateSchema.options} control={control} />
                        <FormSelect label="Channels" name="audio.channels" options={AUDIO_CHANNEL_OPTIONS} control={control} />
                        <FormSelect
                            label="Sample Rate"
                            classNames={{ field: 'capitalize' }}
                            name="audio.sampleRate"
                            options={AudioSampleRatesSchema.options}
                            control={control}
                        />
                        <FromInput label="Volume" type="number" max={500} min={0} name="audio.volume" control={control} />{' '}
                    </TabsPanel>
                    <TabsPanel value="Effects" className="grid w-full grid-cols-2 gap-4 p-0">
                        <FromInput type="number" max={10} min={0} label="Fade In (seconds)" name="effects.fadeIn" control={control} />
                        <FromInput type="number" max={10} min={0} label="Fade Out (seconds)" name="effects.fadeOut" control={control} />
                        <FromInput type="number" max={12} min={-12} label="Pitch Shift" name="effects.pitchShift" control={control} />
                        <FormSelect
                            label="Playback Speed"
                            name="effects.playbackSpeed"
                            options={AudioPlaybackSpeedsSchema.options}
                            control={control}
                        />
                        <div className="col-span-2 flex justify-end">
                            <label htmlFor="normalize" className="form-checkbox">
                                <input id="normalize" className="checkbox-field" type="checkbox" {...register('effects.normalize')} />
                                <span className="form-text text-base select-none">Normalize Audio</span>
                            </label>
                        </div>
                    </TabsPanel>
                    <TabsPanel value="Trim" className="grid w-full grid-cols-2 gap-4 p-0">
                        <FromInput label="Trim Start" name="trim.trimStart" control={control} />
                        <FromInput label="Trim End" name="trim.trimEnd" control={control} />
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
