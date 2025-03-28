import { Metadata } from 'next';

import TicTacToeBoard from '@/app/(public)/games/tic-tac-toe/_components/TicTacToeBoard';
import { GameMode } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return [{ mode: 'classic' }, { mode: 'ultimate' }];
};

export const generateMetadata = async ({ params }: { params: { mode: GameMode } }): Promise<Metadata> => {
    const modeTitle = params.mode === 'ultimate' ? 'Tic-Tac-Toe Ultimate' : 'Tic-Tac-Toe Classic';

    return {
        title: `${modeTitle}`,
        description: `Play ${modeTitle} offline against the computer. No sign-up required!`,
        keywords: ['Tic Tac Toe Offline', 'Play Tic Tac Toe', modeTitle, 'Tic Tac Toe Game'],
    };
};

const TicTacToeOfflineMode = ({ params }: { params: { mode: GameMode } }) => {
    return <TicTacToeBoard mode={params.mode} />;
};

export default TicTacToeOfflineMode;
