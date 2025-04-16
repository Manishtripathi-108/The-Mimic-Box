'use client';

import React from 'react';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { forgotPasswordAction } from '@/actions/auth.actions';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes.constants';
import { forgotPasswordSchema } from '@/lib/schema/auth.validations';

const ForgotPasswordForm = () => {
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });

    async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
        const response = await forgotPasswordAction(data);

        if (response.success) {
            toast.success(response.message || 'Check your inbox to reset your password.', { duration: 3000 });
        } else {
            response?.extraData?.forEach((err) => {
                setError(err.path[0] as 'email', {
                    message: err.message,
                });
            });

            setError('root.serverError', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    return (
        <main className="bg-primary h-calc-full-height flex items-center justify-center">
            <article className="shadow-floating-sm from-secondary to-tertiary w-full max-w-md overflow-hidden rounded-2xl bg-linear-150 from-15% to-85%">
                <header className="shadow-raised-xs text-highlight flex items-center justify-center gap-2 border-b p-4">
                    <div className="shadow-floating-xs flex size-12 items-center justify-center rounded-full border">
                        <Icon icon="appLogo" className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Forgot Password</h2>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <Input
                        control={control}
                        name="email"
                        label="Enter your email"
                        type="email"
                        disabled={isSubmitting}
                        placeholder="ie. example@themimicbox.com"
                        iconName="email"
                        rules={{ required: 'Email is required' }}
                    />

                    {errors.root?.serverError && (
                        <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                            <Icon icon="error" className="size-7" />
                            {errors.root.serverError.message}
                        </p>
                    )}

                    <button type="submit" disabled={isSubmitting} className="button button-highlight mt-4 w-full">
                        {isSubmitting ? 'Please wait...' : 'Reset Password'}
                    </button>
                </form>

                <Link className="text-highlight mb-6 block text-center text-sm hover:underline" href={DEFAULT_AUTH_ROUTE}>
                    Return to Login
                </Link>
            </article>
        </main>
    );
};

export default ForgotPasswordForm;
