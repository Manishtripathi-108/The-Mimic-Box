import Image from 'next/image';

import A_Navbar from '@/app/(protected)/anilist/_components/A_Navbar';

const A_Header = ({ displayName, imageUrl, bannerUrl }: { displayName: string; imageUrl: string; bannerUrl: string }) => {
    return (
        <header className="relative">
            <div
                style={{ backgroundImage: `url(${bannerUrl})` }}
                className="shadow-pressed-sm bg-secondary after:from-primary/60 relative -z-10 h-48 border-b bg-cover bg-center bg-no-repeat after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-t after:to-transparent sm:h-72"
            />
            <div className="absolute inset-x-0 bottom-0 z-0 h-fit">
                <div className="mx-auto flex w-full max-w-(--breakpoint-md) items-end justify-start gap-3 opacity-100">
                    <Image
                        width={144}
                        height={144}
                        src={imageUrl}
                        alt={`${displayName}'s avatar`}
                        className="ml-5 aspect-square rounded-t-lg align-text-top"
                    />
                    <h1 className="text-text-primary font-alegreya mb-3 w-full truncate rounded-lg text-2xl font-bold tracking-wide sm:text-4xl">
                        {displayName}
                    </h1>
                </div>
                <A_Navbar />
            </div>
        </header>
    );
};

export default A_Header;
