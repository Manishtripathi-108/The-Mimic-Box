import React from 'react';

import Link from 'next/link';

import { APP_ROUTES } from '@/constants/routes.constants';

const TicTacToeHeader = ({ title, playingOnline }: { title: string; playingOnline: boolean }) => {
    return (
        <div className={`grid border-b py-3 md:grid-cols-2 ${playingOnline ? 'grid-cols-2' : 'grid-cols-4'}`}>
            <h1 className="text-text-primary flex items-center justify-center text-center text-lg font-bold tracking-wider capitalize md:text-2xl">
                {title}
            </h1>
            <div className={`flex flex-wrap items-center justify-center gap-3 md:col-span-1 ${playingOnline ? '' : 'col-span-3'}`}>
                <Link href={APP_ROUTES.GAMES_TIC_TAC_TOE_CLASSIC} className="button">
                    Classic
                </Link>
                <Link href={APP_ROUTES.GAMES_TIC_TAC_TOE_ULTIMATE} className="button">
                    Ultimate
                </Link>
                {!playingOnline && (
                    <Link href={APP_ROUTES.GAMES_TIC_TAC_TOE_ONLINE} className="button">
                        Play Online
                    </Link>
                )}
            </div>
        </div>
    );
};

export default React.memo(TicTacToeHeader);
