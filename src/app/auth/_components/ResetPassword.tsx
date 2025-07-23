'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { resetPasswordAction } from '@/actions/auth.actions';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import { resetPasswordSchema } from '@/lib/schema/auth.validations';

const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [showPassword, setShowPassword] = useState(false);

    // Define the action function
    async function handleReset(data: z.infer<typeof resetPasswordSchema>) {
        const response = await resetPasswordAction(data);

        if (response.success) {
            toast.success(response.message || 'Password reset successfully.', { duration: 3000 });
        } else {
            response?.data?.forEach((err) => {
                setError(err.path[0] as 'token' | 'password' | 'confirmPassword', {
                    message: err.message,
                });
            });

            setError('root', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof resetPasswordSchema>>({
        defaultValues: { token: token || undefined, password: '', confirmPassword: '' },
        resolver: zodResolver(resetPasswordSchema),
    });

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
                        <Input
                            name="password"
                            label="Enter your new password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="* * * * * * * *"
                            iconName="lock"
                            control={control}
                            disabled={isSubmitting}
                        />

                        <Input
                            name="confirmPassword"
                            label="Confirm your new password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="* * * * * * * *"
                            onIconClick={() => setShowPassword((prev) => !prev)}
                            iconName={showPassword ? 'eye' : 'eyeClose'}
                            control={control}
                            disabled={isSubmitting}
                        />

                        <ErrorMessage message={errors.root?.message || errors.token?.message} />

                        <Button type="submit" disabled={isSubmitting} variant="highlight" className="mt-4 w-full">
                            {isSubmitting ? 'Please wait...' : 'Reset Password'}
                        </Button>
                    </form>
                </div>
            </article>
        </main>
    );
};

export default ResetPasswordForm;
