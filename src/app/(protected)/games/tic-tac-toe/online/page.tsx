import { Metadata } from 'next';

import PlayOnlineForm from '@/app/(protected)/games/tic-tac-toe/_components/PlayOnlineForm';

export const metadata: Metadata = {
    title: 'Tic Tac Toe Online | The Mimic Box',
    description: 'Play Tic Tac Toe with friends online.',
};

const TicTacToeOnline = () => {
    return <PlayOnlineForm />;
};

export default TicTacToeOnline;
