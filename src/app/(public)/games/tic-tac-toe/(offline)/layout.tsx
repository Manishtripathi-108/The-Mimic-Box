'use client';

import Link from 'next/link';

import { AnimatePresence } from 'motion/react';

import MatchResultModal from '@/app/(public)/games/tic-tac-toe/_components/MatchResultModal';
import ScoreBoard from '@/app/(public)/games/tic-tac-toe/_components/ScoreBoard';
import SetPlayerNamesModal from '@/app/(public)/games/tic-tac-toe/_components/SetPlayerNamesModal';
import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import Icon from '@/components/ui/Icon';
import { ConfirmationModal, openModal } from '@/components/ui/Modals';
import { APP_ROUTES } from '@/constants/routes.constants';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { state, restartGame, resetBoard } = useTicTacToeContext();
    const { gameMode, isNextX, hasGameEnded, gameWinner, isStalemate, stalemateCount, playerXData, playerOData } = state;

    const renderGameStatus = () => {
        if (hasGameEnded) {
            return isStalemate ? "It's a Draw!" : `${gameWinner} Wins!`;
        }
        return isNextX ? `${playerXData.name}'s turn` : `${playerOData.name}'s turn`;
    };

    return (
        <div className="container mx-auto grid place-items-center gap-5 px-4 pb-6">
            {/* Header */}
            <header className="flex w-full max-w-4xl items-center justify-between border-b px-2 py-4">
                <h1 className="text-highlight text-lg font-bold tracking-wide capitalize md:text-4xl">{gameMode}</h1>
                <nav className="flex gap-2">
                    <Link
                        href={gameMode === 'ultimate' ? APP_ROUTES.GAMES_TIC_TAC_TOE_CLASSIC : APP_ROUTES.GAMES_TIC_TAC_TOE_ULTIMATE}
                        className="button">
                        {gameMode === 'ultimate' ? 'Play Classic' : 'Play Ultimate'}
                    </Link>
                    <Link href={APP_ROUTES.GAMES_TIC_TAC_TOE_ONLINE} className="button">
                        Play Online
                    </Link>
                </nav>
            </header>

            {/* Game Status */}
            <section className="flex w-full max-w-4xl items-center justify-between rounded-lg px-4 py-3">
                <span className="text-text-secondary text-4xl">{isNextX ? 'X' : 'O'}</span>
                <h2 className="text-accent text-center text-2xl font-bold capitalize">{renderGameStatus()}</h2>
                <button
                    onClick={() => openModal('game_action')}
                    type="button"
                    title="Clear Board"
                    className="button size-10 rounded-xl p-2"
                    aria-label="Clear Board">
                    <Icon icon="broom" className="size-full" />
                </button>
            </section>

            {/* Game Board */}
            <main className="relative">
                {children}
                <AnimatePresence>{hasGameEnded && <MatchResultModal status={renderGameStatus()} />}</AnimatePresence>
            </main>

            {/* Score Board */}
            <ScoreBoard playerX={playerXData} playerO={playerOData} drawScore={stalemateCount} />

            {/* Controls */}
            <footer className="mt-5 grid grid-cols-2 gap-4">
                <button onClick={restartGame} className="button">
                    <Icon icon="gamepad" className="size-6" />
                    Start Over
                </button>
                <button className="button" onClick={() => openModal('SetPlayerNamesModal')}>
                    <Icon icon="player" className="size-5" />
                    Change <span className="hidden md:inline">Player</span> Name
                </button>
            </footer>

            {/* Modals */}
            <SetPlayerNamesModal />
            <ConfirmationModal
                modalId="game_action"
                icon="error"
                iconClassName="size-20"
                onConfirm={resetBoard}
                cancelText="Cancel"
                confirmText="Clear Board"
                isConfirmDanger>
                Are you sure you want to clear the board?
            </ConfirmationModal>
        </div>
    );
};

export default Layout;
