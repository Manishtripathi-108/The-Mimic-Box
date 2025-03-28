'use client';

import React, { useEffect, useRef } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import Cell from '@/app/(public)/games/tic-tac-toe/_components/Cell';
import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import { GameMode } from '@/app/(public)/games/tic-tac-toe/_lib/tic-tac-toe.types';

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
                makeMove(macro !== undefined ? macro : index, macro !== undefined ? index : undefined);
            }
        };

        const board = boardRef.current;
        board?.addEventListener('click', handleClick);

        return () => board?.removeEventListener('click', handleClick);
    }, [makeMove]);

    if (mode === 'classic') {
        return (
            <div
                ref={boardRef}
                className="animate-zoom-in shadow-floating-md from-secondary to-tertiary relative z-0 w-fit rounded-xl border bg-linear-150 from-15% to-85% p-2">
                <div className="shadow-pressed-sm rounded-lg border p-3">
                    <div tabIndex={0} className="grid grid-cols-3 gap-3 outline-hidden">
                        {classicBoardState.map((cell, index) => (
                            <Cell key={index} classic value={cell} isWinningSquare={winningIndexes?.includes(index)} data-index={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={boardRef}
            className="animate-zoom-in from-secondary to-tertiary shadow-floating-md relative z-0 grid w-fit grid-cols-3 gap-2 rounded-xl border bg-linear-150 from-15% to-85% p-2 outline-hidden">
            {ultimateBoardState.map((macroBoard, macroIndex) => (
                <div
                    key={macroIndex}
                    className={`shadow-pressed-xs relative grid grid-cols-3 gap-2 rounded-md p-2 ${
                        macroIndex === activeCellIndex ? 'bg-highlight' : ''
                    }`}>
                    {macroBoard.map((cell, cellIndex) => (
                        <Cell
                            key={`${macroIndex}-${cellIndex}`}
                            value={cell}
                            isActive={macroIndex === activeCellIndex}
                            data-index={cellIndex}
                            data-macro={macroIndex}
                        />
                    ))}
                    <AnimatePresence>
                        {classicBoardState[macroIndex] && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={winningIndexes?.includes(macroIndex) ? { scale: 1 } : { scale: 1 }}
                                exit={{ scale: 0 }}
                                className="bg-primary shadow-pressed-sm absolute inset-0 z-10 flex items-center justify-center rounded-md p-5">
                                <motion.span
                                    className={`${winningIndexes?.includes(macroIndex) ? 'text-accent' : 'text-text-secondary'} text-7xl select-none md:text-9xl`}>
                                    {classicBoardState[macroIndex]}
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
};

export default TicTacToeBoard;
