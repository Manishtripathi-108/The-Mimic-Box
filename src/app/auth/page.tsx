'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@iconify/react';
import ICON_SET from '@/constants/icons';

const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = (data: SignInFormData) => {
        console.log('Sign In Data:', data);
    };

    return (
        <div className="bg-primary h-calc-full-height flex items-center justify-center px-4">
            <div className="bg-primary shadow-neumorphic-sm w-full max-w-md rounded-2xl p-8">
                <div className="flex flex-col items-center">
                    <span className="shadow-neumorphic-xs text-accent rounded-xl p-1">
                        <Icon icon="ph:globe" className="text-4xl" />
                    </span>
                    <h2 className="text-text-primary mt-4 text-2xl font-semibold">Welcome back</h2>
                    <p className="text-text-secondary">Please enter your details to sign in</p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button className="shadow-neumorphic-xs text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-center rounded-xl py-2 transition hover:scale-105">
                        <Icon icon={ICON_SET.GOOGLE} className="size-7" />
                        <span className="sr-only">Sign in with Google</span>
                    </button>
                    <button className="shadow-neumorphic-xs text-text-secondary hover:text-text-primary flex w-full cursor-pointer items-center justify-center rounded-xl py-2 transition hover:scale-105">
                        <Icon icon={ICON_SET.GITHUB} className="size-7" />
                        <span className="sr-only">Sign in with GitHub</span>
                    </button>
                </div>

                <div className="my-4 flex items-center gap-2">
                    <div className="bg-secondary h-px flex-1"></div>
                    <span className="text-text-secondary text-sm">or</span>
                    <div className="bg-secondary h-px flex-1"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
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

                    <div className="flex items-center justify-between">
                        <label className="form-checkbox">
                            <input type="checkbox" className="checkbox-field" />
                            <p className="form-text"> Remember for 30 days</p>
                        </label>
                        <a href="#" className="text-highlight text-xs hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <hr className="my-8" />

                    <button type="submit" className="button w-full">
                        Sign in
                    </button>
                </form>

                <p className="text-text-secondary mt-3 text-center text-sm">
                    Don’t have an account?{' '}
                    <a href="#" className="text-highlight hover:underline">
                        Create account
                    </a>
                </p>
            </div>
        </div>
    );
}
