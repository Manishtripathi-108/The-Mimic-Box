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

export default function Register() {
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
        console.log('Response:', response);

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
        }

        if (response.success) {
            toast.success('Sign in successful');
        }
    }

    return (
        <>
            <h2 className="text-text-primary mt-2 text-2xl font-semibold">
                <Icon icon={ICON_SET.DESKTOP} className="mr-2 inline size-7" />
                Create an account
            </h2>
            <p className="text-text-secondary text-sm"> Please enter your details to Register</p>

            <hr className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group mb-3">
                    <label className="form-text">Full Name</label>
                    <input
                        type="text"
                        {...register('fullName')}
                        disabled={isSubmitting}
                        className="form-field"
                        placeholder="Enter your full name"
                        data-invalid={!!errors.fullName}
                    />
                    <ErrorMessage as={'p'} className="text-xs text-red-500" errors={errors} name="fullName" />
                </div>

                <div className="form-group mb-3">
                    <label className="form-text">Email address</label>
                    <input
                        type="email"
                        {...register('email')}
                        disabled={isSubmitting}
                        className="form-field"
                        placeholder="Enter your email"
                        data-invalid={!!errors.email}
                    />
                    <ErrorMessage as={'p'} className="text-xs text-red-500" errors={errors} name="email" />
                </div>

                <div className="form-group mb-3">
                    <label className="form-text">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            disabled={isSubmitting}
                            className="form-field"
                            placeholder="Enter your password"
                            data-invalid={!!errors.password}
                        />
                        <button
                            type="button"
                            className="text-text-secondary hover:text-text-primary absolute inset-y-0 right-3 flex cursor-pointer items-center"
                            onClick={() => setShowPassword((prev) => !prev)}>
                            <Icon icon={showPassword ? ICON_SET.EYE : ICON_SET.EYE_CLOSE} className="text-xl" />
                        </button>
                    </div>
                    <ErrorMessage as={'p'} className="text-xs text-red-500" errors={errors} name="password" />
                </div>

                <div className="form-group mb-3">
                    <label className="form-text">Confirm Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        disabled={isSubmitting}
                        className="form-field"
                        placeholder="Confirm your password"
                        data-invalid={!!errors.confirmPassword}
                    />
                    <ErrorMessage as={'p'} className="text-xs text-red-500" errors={errors} name="confirmPassword" />
                </div>

                {errors.root?.serverError && (
                    <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                        <Icon icon={ICON_SET.ERROR} className="size-7" />
                        {errors.root.serverError.message}
                    </p>
                )}

                <hr className="my-6" />

                <button type="submit" disabled={isSubmitting} className="button disabled:bg-secondary w-full">
                    {isSubmitting ? 'Submitting...' : 'Create an account'}
                </button>
            </form>

            <p className="text-text-secondary mt-2 text-center text-sm">
                Already have an account?{' '}
                <Link href={APP_ROUTES.AUTH.LOGIN} className="text-highlight hover:underline">
                    Login
                </Link>
            </p>
        </>
    );
}
