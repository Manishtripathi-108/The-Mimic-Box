import { z } from 'zod';

import { audioAdvanceSettingsSchema } from '@/lib/schema/audio.validations';

/* ---------------------------------- Audio --------------------------------- */
export type T_AudioAdvanceSettings = z.infer<typeof audioAdvanceSettingsSchema>;
