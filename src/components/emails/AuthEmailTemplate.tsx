import * as React from 'react';

import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Tailwind, Text } from '@react-email/components';

import { APP_ROUTES } from '@/constants/routes.constants';

// Load public URL from environment variables
const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'https://the-mimic-box.com';

interface AuthEmailTemplateProps {
    heading: string;
    preview?: string;
    body: string;
    buttonText: string;
    footerText: string;
    url: string;
}

/**
 * Common reusable email template component.
 */
const AuthEmailTemplate: React.FC<AuthEmailTemplateProps> = ({ heading, preview, body, buttonText, footerText, url }) => {
    return (
        <Html lang="en">
            <Head>
                <title>{heading}</title>
            </Head>
            <Preview>{preview || heading}</Preview>
            <Tailwind>
                <Body
                    style={
                        {
                            '--lower-shadow': '#00000020',
                            '--upper-shadow': '#ffffffd5',
                        } as React.CSSProperties
                    }
                    className="bg-[#dfdfdf] p-6 font-sans">
                    <Container className="mx-auto max-w-lg overflow-hidden rounded-2xl bg-[linear-gradient(150deg_in_oklab,#efefef_15%,#ffffff_85%)] shadow-[2px_4px_4px_var(--lower-shadow),_1px_1px_2px_inset_var(--upper-shadow)]">
                        {/* Header */}
                        <div className="flex w-full items-center justify-center gap-2 border-b p-4 text-center text-[##005a5e] shadow-[3px_3px_5px_var(--lower-shadow),_-3px_-3px_5px_var(--upper-shadow)]">
                            <div className="flex size-12 items-center justify-center rounded-full border p-2 shadow-[2px_4px_4px_var(--lower-shadow),_1px_1px_2px_inset_var(--upper-shadow)]">
                                <img src="/logo-no-bg.png" alt="Mimic Box" />
                            </div>
                            <Heading className="text-lg font-semibold">{heading}</Heading>
                        </div>

                        <div className="p-6">
                            {/* Body */}
                            <Text className="text-center text-[#666666]">{body}</Text>

                            {/* Call-to-Action Button */}
                            <div className="mt-6 text-center">
                                <Button
                                    className="shadow-floating-xs mx-auto w-5/6 cursor-pointer rounded-lg border bg-[#005a5e] px-4 py-2.5 text-center text-sm text-white transition-all duration-300 hover:scale-105"
                                    href={url}>
                                    {buttonText}
                                </Button>
                            </div>

                            {/* Footer */}
                            <Hr className="mt-6 mb-3 border-gray-200" />
                            <Text className="text-center text-sm text-[#1d1d1f]">{footerText}</Text>
                            <Text className="mt-3 text-center text-xs text-[#666666]">
                                &copy; {new Date().getFullYear()} The Mimic Box. All rights reserved.
                            </Text>
                        </div>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default AuthEmailTemplate;

/**
 * Generates an email verification email.
 * @param token - Verification token.
 * @returns Email template component.
 */
export const generateEmailVerificationEmail = (token: string) => (
    <AuthEmailTemplate
        heading="Verify Your Email Address"
        preview="Confirm your email to activate your account"
        body="Thank you for creating an account with The Mimic Box. Please click the link below to confirm your email address. This link is valid for 15 minutes."
        buttonText="Verify Email"
        footerText="If you didn’t request this, you can safely ignore this email."
        url={`${PUBLIC_URL}${APP_ROUTES.AUTH.VERIFY_EMAIL}?token=${token}`}
    />
);

/**
 * Generates a password reset email.
 * @param token - Reset password token.
 * @returns Email template component.
 */
export const generatePasswordResetEmail = (token: string) => (
    <AuthEmailTemplate
        heading="Reset Your Password"
        preview="Reset your password for The Mimic Box"
        body="We received a request to reset the password for your The Mimic Box account. If you did not make this request, please ignore this email. This link is valid for 15 minutes."
        buttonText="Reset Password"
        footerText="If you didn’t request this, you can safely ignore this email."
        url={`${PUBLIC_URL}${APP_ROUTES.AUTH.RESET_PASSWORD}?token=${token}`}
    />
);
