'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

import ICON_SET from '@/constants/icons';

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    image: z
        .instanceof(File)
        .refine((file) => ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/gif'].includes(file.type), {
            message: 'Invalid image file type',
        })
        .refine((file) => file.size <= fileSizeLimit, {
            message: 'File size should not exceed 5MB',
        })
        .nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfileEdit = () => {
    const { data: session, update } = useSession();
    const [previewImage, setPreviewImage] = useState<string | null>(session?.user?.image || null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    React.useEffect(() => {
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
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.image) {
                formData.append('image', data.image);
            }

            const response = await fetch('/api/profile', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Profile updated successfully!');
                update();
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            console.error('Profile update error:', error);
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
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
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
                                data-invalid={!!errors.email}
                                aria-invalid={!!errors.email}
                                className="form-field"
                            />
                        </div>
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
                        <input type="file" accept="image/*" onChange={handleImageChange} className="form-field" />
                        {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
                    </div>

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
