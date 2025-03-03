'use client';

import { registerAction } from '@/actions/auth.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { registerSchema } from '@/lib/schema/auth.validations';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        const response = await registerAction(data);

        if (!response.success) {
            if (response.errors) {
                response.errors.forEach((err) => {
                    setError(err.path[0] as 'fullName' | 'email' | 'password' | 'confirmPassword' | `root.${string}` | 'root', {
                        message: err.message,
                    });
                });
            }
            if (response.message) {
                setError('root.serverError', { message: response.message });
            }
        } else {
            toast.success(response.message || 'Account created successfully.');
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
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="fullName" aria-live="polite" />
                    </div>

                    {/* Email */}
                    <div className="form-group">
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

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password" className="form-text">
                            Password
                        </label>
                        <div className="relative">
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

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-text">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            className="form-field"
                            placeholder="Confirm your password"
                            data-invalid={!!errors.confirmPassword}
                            aria-invalid={!!errors.confirmPassword}
                            autoComplete="new-password"
                        />
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
                    <button type="submit" className="button bg-highlight w-full text-white" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Create an Account'}
                    </button>
                </fieldset>
            </form>

            <footer className="text-text-secondary mt-2 text-center text-sm">
                Already have an account?{' '}
                <Link href={APP_ROUTES.AUTH.LOGIN} className="text-highlight hover:underline">
                    Login
                </Link>
            </footer>
        </>
    );
}
