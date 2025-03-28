'use client';

import { TicTacToeActions, TicTacToeGameState } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';
import { evaluateBoardStatus, incrementPlayerScore, restoreInitialState } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.utils';

export const defaultGameState: TicTacToeGameState = {
    gameMode: 'classic',
    classicBoardState: Array(9).fill(null),
    ultimateBoardState: Array(9).fill(Array(9).fill(null)),

    // Online play
    isFetching: false,
    awaitingOpponent: false,
    playerSymbol: null,
    gameRoomId: null,
    gameRoomName: null,
    hasGameStarted: false,

    // Game state
    isNextX: true,
    hasGameEnded: false,
    gameWinner: null,
    winningIndexes: null,
    isStalemate: false,
    stalemateCount: 0,
    activeCellIndex: null,

    // Player details
    playerXData: { id: null, name: 'Player 1', score: 0 },
    playerOData: { id: null, name: 'Player 2', score: 0 },
};

export const TicTacToeReducer = (state: TicTacToeGameState, action: TicTacToeActions): TicTacToeGameState => {
    switch (action.type) {
        case 'SET_MODE': {
            const { payload: gameMode } = action;
            return ['classic', 'ultimate'].includes(gameMode) ? restoreInitialState(state, { gameMode }) : state;
        }

        case 'UPDATE_PLAYER':
            return {
                ...state,
                [`${action.payload.player === 'X' ? 'playerXData' : 'playerOData'}`]: {
                    ...state[action.payload.player === 'X' ? 'playerXData' : 'playerOData'],
                    name: action.payload.name,
                },
            };

        case 'MAKE_MOVE': {
            const { macroIndex, cellIndex } = action.payload;
            const { gameMode, isNextX, hasGameEnded, classicBoardState, ultimateBoardState, activeCellIndex } = state;

            if (hasGameEnded || classicBoardState[macroIndex]) return state;

            if (gameMode === 'classic') {
                const updatedBoard = classicBoardState.map((cell, i) => (i === macroIndex ? (isNextX ? 'X' : 'O') : cell));
                const result = evaluateBoardStatus(updatedBoard);

                const newState = {
                    ...state,
                    classicBoardState: updatedBoard,
                    isNextX: !isNextX,
                    hasGameEnded: result.status !== 'continue',
                    gameWinner: result.status === 'win' ? state[`${result.winner === 'X' ? 'playerXData' : 'playerOData'}`].name : null,
                    winningIndexes: result.status === 'win' ? result.line : null,
                    isStalemate: result.status === 'draw',
                };

                if (result.status === 'win') return incrementPlayerScore(newState, result.winner);
                else if (result.status === 'draw') newState.stalemateCount += 1;
                return newState;
            } else {
                if (
                    cellIndex === undefined ||
                    ultimateBoardState[macroIndex][cellIndex] ||
                    (activeCellIndex !== null && activeCellIndex !== macroIndex)
                ) {
                    return state;
                }

                const updatedUltimateBoard = ultimateBoardState.map((board, i) =>
                    i === macroIndex ? board.map((cell, j) => (j === cellIndex ? (isNextX ? 'X' : 'O') : cell)) : board
                );

                const miniResult = evaluateBoardStatus(updatedUltimateBoard[macroIndex]);
                const updatedClassicBoard = [...classicBoardState];

                if (miniResult.status === 'win') updatedClassicBoard[macroIndex] = miniResult.winner;
                else if (miniResult.status === 'draw') updatedClassicBoard[macroIndex] = 'D';

                const largeResult = evaluateBoardStatus(updatedClassicBoard);

                const newState = {
                    ...state,
                    ultimateBoardState: updatedUltimateBoard,
                    classicBoardState: updatedClassicBoard,
                    isNextX: !isNextX,
                    hasGameEnded: largeResult.status !== 'continue',
                    gameWinner: largeResult.status === 'win' ? state[`${largeResult.winner === 'X' ? 'playerXData' : 'playerOData'}`].name : null,
                    winningIndexes: largeResult.status === 'win' ? largeResult.line : null,
                    isStalemate: largeResult.status === 'draw',
                    activeCellIndex: updatedClassicBoard[cellIndex] ? null : cellIndex,
                };

                if (largeResult.status === 'win') return incrementPlayerScore(newState, largeResult.winner);
                if (largeResult.status === 'draw') newState.stalemateCount += 1;
                return newState;
            }
        }

        case 'UPDATE_STATE':
            return { ...state, ...action.payload };

        case 'TOGGLE_LOADING':
            return { ...state, isFetching: action.payload };

        case 'RESTART_SOFT':
            return { ...defaultGameState, gameMode: state.gameMode };

        case 'RESET_HARD':
            return restoreInitialState(state, { isNextX: Math.random() < 0.5 });

        default:
            return state;
    }
};
