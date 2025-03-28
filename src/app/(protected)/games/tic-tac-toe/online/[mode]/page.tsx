import { notFound } from 'next/navigation';

import OnlineGameLobby from '@/app/(protected)/games/tic-tac-toe/_components/OnlineGameLobby';
import { GameMode } from '@/lib/types/tic-tac-toe.types';

const TicTacToeOnlineWrapper = async ({ params }: { params: Promise<{ mode: GameMode | 'waiting-room' }> }) => {
    const { mode } = await params;
    if (!['classic', 'ultimate', 'waiting-room'].includes(mode)) return notFound();

    return <OnlineGameLobby mode={mode} />;
};

export default TicTacToeOnlineWrapper;
