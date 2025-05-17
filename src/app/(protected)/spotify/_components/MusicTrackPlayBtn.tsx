'use client';

import { memo } from 'react';

import isEqual from 'lodash.isequal';

import Icon from '@/components/ui/Icon';
import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
// import useMapSpotifyTracksToSaavn from '@/hooks/useMapSpotifyTracksToSaavn';
import { T_TrackContext } from '@/lib/types/client.types';

const MusicTrackBtn = ({ id, context }: { id: string; context: T_TrackContext }) => {
    const { playbackContext, currentTrack, playing, pause, play, playTrackById } = useAudioPlayerContext();
    // const { isPending, mapTracks } = useMapSpotifyTracksToSaavn();
    const isSameContext = isEqual(playbackContext, context);
    const isCurrentTrack = currentTrack && currentTrack.spotifyId === id;

    const getPlayerState = () => {
        if (isSameContext && isCurrentTrack && playing) return true;
        return false;
    };

    const handlePlayPause = () => {
        if (isCurrentTrack) {
            if (playing) {
                pause();
            } else {
                play();
            }
        } else {
            if (isSameContext) {
                playTrackById({ spotifyId: id });
            } else {
                // TODO: Implement track mapping and queue setting
                // if (isPending) return;
                // mapTracks().then((tracks) => {
                //     if (tracks) {
                //         setQueue(tracks, context, true);
                //         playTrackById({ spotifyId: id });
                //     } else {
                //         console.error('Failed to map tracks');
                //     }
                // });
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handlePlayPause}
            className="hover:text-text-primary size-7 shrink-0 cursor-pointer transition-colors"
            aria-label={getPlayerState() ? 'Play' : 'Pause'}>
            <Icon icon={getPlayerState() ? 'pauseToPlay' : 'playToPause'} className="size-full" />
        </button>
    );
};

export default memo(MusicTrackBtn);
