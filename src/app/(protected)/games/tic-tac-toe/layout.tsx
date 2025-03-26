import React from 'react';

import { TicTacToeProvider } from '@/contexts/TicTacToe/TicTacToeContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <TicTacToeProvider>{children}</TicTacToeProvider>;
};

export default Layout;
