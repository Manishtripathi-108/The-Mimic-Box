import OnlineGameLobby from '@/app/(public)/games/tic-tac-toe/_components/OnlineGameLobby';
import { GameMode } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return [{ mode: 'classic' }, { mode: 'ultimate' }, { mode: 'waiting-room' }];
};

const TicTacToeOnlineWrapper = async ({ params }: { params: Promise<{ mode: GameMode | 'waiting-room' }> }) => {
    const { mode } = await params;
    return <OnlineGameLobby mode={mode} />;
};

export default TicTacToeOnlineWrapper;
