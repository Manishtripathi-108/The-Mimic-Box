'use client';

import React from 'react';

import Link from 'next/link';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { forgotPasswordAction } from '@/actions/auth.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { forgotPasswordSchema } from '@/lib/schema/auth.validations';

const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema) });

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
                        <Icon icon={ICON_SET.AppLogo} className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Forgot Password</h2>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="form-group">
                        <label htmlFor="email" className="form-text">
                            Enter your email
                        </label>
                        <div className="form-field-wrapper">
                            <Icon icon={ICON_SET.EMAIL} className="form-icon" />
                            <input
                                {...register('email')}
                                data-invalid={!!errors.email}
                                aria-invalid={!!errors.email}
                                disabled={isSubmitting}
                                type="email"
                                id="email"
                                className="form-field"
                                placeholder="Email"
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="email" aria-live="polite" />
                    </div>

                    {errors.root?.serverError && (
                        <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                            <Icon icon={ICON_SET.ERROR} className="size-7" />
                            {errors.root.serverError.message}
                        </p>
                    )}

                    <button type="submit" disabled={isSubmitting} className="button button-highlight mt-4 w-full">
                        {isSubmitting ? 'Please wait...' : 'Reset Password'}
                    </button>
                </form>

                <Link className="text-highlight mb-6 block text-center text-sm hover:underline" href={APP_ROUTES.AUTH_LOGIN}>
                    Return to Login
                </Link>
            </article>
        </main>
    );
};

export default ForgotPasswordForm;
