'use client';

import { useState } from 'react';

import Link from 'next/link';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { registerAction } from '@/actions/auth.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { registerSchema } from '@/lib/schema/auth.validations';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) });

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        const response = await registerAction(data);

        if (response.success) {
            toast.success(response.message || 'Account created successfully.', { duration: 3000 });
        } else {
            response?.extraData?.forEach((err) => {
                setError(err.path[0] as 'fullName' | 'email' | 'password' | 'confirmPassword', {
                    message: err.message,
                });
            });

            setError('root.serverError', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    return (
        <>
            <header className="text-highlight flex items-center gap-2 text-2xl">
                <Icon icon={ICON_SET.PERSON_ADD} className="size-7" />
                <h1 className="text-2xl font-semibold">Create an Account</h1>
            </header>

            <hr className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting}>
                    <legend className="sr-only">Registration Form</legend>

                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="fullName" className="form-text">
                            Full Name
                        </label>
                        <div className="form-field-wrapper">
                            <Icon icon={ICON_SET.PERSON} className="form-icon" />
                            <input
                                id="fullName"
                                type="text"
                                {...register('fullName')}
                                className="form-field"
                                placeholder="Enter your full name"
                                data-invalid={!!errors.fullName}
                                aria-invalid={!!errors.fullName}
                                autoComplete="name"
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="fullName" aria-live="polite" />
                    </div>

                    {/* Email */}
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

                    {/* Password */}
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
                                <Icon icon={showPassword ? ICON_SET.EYE : ICON_SET.EYE_CLOSE} className="text-xl" />
                            </button>{' '}
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                className="form-field"
                                placeholder="Enter your password"
                                data-invalid={!!errors.password}
                                aria-invalid={!!errors.password}
                                autoComplete="new-password"
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="password" aria-live="polite" />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-text">
                            Confirm Password
                        </label>
                        <div className="form-field-wrapper">
                            <Icon icon={ICON_SET.LOCK} className="form-icon" />
                            <input
                                id="confirmPassword"
                                type="password"
                                title={showPassword ? 'Hide password' : 'Show password'}
                                {...register('confirmPassword')}
                                className="form-field"
                                placeholder="Confirm your password"
                                data-invalid={!!errors.confirmPassword}
                                aria-invalid={!!errors.confirmPassword}
                                autoComplete="new-password"
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="confirmPassword" aria-live="polite" />
                    </div>

                    {/* Server Error Messages */}
                    {errors.root?.serverError && (
                        <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                            <Icon icon={ICON_SET.ERROR} className="size-7" />
                            {errors.root.serverError.message}
                        </p>
                    )}

                    <hr className="my-5" />

                    {/* Submit Button */}
                    <button type="submit" className="button button-highlight w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Create an Account'}
                    </button>
                </fieldset>
            </form>

            <footer className="text-text-secondary mt-2 text-center text-sm">
                Already have an account?{' '}
                <Link href={APP_ROUTES.AUTH_LOGIN} className="text-highlight hover:underline">
                    Login
                </Link>
            </footer>
        </>
    );
}
