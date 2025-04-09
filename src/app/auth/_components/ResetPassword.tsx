'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { resetPasswordAction } from '@/actions/auth.actions';
import Icon from '@/components/ui/Icon';
import { resetPasswordSchema } from '@/lib/schema/auth.validations';

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [showPassword, setShowPassword] = useState(false);

    // Define the action function
    async function handleReset(data: z.infer<typeof resetPasswordSchema>) {
        const response = await resetPasswordAction(data);

        if (response.success) {
            toast.success(response.message || 'Password reset successfully.', { duration: 3000 });
        } else {
            response?.extraData?.forEach((err) => {
                setError(err.path[0] as 'token' | 'password' | 'confirmPassword', {
                    message: err.message,
                });
            });

            setError('root.serverError', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof resetPasswordSchema>>({ defaultValues: { token: token || undefined }, resolver: zodResolver(resetPasswordSchema) });

    return (
        <main className="bg-primary h-calc-full-height flex items-center justify-center">
            <article className="shadow-floating-sm from-secondary to-tertiary w-full max-w-md overflow-hidden rounded-2xl bg-linear-150 from-15% to-85%">
                <header className="shadow-raised-xs text-highlight flex items-center justify-center gap-2 border-b p-4">
                    <div className="shadow-floating-xs flex size-12 items-center justify-center rounded-full border">
                        <Icon icon="appLogo" className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Reset Password</h2>
                </header>

                <div className="p-6">
                    <form onSubmit={handleSubmit(handleReset)}>
                        <div className="form-group">
                            <label htmlFor="password" className="form-text">
                                Enter your new password
                            </label>
                            <div className="form-field-wrapper">
                                <input
                                    {...register('password')}
                                    data-invalid={!!errors.password}
                                    aria-invalid={!!errors.password}
                                    disabled={isSubmitting}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="form-field"
                                    placeholder="password"
                                />
                                <button
                                    type="button"
                                    className="form-icon cursor-pointer"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    <Icon icon={showPassword ? "eye" : "eyeClose"} className="size-full" />
                                </button>
                            </div>
                            <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="password" aria-live="polite" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-text">
                                Enter your
                            </label>
                            <div className="form-field-wrapper">
                                <input
                                    {...register('confirmPassword')}
                                    data-invalid={!!errors.confirmPassword}
                                    aria-invalid={!!errors.confirmPassword}
                                    disabled={isSubmitting}
                                    type="password"
                                    id="confirmPassword"
                                    className="form-field"
                                    placeholder="confirmPassword"
                                />

                                <Icon icon="lock" className="form-icon" />
                            </div>
                            <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="confirmPassword" aria-live="polite" />
                        </div>

                        {(errors.root?.serverError || errors.token) && (
                            <p className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                                <Icon icon="error" className="size-7" />
                                {errors.root?.serverError.message || 'Invalid or Missing Token'}
                            </p>
                        )}

                        <button type="submit" disabled={isSubmitting} className="button button-highlight mt-4 w-full">
                            {isSubmitting ? 'Please wait...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </article>
        </main>
    );
}
