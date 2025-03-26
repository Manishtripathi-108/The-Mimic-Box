'use client';

import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { redirect } from 'next/navigation';

import toast from 'react-hot-toast';

import { useSocket } from '@/hooks/useSocket';
import { TicTacToeGameContext } from '@/lib/types/tic-tac-toe.types';

import { TicTacToeReducer, defaultGameState } from './TicTacToeReducer';

const GameContext = createContext<TicTacToeGameContext | undefined>(undefined);

export const useTicTacToeContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};

export const TicTacToeProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(TicTacToeReducer, defaultGameState);
    const { socket, reconnect, disconnect } = useSocket('/tic-tac-toe');

    // Connect to socket
    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            dispatch({ type: 'TOGGLE_LOADING', payload: true });
        });

        socket.on('gameStarted', (roomState) => {
            dispatch({ type: 'UPDATE_STATE', payload: { hasStarted: true, ...roomState } });
        });

        socket.on('updateGame', (roomState) => {
            dispatch({ type: 'MAKE_MOVE', payload: { ...roomState } });
        });

        socket.on('gameError', (message) => {
            dispatch({ type: 'TOGGLE_LOADING', payload: false });
            console.log('Error:', message);
        });

        socket.on('disconnect', () => {
            dispatch({ type: 'RESET_HARD' });
        });

        socket.on('roomLeft', () => {
            console.log('You left the room');
            dispatch({ type: 'RESET_HARD' });
        });
    }, [socket]);

    // Actions
    const setMode = useCallback((gameMode: 'classic' | 'ultimate') => {
        dispatch({ type: 'SET_MODE', payload: gameMode });
    }, []);

    const setPlayers = useCallback((player: 'X' | 'O', name: string) => {
        dispatch({ type: 'UPDATE_PLAYER', payload: { player, name } });
    }, []);

    const makeMove = useCallback(
        (macroIndex: number, cellIndex?: number) => {
            const { onlineMode, isNextX, playerSymbol, gameRoomId, classicBoardState, ultimateBoardState, activeCellIndex } = state;

            if (
                (cellIndex && ultimateBoardState[macroIndex]?.[cellIndex]) ||
                classicBoardState[macroIndex] ||
                (activeCellIndex !== null && activeCellIndex !== macroIndex)
            ) {
                console.log('Invalid move', 'error');
                return;
            }

            if (onlineMode) {
                const isPlayerTurn = isNextX === (playerSymbol === 'X');
                if (isPlayerTurn) {
                    socket?.emit('playerMove', { gameRoomId, playerSymbol, macroIndex, cellIndex });
                } else {
                    toast.error('It is not your turn');
                }
            } else {
                dispatch({ type: 'MAKE_MOVE', payload: { macroIndex, cellIndex } });
            }
        },
        [socket, state]
    );

    const startMatch = useCallback(() => {
        socket?.emit('startMatch', { gameRoomId: state.gameRoomId });
    }, [socket, state.gameRoomId]);

    const joinRoom = useCallback(
        (gameRoomId: string, playerName: string, roomName = 'default', isCreating = false) => {
            reconnect();
            socket?.emit('joinRoom', { gameRoomId, playerName, roomName, isCreating });
            redirect('/games/tic-tac-toe/classic');
        },
        [socket, reconnect]
    );

    const createRoom = useCallback(
        (roomName: string, playerName: string) => {
            reconnect();
            socket?.emit('getRoomId', ({ success, gameRoomId, message }: { success: boolean; gameRoomId: string; message: string }) => {
                if (success) {
                    joinRoom(gameRoomId, playerName, roomName, true);
                } else {
                    console.log('Error:', message);
                }
            });
        },
        [socket, reconnect, joinRoom]
    );

    const leaveRoom = useCallback(() => {
        socket?.emit('leaveRoom', state.gameRoomId);
    }, [socket, state.gameRoomId]);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'TOGGLE_LOADING', payload: loading });
    }, []);

    const resetBoard = useCallback(() => {
        if (state.onlineMode) {
            socket?.emit('resetRoom', state.gameRoomId);
        } else {
            dispatch({ type: 'RESET_HARD' });
        }
    }, [socket, state.onlineMode, state.gameRoomId]);

    const restartGame = useCallback(() => {
        dispatch({ type: 'RESET_HARD' });
    }, []);

    return (
        <GameContext.Provider
            value={{
                resetBoard,
                connect: reconnect,
                createRoom,
                disconnect,
                makeMove,
                joinRoom,
                leaveRoom,
                setMode,
                setLoading,
                setPlayers,
                startMatch,
                restartGame,
                state,
            }}>
            {children}
        </GameContext.Provider>
    );
};
