'use client';

import React from 'react';

import { Icon } from '@iconify/react';
import { AnimatePresence } from 'motion/react';

import GameOverModal from '@/app/(protected)/games/tic-tac-toe/_components/GameOverModal';
import PlayerNameModal from '@/app/(protected)/games/tic-tac-toe/_components/PlayerNameModal';
import ScoreBoard from '@/app/(protected)/games/tic-tac-toe/_components/ScoreBoard';
import TicTacToeHeader from '@/app/(protected)/games/tic-tac-toe/_components/TicTacToeHeader';
import { ConfirmationModal, openModal } from '@/components/Modals';
import ICON_SET from '@/constants/icons';
import { useTicTacToeContext } from '@/contexts/TicTacToe/TicTacToeContext';

const TicTacToeOfflineLayout = ({ children }: { children: React.ReactNode }) => {
    const { state, restartGame, resetBoard } = useTicTacToeContext();
    const {
        gameMode,
        onlineMode,
        playerSymbol,
        gameRoomName,
        isNextX,
        hasGameEnded,
        gameWinner,
        isStalemate,
        stalemateCount,
        playerXData,
        playerOData,
    } = state;

    const renderGameStatus = () => {
        if (hasGameEnded) {
            return isStalemate ? "It's a Draw!" : `${gameWinner} Wins!`;
        }
        return isNextX ? `${playerXData.name}'s turn` : `${playerOData.name}'s turn`;
    };

    return (
        <>
            <TicTacToeHeader title={onlineMode ? `Welcome to ${gameRoomName} (${gameMode})` : gameMode} playingOnline={onlineMode} />

            <div className="container mx-auto grid place-items-center gap-5 px-2 py-5">
                <div className="text-text-primary flex w-full max-w-4xl items-center justify-evenly">
                    <span className="text-text-secondary font-julee text-4xl">{isNextX ? 'X' : 'O'}</span>
                    <h2 className="text-accent line-clamp-1 text-center text-2xl font-bold tracking-wider capitalize">{renderGameStatus()}</h2>
                    {onlineMode ? (
                        <span className="text-highlight font-julee text-4xl">{playerSymbol}</span>
                    ) : (
                        <button onClick={() => openModal('game_action')} type="button" title="Clear Board" className="button rounded-xl p-2">
                            <Icon icon={ICON_SET.BROOM} className="size-6" />
                        </button>
                    )}
                </div>

                <div className="relative">
                    {children}
                    <AnimatePresence>{hasGameEnded && <GameOverModal status={renderGameStatus()} />}</AnimatePresence>
                </div>

                <ScoreBoard playerX={playerXData} playerO={playerOData} drawScore={stalemateCount} />

                <div className="mt-5 grid grid-cols-2 gap-4">
                    <button onClick={restartGame} className="button">
                        <Icon icon={ICON_SET.GAMEPAD} className="size-6" />
                        Start Over
                    </button>
                    <button className="button" onClick={() => openModal('playerNameModal')}>
                        <Icon icon={ICON_SET.PLAYER} className="size-5" />
                        Change <span className="hidden md:inline">Player</span> Name
                    </button>
                </div>
            </div>

            <PlayerNameModal />
            <ConfirmationModal
                modalId={'game_action'}
                icon={ICON_SET.ERROR}
                iconClassName="size-20"
                onConfirm={resetBoard}
                cancelText="Cancel"
                confirmText="Clear Board"
                isConfirmDanger={true}>
                Are you sure you want to clear the board?
            </ConfirmationModal>
        </>
    );
};

export default TicTacToeOfflineLayout;
