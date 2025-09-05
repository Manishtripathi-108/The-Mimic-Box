'use client';

import Link from 'next/link';
import { redirect, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { loginAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import ErrorAlert from '@/components/ui/form/ErrorAlert';
import FormField from '@/components/ui/form/FormField';
import IconInput from '@/components/ui/form/IconInput';
import APP_ROUTES from '@/constants/routes/app.routes';
import { DEFAULT_AUTH_REDIRECT } from '@/constants/routes/auth.routes';
import useToggle from '@/hooks/useToggle';
import { loginSchema } from '@/lib/schema/auth.validations';

const LoginInForm = () => {
    const { update } = useSession();
    const searchParams = useSearchParams();
    const UrlError = searchParams.get('error') === 'OAuthAccountNotLinked';
    const callBackUrl = searchParams.get('callbackUrl');
    const [showPassword, { toggle: toggleShowPassword }] = useToggle();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        if (isSubmitting) return;
        const response = await loginAction(data);

        if (response.success) {
            toast.success(response.message || 'Login successful');
            update();
            redirect(callBackUrl ? decodeURIComponent(callBackUrl) : DEFAULT_AUTH_REDIRECT);
        } else {
            response?.data?.forEach((err) => {
                setError(err.path[0] as 'email' | 'password', {
                    message: err.message,
                });
            });

            setError('root', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    return (
        <>
            <header className="text-highlight flex items-center gap-2 text-2xl">
                <Icon icon="login" className="size-7" />
                <h1 className="text-2xl font-semibold">Welcome Back!</h1>
            </header>

            <hr className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting}>
                    <legend className="sr-only">Login Form</legend>

                    {/* Email Field */}
                    <FormField label="Email" error={errors.email?.message}>
                        <IconInput
                            icon="email"
                            placeholder="ie. example@themimicbox.com"
                            type="email"
                            autoComplete="email"
                            {...register('email')}
                            required
                        />
                    </FormField>

                    {/* Password Field */}
                    <FormField label="Password" error={errors.password?.message}>
                        <IconInput
                            icon={showPassword ? 'eye' : 'eyeClose'}
                            placeholder="* * * * * * * *"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            onIconClick={() => toggleShowPassword()}
                            {...register('password')}
                            required
                        />
                    </FormField>

                    {/* Forgot Password Link */}
                    <Link href={APP_ROUTES.AUTH.FORGOT_PASSWORD} className="text-highlight mt-2 block text-right text-xs hover:underline">
                        Forgot password?
                    </Link>
                    {/* Server Error Messages */}
                    <ErrorAlert
                        text={
                            errors.root?.message
                                ? errors.root.message
                                : UrlError
                                  ? 'Email is already registered with another account. Please login with the correct account.'
                                  : null
                        }
                    />
                    <hr className="my-5" />
                    {/* Submit Button */}
                    <Button type="submit" variant="highlight" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
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
};

export default LoginInForm;
