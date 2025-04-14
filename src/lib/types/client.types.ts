import { FieldValues, UseControllerProps } from 'react-hook-form';
import { z } from 'zod';

import IconSet from '@/constants/icons.constants';
import { audioAdvanceSettingsSchema } from '@/lib/schema/client.validations';

export type FileTypesMap = Record<
    string,
    | 'audio'
    | 'video'
    | 'image'
    | 'document'
    | 'archive'
    | 'executable'
    | 'font'
    | 'code'
    | 'markup'
    | 'spreadsheet'
    | 'presentation'
    | 'email'
    | 'database'
    | 'vector'
    | '3d'
    | 'script'
    | 'text'
    | 'disk image'
>;

/* -------------------------------------------------------------------------- */
/*                                 Form Types                                 */
/* -------------------------------------------------------------------------- */
export type FormOption = string | { label: string; value: string };

type BaseClassNames = {
    container?: string;
    label?: string;
    field?: string;
};

type BaseFormProps = {
    label?: string;
    classNames?: BaseClassNames;
};

export type CheckboxProps<T extends FieldValues> = {
    options: FormOption[];
} & BaseFormProps &
    UseControllerProps<T>;

export type RadioGroupProps<T extends FieldValues> = {
    options: FormOption[];
} & BaseFormProps &
    UseControllerProps<T>;

export type InputProps<T extends FieldValues = FieldValues> = {
    placeholder?: string;
    type?: string;
    iconName?: keyof typeof IconSet;
    iconPosition?: 'left' | 'right';
    onIconClick?: () => void;
    classNames?: BaseClassNames & {
        icon?: string;
    };
    label?: string;
} & UseControllerProps<T>;

export type RangeSliderProps<T extends FieldValues> = {
    min?: number;
    max?: number;
    step?: number;
} & InputProps<T>;

export type SelectProps<T extends FieldValues> = {
    options: FormOption[];
    placeholder?: string;
} & BaseFormProps &
    UseControllerProps<T>;

/* -------------------------------------------------------------------------- */
/*                                    Audio                                   */
/* -------------------------------------------------------------------------- */

export type T_AudioAdvanceSettings = z.infer<typeof audioAdvanceSettingsSchema>;
