import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Music Search',
    description: 'Search music with JioSaavn while Spotify features are restricted by policy.',
};

const Page = () => {
    return (
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-3 text-center">
            <h1 className="text-highlight font-alegreya text-3xl font-bold sm:text-4xl">Search Music</h1>
            <p className="text-text-secondary">
                Spotify developer access is currently restricted under the latest platform policy updates. Use the search bar above to continue with
                JioSaavn-based browsing.
            </p>
        </section>
    );
};

export default Page;
