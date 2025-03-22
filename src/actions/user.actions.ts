'use server';

import { v4 as uuidV4 } from 'uuid';
import { z } from 'zod';

import { auth } from '@/auth';
import { generateEmailChangeEmail } from '@/components/emails/AuthEmailTemplate';
import { TOKEN_EXPIRY_MS } from '@/constants/server.constants';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { profileSchema } from '@/lib/schema/user.validations';
import { uploadToCloud } from '@/lib/services/cloud-storage.service';
import { ErrorResponseOutput, SuccessResponseOutput } from '@/lib/types/response.types';
import { createErrorReturn, createSuccessReturn } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

export const editProfileAction = async (
    data: z.infer<typeof profileSchema>
): Promise<SuccessResponseOutput<{ name: string; image: string | null | undefined; email: string }> | ErrorResponseOutput<z.ZodIssue[]>> => {
    const session = await auth();
    if (!session?.user) return createErrorReturn('Unauthorized, please login');

    if (session.user.provider !== 'credentials') return createErrorReturn('Cannot edit profile for social accounts');

    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) return createErrorReturn('Invalid data!', undefined, parsed.error.errors);

    const { name, email, image } = parsed.data;
    const { id: userId, name: currentName, email: currentEmail, image: currentImage } = session.user;

    if (name === currentName && email === currentEmail && image === undefined) {
        return createErrorReturn('No changes detected');
    }

    let imageUrl = currentImage as string;

    if (image) {
        const imageBuffer = await image.arrayBuffer();

        const uploadResponse = await uploadToCloud({
            file: Buffer.from(imageBuffer),
            destinationFolder: 'mimic/profile-images',
            type: 'image',
        });

        if (!uploadResponse.success) {
            return createErrorReturn('Failed to upload image', uploadResponse.error);
        }

        imageUrl = uploadResponse.payload?.url || imageUrl;
    }

    let emailResponse;
    if (currentEmail && email !== currentEmail) {
        emailResponse = await handleEmailChange(currentEmail, email);
        if (!emailResponse.success) return createErrorReturn(emailResponse.message);
    }

    const [updateError] = await safeAwait(
        db.user.update({
            where: { id: userId },
            data: { name, image: imageUrl },
        })
    );

    if (updateError) return createErrorReturn('Failed to update profile', updateError);

    return createSuccessReturn(emailResponse?.message || 'Profile updated successfully', { name, image: imageUrl, email: currentEmail as string });
};

/**
 * Handles email change process, ensuring uniqueness and sending verification.
 */
export const handleEmailChange = async (currentEmail: string, newEmail: string) => {
    const [existingEmailError, existingUser] = await safeAwait(db.user.findUnique({ where: { email: newEmail } }));

    if (existingEmailError) return createErrorReturn('Failed to check email', existingEmailError);
    if (existingUser) return createErrorReturn('Email already in use');

    const token = uuidV4();
    const expires = new Date(Date.now() + TOKEN_EXPIRY_MS);

    const [tokenError] = await safeAwait(
        db.changeEmailToken.upsert({
            where: { currentEmail },
            create: { currentEmail, newEmail, token, expires },
            update: { newEmail, token, expires },
        })
    );

    if (tokenError) return createErrorReturn('Failed to generate token', tokenError);

    const emailResponse = await sendEmail(newEmail, 'Change Your Email', generateEmailChangeEmail(token));

    return emailResponse.success
        ? createSuccessReturn('Email change initiated. Please check your inbox.')
        : createErrorReturn('Failed to send change email verification');
};

export const verifyEmailChangeToken = async (token: string) => {
    try {
        const response = await db.changeEmailToken.findUnique({ where: { token } });

        if (!response || response.expires < new Date()) {
            return createErrorReturn('Invalid or expired verification link.');
        }

        const [updateError, responseS] = await safeAwait(
            db.user.update({
                where: { email: response.currentEmail },
                data: { email: response.newEmail },
            })
        );

        if (updateError || !responseS) throw new Error('Failed to update email');

        await db.changeEmailToken.delete({ where: { token } });

        return createSuccessReturn('Email changed successfully.', { email: response.newEmail });
    } catch {
        return createErrorReturn('Verification failed. Try again later.');
    }
};
