'use client';

import React from 'react';

import { redirect } from 'next/navigation';

import { AnimatePresence } from 'motion/react';

import MatchResultModal from '@/app/(protected)/games/tic-tac-toe/_components/MatchResultModal';
import ScoreBoard from '@/app/(protected)/games/tic-tac-toe/_components/ScoreBoard';
import TicTacToeBoard from '@/app/(protected)/games/tic-tac-toe/_components/TicTacToeBoard';
import WaitingRoom from '@/app/(protected)/games/tic-tac-toe/_components/WaitingRoom';
import { APP_ROUTES } from '@/constants/routes.constants';
import { useTicTacToeContext } from '@/contexts/TicTacToe/TicTacToeContext';
import { GameMode } from '@/lib/types/tic-tac-toe.types';

const OnlineGameLobby = ({ mode }: { mode: GameMode | 'waiting-room' }) => {
    const { playerSymbol, gameRoomId, isNextX, hasGameEnded, gameWinner, isStalemate, stalemateCount, playerXData, playerOData } =
        useTicTacToeContext().state;

    if (!gameRoomId) redirect(APP_ROUTES.GAMES_TIC_TAC_TOE_INDEX);

    const renderGameStatus = () => {
        if (hasGameEnded) {
            return isStalemate ? "It's a Draw!" : `${gameWinner} Wins!`;
        }
        return isNextX ? `${playerXData.name}'s turn` : `${playerOData.name}'s turn`;
    };

    if (mode === 'waiting-room') return <WaitingRoom />;
    return (
        <div className="container mx-auto grid place-items-center gap-6 px-4 py-6">
            {/* Header */}
            <header className="w-full max-w-lg space-y-2 text-center">
                {/* Player Names */}
                <h2 className="text-highlight flex items-center justify-center gap-2 text-lg font-semibold tracking-wide">
                    <span className="text-accent max-w-[120px] truncate text-3xl font-bold">{playerXData.name}</span>
                    <span className="text-text-secondary text-lg"> (X) </span>
                    <span className="text-text-primary text-lg"> VS </span>
                    <span className="text-text-secondary text-lg"> (O) </span>
                    <span className="text-accent max-w-[120px] truncate text-3xl font-bold">{playerOData.name}</span>
                </h2>

                {/* Turn Indicator */}
                <h2 className="text-text-secondary text-xl font-medium tracking-wide">
                    It&apos;s
                    <span className="bg-tertiary text-highlight ml-2 inline-block rounded-lg px-3 py-1 text-lg font-bold">
                        {(playerSymbol === 'X') === isNextX ? 'Your' : 'Their'}
                    </span>
                    turn
                </h2>
            </header>

            {/* Board and Game Over Modal */}
            <div className="relative">
                <TicTacToeBoard mode={mode} />
                <AnimatePresence>{hasGameEnded && <MatchResultModal status={renderGameStatus()} />}</AnimatePresence>
            </div>

            {/* Score Board */}
            <ScoreBoard playerX={playerXData} playerO={playerOData} drawScore={stalemateCount} />
        </div>
    );
};

export default OnlineGameLobby;
