'use client';

import React, { useEffect, useRef } from 'react';

import Cell from '@/app/(public)/games/tic-tac-toe/_components/Cell';
import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import { GameMode } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';
import Icon from '@/components/ui/Icon';
import cn from '@/lib/utils/cn';

const TicTacToeBoard = ({ mode }: { mode: GameMode }) => {
    const { state, makeMove, setMode } = useTicTacToeContext();
    const { classicBoardState, ultimateBoardState, activeCellIndex, winningIndexes } = state;
    const boardRef = useRef<HTMLDivElement>(null);

    // Set game mode on mount
    useEffect(() => setMode(mode), [mode, setMode]);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const cellIndex = target.dataset.index;
            const macroIndex = target.dataset.macro;

            if (cellIndex !== undefined) {
                const index = parseInt(cellIndex, 10);
                const macro = macroIndex ? parseInt(macroIndex, 10) : undefined;
                makeMove(macro ?? index, macro !== undefined ? index : undefined);
            }
        };

        const board = boardRef.current;
        board?.addEventListener('click', handleClick);

        return () => board?.removeEventListener('click', handleClick);
    }, [makeMove]);

    return (
        <div
            ref={boardRef}
            className={`animate-zoom-in shadow-floating-md from-secondary to-tertiary relative aspect-square ${mode === 'classic' ? 'max-w-md' : 'grid max-w-xl grid-cols-3 gap-2'} w-[min(90vw,90vh)] rounded-xl border bg-linear-150 p-2`}>
            {mode === 'classic' ? (
                <div className="shadow-pressed-sm rounded-lg border p-3">
                    <div tabIndex={0} className="grid grid-cols-3 gap-3 outline-hidden">
                        {classicBoardState.map((cell, index) => (
                            <Cell key={index} value={cell} isWinningSquare={winningIndexes?.includes(index)} data-index={index} />
                        ))}
                    </div>
                </div>
            ) : (
                ultimateBoardState.map((macroBoard, macroIndex) => (
                    <div
                        key={macroIndex}
                        className={cn('shadow-pressed-xs size-full rounded-md p-1 sm:p-2', {
                            'bg-highlight': macroIndex === activeCellIndex,
                            'text-accent': winningIndexes?.includes(macroIndex),
                            'text-text-primary': !winningIndexes?.includes(macroIndex),
                            'grid grid-cols-3 gap-1 sm:gap-2': !classicBoardState[macroIndex],
                        })}>
                        {classicBoardState[macroIndex] ? (
                            <Icon
                                key={macroIndex}
                                icon={classicBoardState[macroIndex] === 'D' ? 'draw' : classicBoardState[macroIndex] === 'X' ? 'close' : 'circle'}
                                className="animate-zoom-in size-full rounded-md p-5 transition-transform duration-300 ease-in-out select-none"
                            />
                        ) : (
                            macroBoard.map((cell, cellIndex) => (
                                <Cell
                                    key={`${macroIndex}-${cellIndex}`}
                                    value={cell}
                                    isActive={macroIndex === activeCellIndex}
                                    data-index={cellIndex}
                                    data-macro={macroIndex}
                                />
                            ))
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default TicTacToeBoard;
