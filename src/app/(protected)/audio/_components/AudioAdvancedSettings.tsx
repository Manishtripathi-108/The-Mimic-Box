'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import TabNavigation from '@/components/ui/TabNavigation';
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
    const [currentTab, setCurrentTab] = useState<'Audio' | 'Effects' | 'Trim'>('Audio');

    const parsedValues = audioAdvanceSettingsSchema.safeParse(values);
    const mergedValues = parsedValues.success ? parsedValues.data : AUDIO_ADVANCED_SETTINGS_DEFAULTS;

    const { control, register, handleSubmit, reset } = useForm<T_AudioAdvanceSettings>({
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
            <TabNavigation tabs={['Audio', 'Effects', 'Trim']} className="mx-auto w-full" currentTab={currentTab} onTabChange={setCurrentTab} />

            <div className="min-h-52 w-full">
                <AnimatePresence mode="wait">
                    {currentTab === 'Audio' && (
                        <motion.div
                            key="audioTab"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="grid w-full grid-cols-2 gap-4">
                            <Select label="Format" name="audio.format" options={AudioFormatsSchema.options} control={control} />
                            <Select label="Bitrate Rate (kbps)" name="audio.bitrate" options={AudioBitrateSchema.options} control={control} />
                            <Select label="Channels" name="audio.channels" options={AUDIO_CHANNEL_OPTIONS} control={control} />
                            <Select
                                label="Sample Rate"
                                classNames={{ field: 'capitalize' }}
                                name="audio.sampleRate"
                                options={AudioSampleRatesSchema.options}
                                control={control}
                            />
                            <Input label="Volume" type="number" max={500} min={0} name="audio.volume" control={control} />
                        </motion.div>
                    )}

                    {currentTab === 'Effects' && (
                        <motion.div
                            key="effectsTab"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="grid w-full grid-cols-2 gap-4">
                            <Input type="number" max={10} min={0} label="Fade In (seconds)" name="effects.fadeIn" control={control} />
                            <Input type="number" max={10} min={0} label="Fade Out (seconds)" name="effects.fadeOut" control={control} />
                            <Input type="number" max={12} min={-12} label="Pitch Shift" name="effects.pitchShift" control={control} />
                            <Select
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
                        </motion.div>
                    )}

                    {currentTab === 'Trim' && (
                        <motion.div
                            key="trimTab"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="grid w-full grid-cols-2 gap-4">
                            <Input label="Trim Start" name="trim.trimStart" control={control} />
                            <Input label="Trim End" name="trim.trimEnd" control={control} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

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
