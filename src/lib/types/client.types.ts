import { FieldValues, UseControllerProps } from 'react-hook-form';

import IconSet from '@/constants/icons';

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

export type SelectProps<T extends FieldValues> = {
    options: FormOption[];
    placeholder?: string;
} & BaseFormProps &
    UseControllerProps<T>;
