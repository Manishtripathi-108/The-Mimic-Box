import { AxiosProgressEvent } from 'axios';
import { FieldValues, UseControllerProps } from 'react-hook-form';

import IconSet from '@/constants/icons.constants';

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

export type FormFieldWithOptionsProps<T extends FieldValues> = {
    options: FormOption[];
} & BaseFormProps &
    UseControllerProps<T>;

export type InputProps<T extends FieldValues = FieldValues> = {
    placeholder?: string;
    type?: string;
    min?: number;
    max?: number;
    label?: string;
    iconName?: keyof typeof IconSet;
    iconPosition?: 'left' | 'right';
    onIconClick?: () => void;
    classNames?: BaseClassNames & {
        icon?: string;
    };
} & UseControllerProps<T>;

export type RangeSliderProps<T extends FieldValues> = {
    step?: number;
} & InputProps<T>;

export type SelectProps<T extends FieldValues> = {
    placeholder?: string;
} & FormFieldWithOptionsProps<T>;

export type TextareaProps<T extends FieldValues> = {
    rows?: number;
    placeholder?: string;
} & BaseFormProps &
    UseControllerProps<T>;

export type T_UploadState = {
    formattedLoaded: string;
    formattedTotal: string;
    formattedProgress: string;
    formattedRate: string;
    formattedEstimated: string;
} & AxiosProgressEvent;

type T_TrackSourceType = 'album' | 'playlist' | 'track' | 'artist';

export type T_TrackContext = {
    type: T_TrackSourceType;
    id: string;
    name?: string;
};

export type T_AudioPlayerTrack = {
    id: string;
    urls: { quality: '12kbps' | '48kbps' | '96kbps' | '160kbps' | '320kbps'; url: string }[];
    title: string;
    album?: string | null;
    artists?: string;
    covers?: { quality: '50x50' | '150x150' | '500x500'; url: string }[];
};
