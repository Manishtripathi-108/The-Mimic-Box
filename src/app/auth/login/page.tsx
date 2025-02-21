'use client';

import { loginAction } from '@/actions/auth.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { loginSchema } from '@/lib/schema/auth.validations';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function SignInForm() {
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
        console.log('Response:', response);

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
        }
    }

    return (
        <>
            <h2 className="text-text-primary mt-2 text-2xl font-semibold">
                <Icon icon={ICON_SET.EYE} className="mr-2 inline size-7" />
                Welcome back!
            </h2>
            <p className="text-text-secondary text-sm">Please enter your details to sign in</p>

            <hr className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)}>
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
                    <ErrorMessage errors={errors} as={'p'} className="text-xs text-red-500" name="email" />
                </div>

                <div className="form-group mb-3">
                    <label className="form-text">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            disabled={isSubmitting}
                            className="form-field"
                            data-invalid={!!errors.password}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="text-text-secondary hover:text-text-primary absolute inset-y-0 right-3 flex cursor-pointer items-center"
                            onClick={() => setShowPassword((prev) => !prev)}>
                            <Icon icon={showPassword ? ICON_SET.EYE : ICON_SET.EYE_CLOSE} className="size-6" />
                        </button>
                    </div>
                    <ErrorMessage errors={errors} as={'p'} className="text-xs text-red-500" name="password" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="form-checkbox">
                        <input
                            type="checkbox"
                            {...register('remember')}
                            disabled={isSubmitting}
                            className="checkbox-field"
                            data-invalid={!!errors.remember}
                        />
                        <p className="form-text"> Remember for 30 days</p>
                    </label>
                    <Link href={APP_ROUTES.AUTH.FORGOT_PASSWORD} className="text-highlight text-xs hover:underline">
                        Forgot password?
                    </Link>
                </div>

                {errors.root?.serverError && (
                    <p className="mt-3 rounded-lg bg-red-400/10 px-3 flex items-center py- text-xs text-red-500">
                        <Icon icon={ICON_SET.ERROR} className='size-7' />
                        {errors.root.serverError.message}</p>
                )}

                <hr className="my-6" />
                <button type="submit" disabled={isSubmitting} className="button disabled:bg-secondary w-full">
                    {isSubmitting ? 'Submitting...' : 'Login'}
                </button>
            </form>

            <p className="text-text-secondary mt-2 text-center text-sm">
                Don’t have an account?{' '}
                <Link href={APP_ROUTES.AUTH.REGISTER} className="text-highlight hover:underline">
                    Create account
                </Link>
            </p>
        </>
    );
}
