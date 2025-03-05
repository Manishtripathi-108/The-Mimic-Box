import { APP_ROUTES } from '@/constants/routes.constants';
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

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
                        <div className="flex items-center justify-center gap-2 border-b p-4 text-[##005a5e] shadow-[3px_3px_5px_var(--lower-shadow),_-3px_-3px_5px_var(--upper-shadow)]">
                            <div className="flex size-12 items-center justify-center rounded-full border p-2 shadow-[2px_4px_4px_var(--lower-shadow),_1px_1px_2px_inset_var(--upper-shadow)]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="size-full" version="1.1">
                                    <g>
                                        <path
                                            d="M 149.439 43.781 C 122.642 52.558 99.214 66.342 84.368 82.062 C 73.746 93.311 68.509 100.824 61.001 115.593 C 50.022 137.185 45.417 155.597 45.417 177.899 L 45.417 191.096 L 250.206 191.096 L 454.994 191.096 L 454.17 172.01 C 451.609 112.84 415.495 66.41 355.64 45.335 C 337.199 38.842 330.551 39.987 296.729 55.474 L 281.62 62.394 L 270.01 58.371 C 254.655 53.051 244.883 53.058 230.068 58.395 L 218.53 62.554 L 200.297 54.118 C 182.199 45.746 166.401 39.823 162.645 40.004 C 161.569 40.055 155.627 41.755 149.439 43.781"
                                            stroke="none"
                                            fill="#000000"
                                            fillRule="evenodd"
                                        />{' '}
                                        <path
                                            d="M 45 210.555 L 455 210.555 L 454.142 237.125 C 453.537 255.825 452.318 268.129 450.026 278.665 C 442.67 312.466 427.787 346.847 409.493 372.299 C 398.722 387.285 379.799 406.253 370.01 411.877 L 363.391 415.679 L 363.391 435.378 C 363.391 448.976 352.362 460 338.757 460 L 313.184 460 C 299.579 460 288.55 448.976 288.55 435.378 L 288.55 426.502 L 288.172 426.108 L 211.834 426.108 L 211.834 434.796 C 211.834 435.494 211.709 436.17 211.478 436.819 C 210.731 449.746 200.006 460 186.885 460 L 161.312 460 C 157.767 460 154.397 459.251 151.351 457.904 C 151.075 457.793 150.816 457.672 150.567 457.54 C 142.346 453.551 136.678 445.126 136.678 435.378 L 136.678 415.724 L 129.538 411.233 C 103.002 394.537 73.523 351.954 59.111 309.491 C 49.827 282.143 46.854 265.728 45.868 236.377 L 45 210.555 Z M 164.711 251.086 C 148.064 251.086 134.568 264.117 134.568 280.192 C 134.568 296.267 148.064 309.297 164.711 309.297 C 181.357 309.297 194.853 296.267 194.853 280.192 C 194.853 264.117 181.357 251.086 164.711 251.086 Z M 335.656 251.086 C 319.009 251.086 305.513 264.117 305.513 280.192 C 305.513 296.267 319.009 309.297 335.656 309.297 C 352.303 309.297 365.798 296.267 365.798 280.192 C 365.798 264.117 352.303 251.086 335.656 251.086 Z"
                                            stroke="none"
                                            fill="#000000"
                                            fillRule="evenodd"
                                        />
                                    </g>
                                </svg>
                            </div>
                            <Heading className="text-lg font-semibold">{heading}</Heading>
                        </div>

                        <div className="p-6">
                            {/* Body */}
                            <Text className="text-center text-[#666666]">{body}</Text>

                            {/* Call-to-Action Button */}
                            <div className="mt-6 text-center">
                                <Button
                                    className="shadow-floating-xs mx-auto flex w-5/6 cursor-pointer items-center justify-center gap-2 rounded-lg border bg-[#005a5e] px-4 py-2.5 text-center text-sm text-white transition-all duration-300 hover:scale-105"
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
