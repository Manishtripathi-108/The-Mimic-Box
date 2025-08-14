'use server';

import sharp from 'sharp';
import { v4 as uuidV4 } from 'uuid';
import z from 'zod';

import { auth } from '@/auth';
import { generateEmailChangeEmail } from '@/components/emails/AuthEmailTemplate';
import { TOKEN_EXPIRY_MS } from '@/constants/server.constants';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { profileSchema } from '@/lib/schema/user.validations';
import { uploadToCloud } from '@/lib/services/cloud-storage.service';
import { T_ErrorResponseOutput, T_SuccessResponseOutput } from '@/lib/types/response.types';
import { createError, createForbidden, createSuccess, createUnauthorized, createValidationError } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const editProfileAction = async (
    data: z.infer<typeof profileSchema>
): Promise<T_SuccessResponseOutput<{ name: string; image: string | null | undefined; email: string }> | T_ErrorResponseOutput<z.ZodIssue[]>> => {
    const session = await auth();
    if (!session?.user) return createUnauthorized('Unauthorized, please login');

    if (session.user.provider !== 'credentials') return createForbidden('Cannot edit profile for social accounts');

    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) return createValidationError('Invalid data!', parsed.error.issues);

    const { name, email, image } = parsed.data;
    const { id: userId, name: currentName, email: currentEmail, image: currentImage } = session.user;

    if (name === currentName && email === currentEmail && image === undefined) {
        return createError('No changes detected');
    }

    let imageUrl = currentImage as string;

    if (image) {
        const imageBuffer = await image.arrayBuffer();
        const [error, buffer] = await safeAwait(sharp(imageBuffer).resize(640, 640).toFormat('jpg').toBuffer());
        if (error) return createError('Failed to process image', { error });

        const uploadResponse = await uploadToCloud({
            file: Buffer.from(buffer),
            destinationFolder: 'user/profile-images',
            type: 'image',
        });

        if (!uploadResponse.success) {
            return createError('Failed to upload image', uploadResponse);
        }

        imageUrl = uploadResponse.payload?.url || imageUrl;
    }

    let emailResponse;
    if (currentEmail && email !== currentEmail) {
        emailResponse = await handleEmailChange(currentEmail, email);
        if (!emailResponse.success) return createError(emailResponse.message);
    }

    const [updateError] = await safeAwait(
        db.user.update({
            where: { id: userId },
            data: { name, image: imageUrl },
        })
    );

    if (updateError) return createError('Failed to update profile', { error: updateError });

    return createSuccess(emailResponse?.message || 'Profile updated successfully', { name, image: imageUrl, email: currentEmail as string });
};

/**
 * Handles email change process, ensuring uniqueness and sending verification.
 */
export const handleEmailChange = async (currentEmail: string, newEmail: string) => {
    const [existingEmailError, existingUser] = await safeAwait(db.user.findUnique({ where: { email: newEmail } }));

    if (existingEmailError) return createError('Failed to check email', { error: existingEmailError });
    if (existingUser) return createValidationError('Email already in use');

    const token = uuidV4();
    const expires = new Date(Date.now() + TOKEN_EXPIRY_MS);

    const [tokenError] = await safeAwait(
        db.changeEmailToken.upsert({
            where: { currentEmail },
            create: { currentEmail, newEmail, token, expires },
            update: { newEmail, token, expires },
        })
    );

    if (tokenError) return createError('Failed to generate token', { error: tokenError });

    const emailResponse = await sendEmail(newEmail, 'Change Your Email', generateEmailChangeEmail(token));

    return emailResponse.success ? createSuccess('Email change initiated. Please check your inbox.') : emailResponse;
};

export const verifyEmailChangeToken = async (token: string) => {
    try {
        const response = await db.changeEmailToken.findUnique({ where: { token } });

        if (!response || response.expires < new Date()) {
            return createValidationError('Invalid or expired verification link.');
        }

        const [updateError, responseS] = await safeAwait(
            db.user.update({
                where: { email: response.currentEmail },
                data: { email: response.newEmail },
            })
        );

        if (updateError || !responseS) throw new Error('Failed to update email');

        await db.changeEmailToken.delete({ where: { token } });

        return createSuccess('Email changed successfully.', { email: response.newEmail });
    } catch {
        return createError('Verification failed. Try again later.');
    }
};
