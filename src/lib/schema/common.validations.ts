import { z } from 'zod';

import { MAX_FILE_SIZE } from '@/constants/common.constants';
import { formatFileSize } from '@/lib/utils/file.utils';

export const emailValidation = z.email('Email is invalid').toLowerCase();

export const passwordValidation = z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[a-z]/, 'Include at least one lowercase letter.')
    .regex(/[A-Z]/, 'Include at least one uppercase letter.')
    .regex(/[@$#!*]/, 'Include at least one special character (@, $, #, !, *).');

export const imageFileValidation = z
    .file()
    .max(MAX_FILE_SIZE.image, `File size should not exceed ${formatFileSize(MAX_FILE_SIZE.image)}`)
    .mime(['image/png', 'image/jpeg', 'image/jpg', 'image/gif'], 'Invalid image file type');
