import TicTacToeBoard from '@/app/(public)/games/tic-tac-toe/_components/TicTacToeBoard';
import { GameMode } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return [{ mode: 'classic' }, { mode: 'ultimate' }];
};

const TicTacToeOfflineMode = async ({ params }: { params: Promise<{ mode: GameMode }> }) => {
    const { mode } = await params;
    return <TicTacToeBoard mode={mode} />;
};

export default TicTacToeOfflineMode;
