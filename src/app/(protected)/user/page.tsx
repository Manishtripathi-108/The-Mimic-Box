import React from 'react';

import { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/auth';
import LogoutButton from '@/components/ui/LogoutButton';
import { SideConst } from '@/constants/client.constants';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Profile | The Mimic Box',
    description: 'View and manage your profile on The Mimic Box.',
};

const UserProfile = async () => {
    const session = await auth();
    if (!session?.user) return null;

    const { name, image, email, provider } = session.user;

    return (
        <main className="w-screen` flex h-full">
            {/* sidebar */}
            <div className="bg-secondary hidden h-screen max-w-48 flex-col sm:flex md:max-w-64">
                {SideConst.map((title, i) => (
                    <Link
                        href={title.link}
                        key={i}
                        className="bg-tertiary text-text-primary hover:shadow-floating-xs mx-3 mt-3 cursor-pointer rounded-3xl px-3 py-2 text-center">
                        {title.title}
                    </Link>
                ))}
            </div>

            {/* main content */}

            <div className="mx-auto mt-20 w-full max-w-6xl">
                {/* profile */}
                <div
                    id="profile"
                    className="shadow-floating-xs from-secondary to-tertiary to-85 size-48 overflow-hidden rounded-full border bg-linear-150 from-15%">
                    <Image className="object-cover" src={image!} alt="Avatar" width={300} height={300} />
                    <div className="mt-6 flex items-center justify-between px-4">
                        {provider === 'credentials' && (
                            <Link href={APP_ROUTES.USER_EDIT_PROFILE} className="button bg-accent button-highlight">
                                Edit
                            </Link>
                        )}
                        <LogoutButton className="button button-danger ml-auto" />
                    </div>
                </div>
            </div>
        </main>
    );

    //     return (
    //         <div className="grid place-items-center">
    //             <div className="mt-4 w-full max-w-xl px-3 pt-24 md:pt-20">
    //                 <div className="from-secondary to-tertiary shadow-floating-xs rounded-2xl bg-linear-150 from-15% to-85% p-3 sm:p-6">
    //                     <div className="rounded-xl border p-3 sm:p-6">
    //                         <div className="from-secondary to-tertiary shadow-pressed-xs -mt-20 size-32 rounded-full border bg-linear-150 from-15% to-85% p-2 sm:-mt-24 sm:size-44">
    //                             <Image
    //                                 className="shadow-floating-xs from-secondary to-tertiary size-full rounded-full border bg-linear-150 from-15% to-85% object-cover p-3"
    //                                 src={image!}
    //                                 alt="Avatar"
    //                                 width={200}
    //                                 height={200}
    //                             />
    //                         </div>
    //                         <div className="text-text-primary mt-3 flex items-center justify-between rounded-lg border p-1 tracking-wide">
    //                             <p className="font-alegreya ml-1 font-semibold">Name:</p>
    //                             <p className="font-karla bg-primary rounded-md p-1 text-sm">{name}</p>
    //                         </div>
    //                         <div className="text-text-primary mt-2 flex items-center justify-between rounded-lg border p-1 tracking-wide">
    //                             <p className="font-alegreya ml-1 font-semibold">Email:</p>
    //                             <p className="font-karla bg-primary rounded-md p-1 text-sm">{email}</p>
    //                         </div>

    //                         <div className="mt-6 flex items-center justify-between px-4">
    //                             {provider === 'credentials' && (
    //                                 <Link href={APP_ROUTES.USER_EDIT_PROFILE} className="button button-highlight">
    //                                     Edit
    //                                 </Link>
    //                             )}
    //                             <LogoutButton className="button button-danger ml-auto" />
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
};

export default UserProfile;
