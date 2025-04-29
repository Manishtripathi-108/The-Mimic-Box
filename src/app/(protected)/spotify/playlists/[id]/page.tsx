import React from 'react';

import { getSpotifyPlaylistDetails } from '@/actions/spotify.actions';
import Playlist from '@/app/(protected)/spotify/_components/PlayList';
import ErrorCard from '@/components/layout/ErrorCard';

const PlayListDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const res = await getSpotifyPlaylistDetails(id);
    if (!res.success || !res.payload) {
        return <ErrorCard message={res.message || 'Failed to fetch playlist'} />;
    }

    return <Playlist playlist={res.payload} />;
};

export default PlayListDetails;
