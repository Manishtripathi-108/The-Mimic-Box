import { Metadata } from 'next';

import OnlineGameLobby from '@/app/(public)/games/tic-tac-toe/_components/OnlineGameLobby';
import { GameMode } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';

export const dynamicParams = false;

export const generateStaticParams = async () => {
    return [{ mode: 'classic' }, { mode: 'ultimate' }, { mode: 'waiting-room' }];
};

export const generateMetadata = async ({ params }: { params: Promise<{ mode: GameMode | 'waiting-room' }> }): Promise<Metadata> => {
    const { mode } = await params;
    const modeTitle = mode === 'ultimate' ? 'Tic-Tac-Toe Ultimate' : 'Tic-Tac-Toe Classic';

    return {
        title: `${modeTitle}`,
        description: `Play ${modeTitle} offline against the computer. No sign-up required!`,
        keywords: ['Tic Tac Toe Offline', 'Play Tic Tac Toe', modeTitle, 'Tic Tac Toe Game'],
    };
};

const TicTacToeOnlineWrapper = async ({ params }: { params: Promise<{ mode: GameMode | 'waiting-room' }> }) => {
    const { mode } = await params;
    return <OnlineGameLobby mode={mode} />;
};

export default TicTacToeOnlineWrapper;
