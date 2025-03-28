import { defaultGameState } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeReducer';
import { TicTacToeGameState } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';

const WINNING_PATTERNS = {
    9: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ],
    16: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12],
    ],
    25: [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
    ],
};

export const evaluateBoardStatus = (
    board: ('X' | 'O' | 'D' | null)[]
): { status: 'win'; winner: 'X' | 'O'; line: number[] } | { status: 'draw' } | { status: 'continue' } => {
    for (const pattern of WINNING_PATTERNS[board.length as 9 | 16 | 25]) {
        if ((board[pattern[0]] === 'X' || board[pattern[0]] === 'O') && pattern.every((idx) => board[idx] && board[idx] === board[pattern[0]])) {
            return { status: 'win', winner: board[pattern[0]] as 'X' | 'O', line: pattern };
        }
    }
    const isBoardFull = board.every((cell) => cell);
    if (isBoardFull) return { status: 'draw' };
    return { status: 'continue' };
};

export const incrementPlayerScore = (state: TicTacToeGameState, winner: 'X' | 'O' | null): TicTacToeGameState => {
    if (!winner) return state;
    const playerKey = winner === 'X' ? 'playerXData' : 'playerOData';
    return {
        ...state,
        [playerKey]: {
            ...state[playerKey],
            score: state[playerKey].score + 1,
        },
    };
};

export const restoreInitialState = (state: TicTacToeGameState, overrides: Partial<TicTacToeGameState> = {}): TicTacToeGameState => ({
    ...defaultGameState,
    gameMode: state.gameMode,
    gameRoomId: state.gameRoomId,
    gameRoomName: state.gameRoomName,
    hasGameStarted: state.hasGameStarted,
    stalemateCount: state.stalemateCount,
    playerXData: state.playerXData,
    playerOData: state.playerOData,
    ...overrides,
});
