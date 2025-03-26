import React from 'react';

import { PlayerData } from '@/lib/types/tic-tac-toe.types';

const ScoreBoard = ({ playerX, playerO, drawScore }: { playerX: PlayerData; playerO: PlayerData; drawScore: number }) => {
    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-5 px-4 tracking-wider">
            <div className="text-highlight shadow-pressed-sm order-1 w-36 rounded-lg p-4 text-center sm:w-60">
                <h3 className="shadow-floating-xs mb-2 rounded-lg p-3 font-bold">
                    <span className="line-clamp-1">{playerX.name}</span> (X)
                </h3>
                <div className="text-text-primary shadow-floating-xs rounded-lg text-2xl">{playerX.score}</div>
            </div>
            <div className="text-highlight shadow-pressed-sm order-3 w-36 rounded-lg p-4 text-center sm:order-2 sm:w-60">
                <h3 className="shadow-floating-xs mb-2 rounded-lg p-3 font-bold">Draws</h3>
                <div className="text-text-primary shadow-floating-xs rounded-lg text-2xl">{drawScore}</div>
            </div>
            <div className="text-highlight shadow-pressed-sm order-2 w-36 rounded-lg p-4 text-center sm:order-3 sm:w-60">
                <h3 className="shadow-floating-xs mb-2 rounded-lg p-3 font-bold">
                    <span className="line-clamp-1">{playerO.name}</span> (O)
                </h3>
                <div className="text-text-primary shadow-floating-xs rounded-lg text-2xl">{playerO.score}</div>
            </div>
        </div>
    );
};

export default React.memo(ScoreBoard);
