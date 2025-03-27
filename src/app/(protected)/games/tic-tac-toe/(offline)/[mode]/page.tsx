import TicTacToeBoard from '@/app/(protected)/games/tic-tac-toe/_components/TicTacToeBoard';
import { GameMode } from '@/lib/types/tic-tac-toe.types';

const TicTacToeOfflineMode = async ({ params }: { params: Promise<{ mode: GameMode }> }) => {
    const { mode } = await params;
    return <TicTacToeBoard mode={mode} />;
};

export default TicTacToeOfflineMode;
