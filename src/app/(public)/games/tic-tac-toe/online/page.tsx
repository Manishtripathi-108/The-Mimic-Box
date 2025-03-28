import { Metadata } from 'next';

import OnlineGameSetupForm from '@/app/(public)/games/tic-tac-toe/_components/OnlineGameSetup';

export const metadata: Metadata = {
    title: 'Tic-Tac-Toe Online Multiplayer | The Mimic Box',
    description: 'Challenge your friends or other players to an online Tic-Tac-Toe match. No sign-up required!',
    keywords: ['Tic Tac Toe Online', 'Multiplayer Tic Tac Toe', 'Play Tic Tac Toe with Friends', 'Tic Tac Toe Game'],
};

const TicTacToeOnline = () => {
    return <OnlineGameSetupForm />;
};

export default TicTacToeOnline;
