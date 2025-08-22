'use client';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { forgotPasswordAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormInput from '@/components/ui/FormInput';
import Icon from '@/components/ui/Icon';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import { forgotPasswordSchema } from '@/lib/schema/auth.validations';

const ForgotPasswordForm = () => {
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: 'hello@world.com' } });

    async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
        const response = await forgotPasswordAction(data);

        if (response.success) {
            toast.success(response.message || 'Check your inbox to reset your password.', { duration: 3000 });
        } else {
            response?.data?.forEach((err) => {
                setError(err.path[0] as 'email', {
                    message: err.message,
                });
            });

            setError('root', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    return (
        <main className="bg-primary h-calc-full-height flex items-center justify-center">
            <article className="shadow-floating-sm bg-gradient-secondary-to-tertiary w-full max-w-md overflow-hidden rounded-2xl">
                <header className="shadow-raised-xs text-highlight flex items-center justify-center gap-2 border-b p-4">
                    <div className="shadow-floating-xs flex size-12 items-center justify-center rounded-full border">
                        <Icon icon="appLogo" className="size-6" />
                    </div>
                    <h2 className="text-lg font-semibold">Forgot Password</h2>
                </header>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <FormInput
                        control={control}
                        name="email"
                        label="Enter your email"
                        autoComplete="email"
                        type="email"
                        disabled={isSubmitting}
                        placeholder="ie. example@themimicbox.com"
                        iconName="email"
                        rules={{ required: 'Email is required' }}
                    />

                    <ErrorMessage message={errors.root?.message} />

                    <Button type="submit" disabled={isSubmitting} variant="highlight" className="mt-4 w-full">
                        {isSubmitting ? 'Please wait...' : 'Reset Password'}
                    </Button>
                </form>

                <Link className="text-highlight mb-6 block text-center text-sm hover:underline" href={DEFAULT_AUTH_ROUTE}>
                    Return to Login
                </Link>
            </article>
        </main>
    );
};

export default ForgotPasswordForm;
