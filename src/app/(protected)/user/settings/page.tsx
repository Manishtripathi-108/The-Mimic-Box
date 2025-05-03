import Image from 'next/image';

import { auth } from '@/auth';
import LogoutButton from '@/components/ui/LogoutButton';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';

const Page = async () => {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const { name, image, email } = session.user;

    return (
        <div className="grid place-items-center">
            <div className="mt-4 w-full max-w-xl px-3 pt-24 md:pt-20">
                <div className="from-secondary to-tertiary shadow-floating-xs rounded-2xl bg-linear-150 from-15% to-85% p-3 sm:p-6">
                    <div className="rounded-xl border p-3 sm:p-6">
                        <div className="from-secondary to-tertiary shadow-pressed-xs -mt-20 size-32 rounded-full border bg-linear-150 from-15% to-85% p-2 sm:-mt-24 sm:size-44">
                            <Image
                                className="shadow-floating-xs size-full rounded-full border object-cover p-3"
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
                            <button type="button" className="button button-highlight">
                                Edit
                            </button>
                            <LogoutButton className="button button-danger" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
