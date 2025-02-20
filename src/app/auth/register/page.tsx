'use client';

import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z
    .object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
        fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
        confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterData = z.infer<typeof registerSchema>;

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterData) => {
        console.log('Sign In Data:', data);
    };

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
                    <input type="text" {...register('fullName')} className="form-field" placeholder="Enter your full name" />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="form-group mb-3">
                    <label className="form-text">Email address</label>
                    <input type="email" {...register('email')} className="form-field" placeholder="Enter your email" />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="form-group mb-3">
                    <label className="form-text">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            className="form-field"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="text-text-secondary hover:text-text-primary absolute inset-y-0 right-3 flex cursor-pointer items-center"
                            onClick={() => setShowPassword((prev) => !prev)}>
                            <Icon icon={showPassword ? ICON_SET.EYE : ICON_SET.EYE_CLOSE} className="text-xl" />
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="form-group mb-3">
                    <label className="form-text">Confirm Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className="form-field"
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <hr className="my-6" />

                <button type="submit" className="button w-full">
                    Register
                </button>
            </form>

            <p className="text-text-secondary mt-2 text-center text-sm">
                Already have an account?{' '}
                <Link href={APP_ROUTES.AUTH.LOGIN} className="text-highlight hover:underline">
                    Sign in
                </Link>
            </p>
        </>
    );
}
