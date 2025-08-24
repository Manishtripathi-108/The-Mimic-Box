'use server';

import sharp from 'sharp';
import { z } from 'zod';

import { auth } from '@/auth';
import { generateEmailChangeEmail } from '@/components/emails/AuthEmailTemplate';
import { DAY_MS, EMAIL_CHANGE_COOLDOWN_MS } from '@/constants/time.constants';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { changeEmailSchema, profileSchema } from '@/lib/schema/user.validations';
import { uploadToCloud } from '@/lib/services/cloud-storage.service';
import { generateChangeEmailToken } from '@/lib/services/token.service';
import { T_ErrorResponseOutput, T_SuccessResponseOutput } from '@/lib/types/response.types';
import { createError, createForbidden, createSuccess, createUnauthorized, createValidationError } from '@/lib/utils/createResponse.utils';
import { safeAwait } from '@/lib/utils/safeAwait.utils';

/**
 * Updates the user's profile (name, email, profile image).
 * Handles image upload to cloud storage and email change verification.
 */
export const editProfileAction = async (
    data: z.infer<typeof profileSchema>
): Promise<T_SuccessResponseOutput<{ name: string; image: string | null | undefined; email: string }> | T_ErrorResponseOutput<z.ZodIssue[]>> => {
    const session = await auth();
    if (!session?.user) return createUnauthorized('Unauthorized, please login');
    if (session.user.provider !== 'credentials') return createForbidden('Cannot edit profile for social accounts');

    // Validate input data
    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) return createValidationError('Invalid data!', parsed.error.issues);

    const { name, email, image } = parsed.data;
    const { id: userId, name: currentName, email: currentEmail, image: currentImage } = session.user;

    // No changes
    if (name === currentName && email === currentEmail && image === undefined) {
        return createError('No changes detected');
    }

    // Handle profile image upload
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

    // Handle email change if requested
    let emailResponse;
    if (currentEmail && email !== currentEmail) {
        emailResponse = await handleEmailChange(currentEmail, email);
        if (!emailResponse.success) return createError(emailResponse.message);
    }

    // Update user profile in DB
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
 * Handles email change request:
 * - Validates request
 * - Enforces cooldown (30 days)
 * - Ensures new email is unique
 * - Generates verification token
 * - Sends confirmation email
 */
export const handleEmailChange = async (currentEmail: string, newEmail: string) => {
    const parsed = changeEmailSchema.safeParse({ currentEmail, newEmail });
    if (!parsed.success) return createValidationError('Invalid email data!', parsed.error.issues);

    // Find user
    const [userError, user] = await safeAwait(
        db.user.findUnique({
            where: { email: currentEmail },
            select: { id: true, emailChangedOn: true },
        })
    );
    if (userError) return createError('Failed to check user', { error: userError });
    if (!user) return createError('User not found');

    // Enforce cooldown
    if (user.emailChangedOn) {
        const nextAllowed = user.emailChangedOn.getTime() + EMAIL_CHANGE_COOLDOWN_MS;
        if (Date.now() < nextAllowed) {
            const remainingDays = Math.ceil((nextAllowed - Date.now()) / DAY_MS);
            return createValidationError(`You cannot change your email yet. Please wait ${remainingDays} more day${remainingDays > 1 ? 's' : ''}.`);
        }
    }

    // Ensure new email is unique
    const [existingError, existingUser] = await safeAwait(db.user.findUnique({ where: { email: newEmail } }));
    if (existingError) return createError('Failed to check email', { error: existingError });
    if (existingUser) return createValidationError('Email already in use');

    const [generateErr, generate] = await safeAwait(generateChangeEmailToken(user.id, newEmail));

    if (!generate || generateErr) return createError('Failed to generate token', { error: generateErr });

    // Send confirmation email
    const emailResponse = await sendEmail(newEmail, 'Change Your Email', generateEmailChangeEmail(generate.token));

    return emailResponse.success ? createSuccess('Email change initiated. Please check your inbox.') : emailResponse;
};

/**
 * Verifies the email change token:
 * - Ensures token is valid & not expired
 * - Updates user email
 * - Deletes used token
 */
export const verifyEmailChangeToken = async (token: string) => {
    try {
        const response = await db.changeEmailToken.findUnique({ where: { token } });
        if (!response || response.expires < new Date()) {
            return createValidationError('Invalid or expired verification link.');
        }

        const [updateError, updatedUser] = await safeAwait(
            db.user.update({
                where: { id: response.userId },
                data: { email: response.newEmail, emailChangedOn: new Date() },
            })
        );
        if (updateError || !updatedUser) throw new Error('Failed to update email');

        await db.changeEmailToken.delete({ where: { token } });

        return createSuccess('Email changed successfully.', {
            email: response.newEmail,
        });
    } catch {
        return createError('Verification failed. Try again later.');
    }
};
