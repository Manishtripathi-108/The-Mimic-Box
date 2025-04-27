import React from 'react';

import { getSpotifyPlaylistDetails } from '@/actions/spotify.actions';
import Playlist from '@/app/(protected)/spotify/_components/PlayList';

const ComponentName = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    const res = await getSpotifyPlaylistDetails(id);
    if (!res.success || !res.payload) {
        return <div className="text-text-primary">Failed to fetch playlist details</div>;
    }

    return <Playlist playlist={res.payload} />;
};

export default ComponentName;
