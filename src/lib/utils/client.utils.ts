import { FormOption } from '@/lib/types/client.types';

export const getOptionData = (option: FormOption) => (typeof option === 'string' ? { label: option, value: option } : option);
