'use client';

import { T_AudioPlayerAction, T_AudioPlayerState } from '@/lib/types/client.types';
import { isBrowser } from '@/lib/utils/core.utils';

export const audioPlayerInitialState: T_AudioPlayerState = {
    playbackContext: null,
    currentTrackIndex: 0,
    queue: [],
    playbackOrder: [],
    isShuffled: isBrowser ? localStorage.getItem('audioPlayerShuffle') === 'true' : false,
};

const generateShuffleOrder = (length: number): number[] => {
    const order = Array.from({ length }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
};

export function audioPlayerReducer(state: T_AudioPlayerState, action: T_AudioPlayerAction): T_AudioPlayerState {
    switch (action.type) {
        case 'SET_QUEUE': {
            const trackMap = new Map();
            for (const track of action.payload.tracks) {
                trackMap.set(track.id, track);
            }
            const uniqueTracks = Array.from(trackMap.values());
            const queueLength = uniqueTracks.length;

            return {
                ...state,
                queue: uniqueTracks,
                playbackContext: action.payload.context,
                currentTrackIndex: 0,
                playbackOrder: state.isShuffled ? generateShuffleOrder(queueLength) : Array.from({ length: queueLength }, (_, i) => i),
            };
        }

        case 'ADD_TO_QUEUE': {
            const trackMap = new Map();

            // Add existing queue tracks first
            for (const track of state.queue) {
                trackMap.set(track.id, track);
            }

            // Add new tracks
            for (const track of action.payload.tracks) {
                trackMap.set(track.id, track);
            }

            const updatedQueue = Array.from(trackMap.values());
            const newTrackCount = updatedQueue.length - state.queue.length;

            const baseIndex = state.queue.length;
            const newOrderEntries = Array.from({ length: newTrackCount }, (_, i) => baseIndex + i);

            return {
                ...state,
                queue: updatedQueue,
                playbackContext: action.payload.context || state.playbackContext,
                playbackOrder: [...state.playbackOrder, ...newOrderEntries],
            };
        }

        case 'CLEAR_QUEUE':
            return {
                ...state,
                queue: [],
                playbackOrder: [],
                currentTrackIndex: 0,
                playbackContext: null,
            };

        case 'PLAY_INDEX':
            return { ...state, currentTrackIndex: action.payload };

        case 'PLAY_ID': {
            const trackIndex = state.queue.findIndex((track) => track.id === action.payload);
            if (trackIndex !== -1) {
                return {
                    ...state,
                    currentTrackIndex: trackIndex,
                };
            }
            return state;
        }

        case 'TOGGLE_SHUFFLE': {
            const isShuffleEnabled = !state.isShuffled;
            if (isBrowser) {
                localStorage.setItem('audioPlayerShuffle', String(isShuffleEnabled));
            }
            return {
                ...state,
                isShuffled: isShuffleEnabled,
                playbackOrder: isShuffleEnabled ? generateShuffleOrder(state.queue.length) : Array.from({ length: state.queue.length }, (_, i) => i),
            };
        }

        case 'NEXT_TRACK': {
            const { currentTrackIndex, playbackOrder } = state;

            const currentIdxInOrder = playbackOrder.indexOf(currentTrackIndex);
            const isLastTrack = currentIdxInOrder === playbackOrder.length - 1;
            const nextIdxInOrder = isLastTrack ? 0 : currentIdxInOrder + 1;

            return {
                ...state,
                currentTrackIndex: playbackOrder[nextIdxInOrder],
            };
        }

        case 'PREV_TRACK': {
            const { currentTrackIndex, playbackOrder } = state;
            const currentIdxInOrder = playbackOrder.indexOf(currentTrackIndex);
            const prevIdxInOrder = currentIdxInOrder === 0 ? playbackOrder.length - 1 : currentIdxInOrder - 1;

            return {
                ...state,
                currentTrackIndex: playbackOrder[prevIdxInOrder],
            };
        }

        default:
            return state;
    }
}
