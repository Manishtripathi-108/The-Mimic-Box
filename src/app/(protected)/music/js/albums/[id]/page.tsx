import { Metadata } from 'next';

import Link from 'next/link';

import { saavnGetAlbumDetails } from '@/actions/saavn.actions';
import MusicActionBtns from '@/app/(protected)/music/_components/MusicActionBtns';
import MusicMediaHeader from '@/app/(protected)/music/_components/MusicMediaHeader';
import MusicTrackCard from '@/app/(protected)/music/_components/MusicTrackCard';
import ErrorCard from '@/components/layout/ErrorCard';
import { APP_ROUTES } from '@/constants/routes.constants';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> => {
    const { id } = await params;

    const res = await saavnGetAlbumDetails(id);

    if (!res.success || !res.payload) {
        return {
            title: 'Album Not Found',
            description: 'The requested album could not be found.',
            keywords: ['Album', 'Music', 'Mimic', 'Metadata', 'Not Found'],
        };
    }

    const album = res.payload;
    const artistNames = album.artists?.primary?.map((artist) => artist.name).filter(Boolean) || ['Unknown'];

    return {
        title: album.name,
        description: `View details of the album "${album.name}" by ${artistNames.join(', ')}.`,
        keywords: ['Music', 'Album', 'Music', 'Mimic', 'Metadata', album.name, ...artistNames],
        openGraph: {
            images: [{ url: album.image?.[2]?.url }],
        },
        twitter: {
            card: 'summary_large_image',
            title: album.name,
            description: `View details of the album "${album.name}" by ${artistNames.join(', ')}.`,
            images: [album.image?.[2]?.url],
        },
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const res = await saavnGetAlbumDetails(id);

    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch album'} />;
    }

    const album = res.payload;
    const { name, image, artists, description, songCount, songs } = album;

    return (
        <>
            <MusicMediaHeader title={name} coverImage={image?.[2]?.url} description={description} metadata={`${songCount} songs`}>
                <>
                    Artists:&nbsp;
                    {artists?.all?.map((artist, idx) => (
                        <span key={artist.id}>
                            <Link href={APP_ROUTES.MUSIC.JS.ARTISTS(artist.id)} className="text-text-primary hover:underline">
                                {artist.name}
                            </Link>
                            {idx < artists.primary.length - 1 ? ', ' : ''}
                        </span>
                    )) || 'Unknown'}
                </>
            </MusicMediaHeader>

            <MusicActionBtns context={{ id: album.id, type: 'album', source: 'saavn' }} className="mt-4" />

            {/* Songs List */}
            <div className="mt-6 grid w-full gap-2">
                {songs?.map((t, idx) =>
                    t && !('show' in t) ? (
                        <MusicTrackCard
                            key={`${t.id}-${idx}`}
                            id={t.id}
                            title={t.name}
                            link={APP_ROUTES.MUSIC.JS.TRACKS(t.id)}
                            duration_ms={(t.duration || 0) * 1000}
                            artists={t.artists.primary.map((artist) => ({
                                id: artist.id,
                                name: artist.name,
                                link: APP_ROUTES.MUSIC.JS.ARTISTS(artist.id),
                            }))}
                            context={{ type: 'album', id: album.id, source: 'saavn' }}
                        />
                    ) : null
                )}
            </div>
        </>
    );
};

export default Page;
