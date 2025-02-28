import * as React from 'react';
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Tailwind, Text } from '@react-email/components';

const VerifyEmail = ({ token }: { token: string }) => {
    const publicUrl = process.env.NEXT_PUBLIC_URL || 'https://the-mimic-box.com';
    const verificationUrl = new URL(`/auth/verify-email?token=${token}`, publicUrl).toString();

    return (
        <Html lang="en">
            <Head>
                <title>Verify Your Email</title>
            </Head>
            <Preview>Confirm your email to activate your account</Preview>
            <Tailwind>
                <Body className="bg-gray-100 font-sans">
                    <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
                        {/* Header Section */}
                        <div className="pt-6 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white">
                                <span className="text-xl font-bold">M</span>
                            </div>
                            <Heading className="mt-4 text-2xl font-bold text-gray-800">Welcome to The Mimic Box!</Heading>
                        </div>

                        {/* Body Content */}
                        <Text className="mt-2 text-center text-gray-600">
                            Thank you for signing up! Please verify your email address to activate your account.
                        </Text>

                        {/* Verification Button */}
                        <div className="mt-6 text-center">
                            <Button
                                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-md transition hover:bg-blue-700"
                                href={verificationUrl}>
                                Verify Email
                            </Button>
                        </div>

                        {/* Footer */}
                        <Hr className="my-6 border-gray-200" />
                        <Text className="text-center text-sm text-gray-500">If you didn’t request this, you can safely ignore this email.</Text>
                        <Text className="mt-4 text-center text-xs text-gray-400">
                            &copy; {new Date().getFullYear()} The Mimic Box. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default VerifyEmail;
