'use client';

import Link from 'next/link';

import { AnimatePresence } from 'motion/react';

import MatchResultModal from '@/app/(public)/games/tic-tac-toe/_components/MatchResultModal';
import ScoreBoard from '@/app/(public)/games/tic-tac-toe/_components/ScoreBoard';
import SetPlayerNamesModal from '@/app/(public)/games/tic-tac-toe/_components/SetPlayerNamesModal';
import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal, openModal } from '@/components/ui/Modals';
import APP_ROUTES from '@/constants/routes/app.routes';

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
                    <Button asChild>
                        <Link href={gameMode === 'ultimate' ? APP_ROUTES.GAMES.TIC_TAC_TOE.CLASSIC : APP_ROUTES.GAMES.TIC_TAC_TOE.ULTIMATE}>
                            {gameMode === 'ultimate' ? 'Play Classic' : 'Play Ultimate'}
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={APP_ROUTES.GAMES.TIC_TAC_TOE.ONLINE}>Play Online</Link>
                    </Button>
                </nav>
            </header>

            {/* Game Status */}
            <section className="flex w-full max-w-4xl items-center justify-between rounded-lg px-4 py-3">
                <span className="text-text-secondary text-4xl">{isNextX ? 'X' : 'O'}</span>
                <h2 className="text-accent text-center text-2xl font-bold capitalize">{renderGameStatus()}</h2>
                <Button
                    onClick={() => openModal('game_action')}
                    className="rounded-lg"
                    title="Clear Board"
                    size="lg"
                    aria-label="Clear Board"
                    icon="broom"
                />
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
                <Button onClick={restartGame} icon="gamepad">
                    Start Over
                </Button>
                <Button icon="player" onClick={() => openModal('SetPlayerNamesModal')}>
                    Change <span className="hidden md:inline">Player</span> Name
                </Button>
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
