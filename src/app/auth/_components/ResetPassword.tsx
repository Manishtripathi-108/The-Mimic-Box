'use client';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { resetPasswordAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import Icon from '@/components/ui/Icon';
import ErrorAlert from '@/components/ui/form/ErrorAlert';
import useToggle from '@/hooks/useToggle';
import { resetPasswordSchema } from '@/lib/schema/auth.validations';

const ResetPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [showPassword, { toggle: toggleShowPassword }] = useToggle();

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
            <article className="shadow-floating-sm bg-gradient-secondary-to-tertiary w-full max-w-md overflow-hidden rounded-2xl">
                <header className="shadow-raised-xs text-highlight flex items-center justify-center gap-2 border-b p-4">
                    <div className="shadow-floating-xs flex size-12 items-center justify-center rounded-full border">
                        <Icon icon="appLogo" className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Reset Password</h2>
                </header>

                <div className="p-6">
                    <form onSubmit={handleSubmit(handleReset)}>
                        <FormInput
                            name="password"
                            autoComplete="new-password"
                            label="Enter your new password"
                            type="password"
                            placeholder="* * * * * * * *"
                            iconName="lock"
                            control={control}
                            disabled={isSubmitting}
                        />

                        <FormInput
                            name="confirmPassword"
                            autoComplete="new-password"
                            label="Confirm your new password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="* * * * * * * *"
                            onIconClick={() => toggleShowPassword()}
                            iconName={showPassword ? 'eye' : 'eyeClose'}
                            control={control}
                            disabled={isSubmitting}
                        />

                        <ErrorAlert text={errors.root?.message || errors.token?.message} />

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
