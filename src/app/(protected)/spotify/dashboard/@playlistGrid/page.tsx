import Link from 'next/link';

import { getSpotifyCurrentUserPlaylists } from '@/actions/spotify.actions';
import MusicCard from '@/app/(protected)/spotify/_components/MusicCard';
import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';

const MusicCardGrid = async () => {
    const res = await getSpotifyCurrentUserPlaylists();
    if (!res.success || !res.payload) {
        return <div className="text-text-secondary">Error fetching playlists</div>;
    }

    return (
        <section>
            <div className="mb-2 flex items-center justify-between px-4 sm:px-6">
                <h2 className="text-highlight font-alegreya text-2xl font-semibold tracking-wide">Your Playlists</h2>
                <Link
                    href={APP_ROUTES.SPOTIFY_PLAYLISTS}
                    title="Show All"
                    aria-label="Show All"
                    className="text-text-secondary hover:text-text-primary size-7 rotate-90 transition-colors">
                    <Icon icon="moreDots" className="size-full" />
                </Link>
            </div>
            <div className="relative">
                <div className="from-primary pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l to-transparent" />
                <div className="from-primary pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r to-transparent" />
                <div className="scrollbar-hide flex gap-2 overflow-x-auto px-4 sm:gap-4 sm:px-6 sm:[scrollbar-width:none]">
                    {res.payload.items.map((item) => (
                        <MusicCard key={item.id} title={item.name} thumbnailUrl={item.images[0].url} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MusicCardGrid;
