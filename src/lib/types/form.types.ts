import { FieldValues, UseControllerProps } from 'react-hook-form';

import { T_IconType } from '@/lib/types/client.types';

export type T_FormOption = string | { label: string; value: string };

type T_FormClassNames = {
    container?: string;
    label?: string;
    field?: string;
};

type T_FormProps = {
    label?: string;
    autoComplete?: string;
    classNames?: T_FormClassNames;
};

export type T_FormFieldWithOptionsProps<T extends FieldValues> = {
    options: T_FormOption[];
} & T_FormProps &
    UseControllerProps<T>;

export type T_FormInputProps<T extends FieldValues = FieldValues> = {
    placeholder?: string;
    type?: string;
    min?: number;
    max?: number;
    label?: string;
    autoComplete?: string;
    iconName?: T_IconType;
    iconPosition?: 'left' | 'right';
    onIconClick?: () => void;
    classNames?: T_FormClassNames & {
        icon?: string;
    };
} & UseControllerProps<T>;

export type T_FormRangeSliderProps<T extends FieldValues> = {
    step?: number;
} & T_FormInputProps<T>;

export type T_FormSelectProps<T extends FieldValues> = {
    placeholder?: string;
} & T_FormFieldWithOptionsProps<T>;

export type T_FormTextareaProps<T extends FieldValues> = {
    rows?: number;
    placeholder?: string;
} & T_FormProps &
    UseControllerProps<T>;
