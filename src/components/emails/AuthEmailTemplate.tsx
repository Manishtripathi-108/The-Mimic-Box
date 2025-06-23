import * as React from 'react';

import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Tailwind, Text } from '@react-email/components';

import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import APP_ROUTES from '@/constants/routes/app.routes';

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'https://themimicbox.com';

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
                <Body className="flex h-[500px] items-center justify-center bg-[#dfdfdf] p-6 font-sans text-[#1d1d1f]">
                    <Container className="mx-auto h-fit max-w-lg rounded-2xl bg-white">
                        {/* Header */}
                        <div className="flex w-full items-center p-4 text-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={IMAGE_FALLBACKS.APP_LOGO}
                                alt="The Mimic Box logo"
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full border border-gray-300 object-contain"
                            />
                            <Heading className="ml-4 text-xl font-semibold text-[#005a5e]">{heading}</Heading>
                        </div>
                        <Hr className="border-gray-200" />

                        {/* Content */}
                        <div className="p-6">
                            <Text className="my-1 text-center leading-relaxed text-[#444]">{body}</Text>

                            <div className="mt-6 text-center">
                                <Button
                                    className="mx-auto w-5/6 cursor-pointer rounded-lg bg-[#005a5e] px-4 py-2.5 text-center text-sm text-white hover:opacity-90"
                                    href={url}>
                                    {buttonText}
                                </Button>
                            </div>

                            <Hr className="mt-6 mb-3 border-gray-200" />

                            <Text className="my-1 text-center text-sm text-[#1d1d1f]">{footerText}</Text>
                            <Text className="my-1 text-center text-xs text-[#666666]">
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
        heading="Welcome! Let’s Verify Your Email"
        preview="Almost there—confirm your email to complete setup"
        body="Hey there! We're excited to have you at The Mimic Box. To complete your registration, just tap the button below and verify your email. This helps us keep your account safe and secure."
        buttonText="Confirm My Email"
        footerText="Didn’t sign up? No worries—feel free to ignore this message."
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
        heading="Let’s Get You Back Into Your Account"
        preview="Reset your password to regain access"
        body="Looks like you’re having trouble signing in to your Mimic Box account. You can reset your password by clicking the button below. If you didn’t try to sign in, you can safely skip this message."
        buttonText="Create New Password"
        footerText="No action is needed if you didn’t request this."
        url={`${PUBLIC_URL}${APP_ROUTES.AUTH.RESET_PASSWORD}?token=${token}`}
    />
);

/**
 * Generates an email change verification email.
 * @param token - Email change verification token.
 * @returns Email template component.
 */
export const generateEmailChangeEmail = (token: string) => (
    <AuthEmailTemplate
        heading="Confirm Your New Email Address"
        preview="One quick step to finish updating your email"
        body="We received a request to update your email address linked with The Mimic Box. To confirm the change, just tap the button below. If this wasn’t you, no need to worry—your current email will stay active."
        buttonText="Confirm Email Change"
        footerText="Ignore this message if you didn’t start this update."
        url={`${PUBLIC_URL}${APP_ROUTES.AUTH.CHANGE_EMAIL}?token=${token}`}
    />
);
