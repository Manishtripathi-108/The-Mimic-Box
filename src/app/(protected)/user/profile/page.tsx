import { Metadata } from 'next';

import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/auth';
import { Button } from '@/components/ui/Button';
import LogoutButton from '@/components/ui/LogoutButton';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import APP_ROUTES from '@/constants/routes/app.routes';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'View and manage your profile on The Mimic Box.',
};

const Page = async () => {
    const session = await auth();
    if (!session?.user) return null;

    const { name, image, email, provider } = session.user;

    return (
        <div className="grid place-items-center">
            <div className="w-full max-w-xl">
                <div className="from-secondary to-tertiary shadow-floating-xs rounded-2xl bg-linear-150 from-15% to-85% p-3 sm:p-6">
                    <div className="rounded-xl border p-3 sm:p-6">
                        <div className="from-secondary to-tertiary shadow-pressed-xs -mt-20 size-32 rounded-full border bg-linear-150 from-15% to-85% p-2 sm:-mt-24 sm:size-44">
                            <Image
                                className="shadow-floating-xs from-secondary to-tertiary rounded-full border bg-linear-150 from-15% to-85% object-cover p-3"
                                src={image || IMAGE_FALLBACKS.PROFILE}
                                alt="Avatar"
                                width={200}
                                height={200}
                            />
                        </div>
                        <div className="text-text-primary mt-3 flex items-center justify-between rounded-lg border p-1 tracking-wide">
                            <p className="font-alegreya ml-1 font-semibold">Name:</p>
                            <p className="font-karla bg-primary rounded-md p-1 text-sm">{name}</p>
                        </div>
                        <div className="text-text-primary mt-2 flex items-center justify-between rounded-lg border p-1 tracking-wide">
                            <p className="font-alegreya ml-1 font-semibold">Email:</p>
                            <p className="font-karla bg-primary rounded-md p-1 text-sm">{email}</p>
                        </div>

                        <div className="mt-6 flex items-center justify-between px-4">
                            {provider === 'credentials' && (
                                <Button variant="highlight" asChild>
                                    <Link href={APP_ROUTES.USER.EDIT_PROFILE}>Edit</Link>
                                </Button>
                            )}
                            <Button asChild variant="danger" className="ml-auto">
                                <LogoutButton />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
