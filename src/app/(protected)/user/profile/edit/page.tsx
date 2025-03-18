'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { redirect } from 'next/navigation';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { editProfileAction } from '@/actions/user.actions';
import ICON_SET from '@/constants/icons';
import { APP_ROUTES } from '@/constants/routes.constants';
import { profileSchema } from '@/lib/schema/user.validation';

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfileEdit = () => {
    const { data: session, update } = useSession();
    const [previewImage, setPreviewImage] = useState<string | null>(session?.user?.image || null);

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (session?.user?.provider !== 'credentials') redirect(APP_ROUTES.USER.PROFILE);
        if (session?.user) {
            setValue('name', session.user.name || '');
            setValue('email', session.user.email || '');
        }
    }, [session, setValue]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setValue('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        const response = await editProfileAction(data);

        if (response.success) {
            toast.success(response.message || 'Profile updated successfully');
            update({
                ...session,
                user: {
                    ...session?.user,
                    name: response.payload?.name || session?.user?.name,
                    image: response.payload?.image || session?.user?.image,
                },
            });
        } else {
            response?.extraData?.forEach((err) => {
                setError(err.path[0] as 'name' | 'email' | 'image', {
                    message: err.message,
                });
            });

            setError('root.serverError', { message: response.message || 'Something went wrong. Please try again Later.' });
        }
    };

    return (
        <div className="shadow-floating-sm mx-auto max-w-lg rounded-lg p-6">
            {/* Header */}
            <header className="text-highlight mb-4 flex items-center gap-2 text-2xl">
                <Icon icon={ICON_SET.EDIT_PROFILE} className="size-7" />
                <h2 className="text-2xl font-semibold">Edit Profile</h2>
            </header>

            <hr className="mb-4" />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isSubmitting}>
                    <legend className="sr-only">Profile Edit Form</legend>

                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name" className="form-text">
                            Name
                        </label>
                        <div className="form-field-wrapper">
                            <Icon icon={ICON_SET.PERSON} className="form-icon" />
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className="form-field"
                                placeholder="Enter your name"
                                data-invalid={!!errors.name}
                                aria-invalid={!!errors.name}
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="name" aria-live="polite" />
                    </div>

                    {/* Email Field (Read-only) */}
                    <div className="form-group">
                        <label htmlFor="email" className="form-text">
                            Email Address
                        </label>
                        <div className="form-field-wrapper">
                            <Icon icon={ICON_SET.EMAIL} className="form-icon" />
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="Enter your email"
                                className="form-field"
                                data-invalid={!!errors.email}
                                aria-invalid={!!errors.email}
                            />
                        </div>
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="email" aria-live="polite" />
                    </div>

                    {/* Profile Image Upload */}
                    <div className="form-group">
                        <label className="form-text">Profile Image</label>
                        {previewImage && (
                            <div className="flex items-center gap-3">
                                <Image
                                    src={previewImage}
                                    alt="Profile Preview"
                                    width={80}
                                    height={80}
                                    className="rounded-full border border-gray-300"
                                />
                                <button
                                    type="button"
                                    className="text-sm text-red-500 hover:underline"
                                    onClick={() => setPreviewImage(session?.user?.image || null)}>
                                    Remove
                                </button>
                            </div>
                        )}
                        <input type="file" onChange={handleImageChange} className="form-field" />
                        <ErrorMessage as="p" className="text-xs text-red-500" errors={errors} name="image" aria-live="polite" />
                    </div>

                    <ErrorMessage
                        as="p"
                        errors={errors}
                        name="root.serverError"
                        render={({ message }) => (
                            <p aria-live="polite" className="mt-3 flex items-center rounded-lg bg-red-400/10 px-3 py-1 text-xs text-red-500">
                                <Icon icon={ICON_SET.ERROR} className="size-7 shrink-0" />
                                {message}
                            </p>
                        )}
                    />

                    <hr className="my-5" />

                    {/* Submit Button */}
                    <button type="submit" className="button button-highlight w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default UserProfileEdit;
