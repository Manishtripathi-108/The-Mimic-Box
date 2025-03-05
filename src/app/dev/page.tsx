import AuthEmailTemplate from '@/components/emails/AuthEmailTemplate';
import React from 'react';

const DevOnly = () => {
    return (
        <AuthEmailTemplate
            heading="Verify Your Email Address"
            preview="Confirm your email to activate your account"
            body="Thank you for creating an account with The Mimic Box. Please click the link below to confirm your email address. This link is valid for 15 minutes."
            buttonText="Verify Email"
            footerText="If you didn’t request this, you can safely ignore this email."
            url={'hello'}
        />
    );
};

export default DevOnly;
