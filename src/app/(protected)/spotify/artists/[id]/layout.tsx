import { Metadata } from 'next';

import { getSpotifyArtistDetails } from '@/actions/spotify.actions';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;
    const res = await getSpotifyArtistDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Artist Not Found',
            description: 'The requested Spotify artist could not be found.',
            keywords: ['Spotify', 'Artist', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const artist = res.payload;

    return {
        title: artist.name,
        description: `Explore artist profile for ${artist.name} — with ${artist.followers?.total?.toLocaleString()} followers and a popularity score of ${artist.popularity}%.`,
        keywords: ['Spotify', 'Artist', 'Music', 'Mimic', 'Metadata', artist.name, ...(artist.genres || [])],
        openGraph: {
            images: [
                {
                    url: artist.images?.[0]?.url || '',
                    width: 300,
                    height: 300,
                    alt: `Photo of ${artist.name}`,
                },
            ],
        },
    };
};

const Layout = ({ header, popularTracks, albums }: { header: React.ReactNode; popularTracks: React.ReactNode; albums: React.ReactNode }) => {
    return (
        <div className="flex flex-col gap-6">
            {header}
            {popularTracks}
            {albums}
        </div>
    );
};

export default Layout;
