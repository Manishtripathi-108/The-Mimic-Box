'use client';

import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { redirect } from 'next/navigation';

import toast from 'react-hot-toast';

import { GameMode, TicTacToeGameContext } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';
import APP_ROUTES from '@/constants/routes/app.routes';
import { useSocket } from '@/hooks/useSocket';

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
    const { socket, reconnect, disconnect } = useSocket();

    // Connect to socket
    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            dispatch({ type: 'TOGGLE_LOADING', payload: true });
        });

        socket.on('updateGame', (roomState) => {
            dispatch({ type: 'UPDATE_STATE', payload: { ...roomState } });
        });

        socket.on('error', (message) => {
            console.error('Error:', message);
            toast.error(message);
        });

        socket.on('disconnect', () => {
            dispatch({ type: 'RESET_HARD' });
        });

        socket.on('roomLeft', () => {
            toast.error('You left the room');
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
            const { isNextX, playerSymbol, gameRoomId, classicBoardState, ultimateBoardState, activeCellIndex } = state;

            if (
                (cellIndex && ultimateBoardState[macroIndex]?.[cellIndex]) ||
                classicBoardState[macroIndex] ||
                (activeCellIndex !== null && activeCellIndex !== macroIndex)
            ) {
                toast.error('Invalid move');
                return;
            }

            if (gameRoomId) {
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
        socket?.emit('startMatch', { roomId: state.gameRoomId });
    }, [socket, state.gameRoomId]);

    const joinRoom = useCallback(
        (roomId: string, playerName: string) => {
            reconnect();
            socket?.emit(
                'joinRoom',
                { roomId, playerName },
                ({ success, message, mode }: { success: boolean; message: string; mode: GameMode | 'waiting-room' }) => {
                    dispatch({ type: 'TOGGLE_LOADING', payload: false });
                    toast.error(message);
                    redirect(success ? APP_ROUTES.GAMES.TIC_TAC_TOE.ONLINE_MODE(mode) : APP_ROUTES.GAMES.TIC_TAC_TOE.ONLINE);
                }
            );
        },
        [socket, reconnect]
    );

    const createRoom = useCallback(
        (mode: GameMode, playerName: string) => {
            reconnect();
            socket?.emit(
                'createRoom',
                { playerName, mode },
                ({ success, gameRoomId, message }: { success: boolean; gameRoomId: string; message: string }) => {
                    if (success) {
                        joinRoom(gameRoomId, playerName);
                    } else {
                        console.error('Error:', message);
                        toast.error(message);
                    }
                }
            );
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
        if (state.gameRoomId) {
            socket?.emit('resetRoom', state.gameRoomId);
        } else {
            dispatch({ type: 'RESET_HARD' });
        }
    }, [socket, state.gameRoomId]);

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
