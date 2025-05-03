import { ReactNode } from 'react';

import { TicTacToeProvider } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';

const Layout = ({ children }: { children: ReactNode }) => {
    return <TicTacToeProvider>{children}</TicTacToeProvider>;
};

export default Layout;
