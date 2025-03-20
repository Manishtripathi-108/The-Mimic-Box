import { z } from 'zod';

import { MAX_FILE_SIZE } from '@/constants/server.constants';
import { formatFileSize } from '@/lib/utils/file.utils';

export const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    image: z
        .instanceof(File, { message: 'Invalid file' })
        .refine((file) => ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type), {
            message: 'Invalid image file type',
        })
        .refine((file) => file.size <= MAX_FILE_SIZE.image, {
            message: `File size should not exceed ${formatFileSize(MAX_FILE_SIZE.image)}`,
        })
        .refine((file) => file.size >= 0, {
            message: 'File size should not be negative',
        })
        .optional(),
});
