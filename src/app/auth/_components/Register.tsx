'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { registerAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import ErrorAlert from '@/components/ui/form/ErrorAlert';
import FormField from '@/components/ui/form/FormField';
import IconInput from '@/components/ui/form/IconInput';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import useToggle from '@/hooks/useToggle';
import { registerSchema } from '@/lib/schema/auth.validations';

const RegisterForm = () => {
    const [showPassword, { toggle: toggleShowPassword }] = useToggle();

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    async function onSubmit(data: z.infer<typeof registerSchema>) {
        if (isSubmitting) return;
        const response = await registerAction(data);

        if (response.success) {
            toast.success(response.message || 'Account created successfully.', { duration: 3000 });
            redirect(DEFAULT_AUTH_ROUTE);
        } else {
            response?.data?.forEach((err) => {
                setError(err.path[0] as 'fullName' | 'email' | 'password' | 'confirmPassword', {
                    message: err.message,
                });
            });

            setError('root', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    }

    return (
        <>
            <header className="text-highlight flex items-center gap-2 text-2xl">
                <Icon icon="personAdd" className="size-7" />
                <h1 className="text-2xl font-semibold">Create an Account</h1>
            </header>

            <hr className="my-4" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting}>
                    <legend className="sr-only">Registration Form</legend>

                    {/* Full Name */}
                    <FormField label="Name" error={errors.fullName?.message}>
                        <IconInput
                            icon="person"
                            type="text"
                            autoComplete="name"
                            {...register('fullName')}
                            placeholder="ie. Gillion Ramirez"
                            required
                        />
                    </FormField>

                    {/* Email */}
                    <FormField label="Email" error={errors.email?.message}>
                        <IconInput
                            icon="email"
                            type="email"
                            autoComplete="email"
                            {...register('email')}
                            placeholder="ie. example@themimicbox.com"
                            required
                        />
                    </FormField>

                    {/* Password */}
                    <FormField label="Password" error={errors.password?.message}>
                        <IconInput
                            autoComplete="new-password"
                            placeholder="* * * * * * * *"
                            icon="lock"
                            type="password"
                            {...register('password')}
                            required
                        />
                    </FormField>

                    {/* Confirm Password */}
                    <FormField label="Confirm Password" error={errors.confirmPassword?.message}>
                        <IconInput
                            autoComplete="new-password"
                            placeholder="* * * * * * * *"
                            icon={showPassword ? 'eye' : 'eyeClose'}
                            type={showPassword ? 'text' : 'password'}
                            onIconClick={() => toggleShowPassword()}
                            {...register('confirmPassword')}
                            required
                        />
                    </FormField>

                    {/* Server Error Messages */}
                    <ErrorAlert text={errors.root?.message} />

                    <hr className="my-5" />

                    {/* Submit Button */}
                    <Button type="submit" variant="highlight" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Account...' : 'Create an Account'}
                    </Button>
                </fieldset>
            </form>

            <footer className="text-text-secondary mt-2 text-center text-sm">
                Already have an account?{' '}
                <Link href={DEFAULT_AUTH_ROUTE} className="text-highlight hover:underline">
                    Login
                </Link>
            </footer>
        </>
    );
};

export default RegisterForm;
