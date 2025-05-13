import { T_AudioPlayerAction, T_AudioPlayerState } from '@/lib/types/client.types';

export const audioPlayerInitialState: T_AudioPlayerState = {
    playbackContext: null,
    currentTrackIndex: 0,
    queue: [],
    playbackOrder: [],
    loopMode: null,
    isShuffled: false,
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
            const queueLength = action.payload.tracks.length;
            return {
                ...state,
                queue: action.payload.tracks,
                playbackContext: action.payload.context,
                currentTrackIndex: 0,
                playbackOrder: state.isShuffled ? generateShuffleOrder(queueLength) : Array.from({ length: queueLength }, (_, i) => i),
            };
        }

        case 'ADD_TO_QUEUE': {
            const addedCount = action.payload.length;
            const updatedQueue = [...state.queue, ...action.payload];
            const baseIndex = state.queue.length;
            const newOrderEntries = Array.from({ length: addedCount }, (_, i) => baseIndex + i);

            return {
                ...state,
                queue: updatedQueue,
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

        case 'TOGGLE_LOOP':
            return {
                ...state,
                loopMode: state.loopMode === null ? 'one' : state.loopMode === 'one' ? 'all' : null,
            };

        case 'TOGGLE_SHUFFLE': {
            const isShuffleEnabled = !state.isShuffled;
            return {
                ...state,
                isShuffled: isShuffleEnabled,
                playbackOrder: isShuffleEnabled ? generateShuffleOrder(state.queue.length) : Array.from({ length: state.queue.length }, (_, i) => i),
            };
        }

        case 'NEXT_TRACK': {
            const { loopMode, currentTrackIndex, playbackOrder } = state;
            if (loopMode === 'one') return state;

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
