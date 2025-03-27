import { notFound } from 'next/navigation';

import TicTacToeOnlineMode from '@/app/(protected)/games/tic-tac-toe/_components/Online';
import { GameMode } from '@/lib/types/tic-tac-toe.types';

// import ScoreBoard from '@/app/(protected)/games/tic-tac-toe/_components/ScoreBoard';

const TicTacToeOnlineWrapper = async ({ params }: { params: Promise<{ mode: GameMode | 'waiting-room' }> }) => {
    const { mode } = await params;

    if (!['classic', 'ultimate', 'waiting-room'].includes(mode)) return notFound();

    return <TicTacToeOnlineMode mode={mode} />;
};

export default TicTacToeOnlineWrapper;
