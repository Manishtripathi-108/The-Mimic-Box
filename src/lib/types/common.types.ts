import { z } from 'zod';

import { AudioMetaTagsSchema, audioAdvanceSettingsSchema } from '@/lib/schema/audio.validations';

/* ---------------------------------- Audio --------------------------------- */
export type T_AudioAdvanceSettings = z.infer<typeof audioAdvanceSettingsSchema>;
export type T_AudioMetaTags = z.infer<typeof AudioMetaTagsSchema>;
export type T_AudioMetaTagsRecords = Record<
    keyof Omit<T_AudioMetaTags, 'cover'>,
    { className: string; placeholder: string; type?: 'number' | 'textarea' }
>;
