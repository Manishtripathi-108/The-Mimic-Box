'use client';

import { useState } from 'react';

import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { loginAction } from '@/actions/auth.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES, DEFAULT_AUTH_REDIRECT } from '@/constants/routes.constants';
import { loginSchema } from '@/lib/schema/auth.validations';

export default function LoginInForm() {
    const { update } = useSession();
    const searchParams = useSearchParams();
    const UrlError = searchParams.get('error') === 'OAuthAccountNotLinked';
    const callBackUrl = searchParams.get('callbackUrl');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        const response = await loginAction(data);

        if (response.success) {
            toast.success(response.message || 'Login successful');
            update();
            redirect(callBackUrl ? decodeURIComponent(callBackUrl) : DEFAULT_AUTH_REDIRECT);
        } else {
            response?.extraData?.forEach((err) => {
                setError(err.path[0] as 'email' | 'password', {
                    message: err.message,
                });
            });

            setError('root.serverError', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    return (
        <>
            <header className="text-highlight flex items-center gap-2 text-2xl">
                <Icon icon={ICON_SET.LOGIN} className="size-7" />
                <h1 className="text-2xl font-semibold">Welcome Back!</h1>
            </header>

            <hr className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting}>
                    <legend className="sr-only">Login Form</legend>

                    {/* Email Field */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-text">
                            Email Address
                        </label>
                        <div className="form-field-wrapper">
                            <Icon icon={ICON_SET.EMAIL} className="form-icon" />
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="form-field"
                                placeholder="Enter your email"
                                data-invalid={!!errors.email}
                                aria-invalid={!!errors.email}
                                autoComplete="email"
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="email" aria-live="polite" />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-text">
                            Password
                        </label>
                        <div className="form-field-wrapper">
                            <button
                                type="button"
                                title={showPassword ? 'Hide password' : 'Show password'}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="form-icon"
                                onClick={() => setShowPassword((prev) => !prev)}>
                                <Icon icon={showPassword ? ICON_SET.EYE : ICON_SET.EYE_CLOSE} className="size-full" />
                            </button>

                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className="form-field"
                                data-invalid={!!errors.password}
                                placeholder="Enter your password"
                                aria-invalid={!!errors.password}
                                autoComplete="current-password"
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="password" aria-live="polite" />
                    </div>

                    {/* Forgot Password Link */}
                    <Link href={APP_ROUTES.AUTH_FORGOT_PASSWORD} className="text-highlight mt-2 block text-right text-xs hover:underline">
                        Forgot password?
                    </Link>

                    {/* Server Error Messages */}
                    {(errors.root?.serverError || UrlError) && (
                        <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                            <Icon icon={ICON_SET.ERROR} className="size-7 shrink-0" />
                            {errors.root?.serverError.message ||
                                'Email is already registered with another account. Please login with the correct account.'}
                        </p>
                    )}

                    <hr className="my-5" />
                    {/* Submit Button */}
                    <button type="submit" className="button button-highlight w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Login'}
                    </button>
                </fieldset>
            </form>

            <footer className="text-text-secondary mt-2 text-center text-sm">
                Don’t have an account?{' '}
                <Link href={APP_ROUTES.AUTH_REGISTER} className="text-highlight hover:underline">
                    Create account
                </Link>
            </footer>
        </>
    );
}
