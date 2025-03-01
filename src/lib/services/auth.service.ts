import { db } from '../db';
import { v4 as uuidV4 } from 'uuid';
import VerifyEmail from '@/components/emails/VerifyEmail';

import { transporter } from '../email';
import { render } from '@react-email/components';

export const sendVerificationEmail = async (email: string, token: string) => {
    try {
        // Validate Email
        if (!email || !email.includes('@')) {
            return { success: false, message: 'Invalid email address provided.' };
        }

        // Check User Existence
        const user = await db.user.findUnique({ where: { email } });

        if (!user) return { success: false, message: 'No account found with this email.' };

        // Ensure Resend API Key Exists
        if (!process.env.RESEND_API_KEY) {
            console.error('🚨 Missing RESEND_API_KEY in environment variables');
            return { success: false };
        }

        const emailHtml = await render(VerifyEmail({ token }));

        // Send Verification Email
        const response = await transporter.sendMail({
            from: 'The Mimic Box <noreply@themimicbox.com>',
            to: email,
            subject: 'Verify Your Email Address',
            html: emailHtml,
        });

        if (!response) {
            throw new Error('Failed to send email');
        }

        return { success: true };
    } catch (error) {
        console.error('🚨 Error sending verification email:', error);

        return { success: false };
    }
};

export const generateVerificationToken = async (email: string) => {
    const token = uuidV4();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    const existingToken = await db.verificationToken.findUnique({ where: { email } });

    let response;
    if (existingToken) {
        response = await db.verificationToken.update({
            where: { email },
            data: { token, expires },
        });
    } else {
        response = await db.verificationToken.create({
            data: { email, token, expires },
        });
    }

    return response;
};
