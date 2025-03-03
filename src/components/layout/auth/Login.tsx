'use client';

import { loginAction } from '@/actions/auth.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES, DEFAULT_AUTH_REDIRECT } from '@/constants/routes.constants';
import { loginSchema } from '@/lib/schema/auth.validations';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function LoginInForm() {
    const searchParams = useSearchParams();
    const UrlError = searchParams.get('error') === 'OAuthAccountNotLinked';
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        const response = await loginAction(data);

        if (response) {
            if (!response.success) {
                if (response.errors) {
                    response.errors.forEach((err) => {
                        setError(err.path[0] as 'email' | 'password' | 'remember' | `root.${string}` | 'root', {
                            message: err.message,
                        });
                    });
                }
                if (response.message) {
                    setError('root.serverError', { message: response.message });
                }
            }

            if (response.success) {
                toast.success('Sign in successful');
                redirect(response.redirect || DEFAULT_AUTH_REDIRECT);
            }
        } else {
            setError('root.serverError', { message: 'Something went wrong. Please try again Later.' });
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
                    <div>
                        <label htmlFor="email" className="form-text">
                            Email Address
                        </label>
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
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="email" aria-live="polite" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="form-text">
                            Password
                        </label>
                        <div className="relative">
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
                            <button
                                type="button"
                                className="text-text-secondary hover:text-text-primary absolute inset-y-0 right-3 flex cursor-pointer items-center"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                <Icon icon={showPassword ? ICON_SET.EYE : ICON_SET.EYE_CLOSE} className="text-xl" />
                            </button>
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="password" aria-live="polite" />
                    </div>

                    {/* Forgot Password Link */}
                    <Link href={APP_ROUTES.AUTH.FORGOT_PASSWORD} className="text-highlight mt-2 block text-right text-xs hover:underline">
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
                <Link href={APP_ROUTES.AUTH.REGISTER} className="text-highlight hover:underline">
                    Create account
                </Link>
            </footer>
        </>
    );
}
