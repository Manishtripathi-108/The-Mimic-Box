'use client';

import React, { useEffect } from 'react';

import { AnimatePresence, motion } from 'motion/react';

import Cell from '@/app/(protected)/games/tic-tac-toe/_components/Cell';
import { useTicTacToeContext } from '@/contexts/TicTacToe/TicTacToeContext';

const TicTacToeBoard = ({ mode }: { mode: 'classic' | 'ultimate' }) => {
    const { state, makeMove, setMode } = useTicTacToeContext();
    const { classicBoardState, ultimateBoardState, activeCellIndex, winningIndexes } = state;

    useEffect(() => setMode(mode), [mode]);

    if (mode === 'classic') {
        return (
            <div className="animate-zoom-in shadow-floating-md from-secondary to-tertiary relative z-0 w-fit rounded-xl border bg-linear-150 from-15% to-85% p-2">
                <div className="shadow-pressed-sm rounded-lg border p-3">
                    <div tabIndex={0} className="grid grid-cols-3 gap-3 outline-hidden">
                        {classicBoardState.map((cell, index) => (
                            <Cell
                                key={index}
                                classic={true}
                                value={cell}
                                onClick={() => makeMove(index)}
                                isWinningSquare={winningIndexes?.includes(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            tabIndex={0}
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
                            onClick={() => makeMove(macroIndex, cellIndex)}
                            isActive={macroIndex === activeCellIndex}
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
                                    className={`${winningIndexes?.includes(macroIndex) ? 'text-accent' : 'text-text-secondary'} font-julee text-7xl select-none md:text-9xl`}>
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
