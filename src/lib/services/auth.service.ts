import { db } from '../db';
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

        if (!user) {
            return { success: false, message: 'No account found with this email.' };
        }

        // Ensure Resend API Key Exists
        if (!process.env.RESEND_API_KEY) {
            console.error('🚨 Missing RESEND_API_KEY in environment variables');
            return { success: false, message: 'Email service configuration error. Please contact support.' };
        }

        const emailHtml = await render(VerifyEmail({ token }));

        // Send Verification Email
        const response = await transporter.sendMail({
            from: 'The Mimic Box <noreply@themimicbox.com>',
            to: email,
            subject: 'Verify Your Email Address',
            html: emailHtml,
        });

        console.log('📧 Email sent:', response);

        if (!response) {
            throw new Error('Failed to send email');
        }

        return { success: true, message: 'Verification email sent successfully. Please check your inbox.' };
    } catch (error) {
        console.error('🚨 Error sending verification email:', error);

        return {
            success: false,
            message: 'Something went wrong while sending the email. Please try again later.',
        };
    }
};
