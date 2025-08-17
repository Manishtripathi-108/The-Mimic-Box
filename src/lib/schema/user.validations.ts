import { z } from 'zod';

import { imageFileValidation } from '@/lib/schema/common.validations';

const emailField = z.email().transform((email) => email.toLowerCase());

export const profileSchema = z.object({
    name: z.string().min(4, 'Name must be at least 4 characters'),
    email: emailField,
    image: imageFileValidation.optional(),
});
