'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { registerAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Icon from '@/components/ui/Icon';
import { DEFAULT_AUTH_ROUTE } from '@/constants/routes/auth.routes';
import useToggle from '@/hooks/useToggle';
import { registerSchema } from '@/lib/schema/auth.validations';
import FromInput from '@/components/ui/FormInput';

const RegisterForm = () => {
    const [showPassword, { toggle: toggleShowPassword }] = useToggle();

    const {
        handleSubmit,
        control,
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
                    <FromInput
                        autoComplete="name"
                        name="fullName"
                        label="Full Name"
                        type="text"
                        control={control}
                        placeholder="ie. Gillion Ramirez"
                        iconName="person"
                    />

                    {/* Email */}
                    <FromInput
                        autoComplete="email"
                        name="email"
                        label="Email"
                        type="email"
                        control={control}
                        placeholder="ie. example@themimicbox.com"
                        iconName="email"
                    />

                    {/* Password */}
                    <FromInput
                        autoComplete="new-password"
                        name="password"
                        label="Password"
                        type="password"
                        control={control}
                        placeholder="* * * * * * * *"
                        iconName="lock"
                    />

                    {/* Confirm Password */}
                    <FromInput
                        autoComplete="new-password"
                        name="confirmPassword"
                        label="Confirm Password"
                        control={control}
                        placeholder="* * * * * * * *"
                        type={showPassword ? 'text' : 'password'}
                        iconName={showPassword ? 'eye' : 'eyeClose'}
                        onIconClick={() => toggleShowPassword()}
                    />

                    {/* Server Error Messages */}
                    <ErrorMessage message={errors.root?.message} />

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
