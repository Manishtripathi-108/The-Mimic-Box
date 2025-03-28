'use client';

import React, { useEffect, useRef } from 'react';

import { motion } from 'motion/react';

import { useTicTacToeContext } from '@/contexts/TicTacToe/TicTacToeContext';

const MatchResultModal = ({ status }: { status: string }) => {
    const playRef = useRef<HTMLButtonElement>(null);
    const { resetBoard } = useTicTacToeContext();
    useEffect(() => playRef.current?.focus(), []);

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            role="dialog"
            aria-label={status}
            aria-live="assertive"
            className="before:bg-primary/75 text-text-primary absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-xl border text-center tracking-widest before:absolute before:inset-0 before:-z-10 before:size-full before:backdrop-blur-xs before:backdrop-saturate-150">
            <h2 className="text-accent text-4xl font-bold capitalize md:text-5xl">{status}</h2>
            <p className="text-text-primary mt-10 mb-3 text-lg">Would you like to play again?</p>

            <div className="flex justify-center gap-x-5">
                <button className="button" ref={playRef} onClick={resetBoard} tabIndex={0}>
                    Play Again
                </button>
                <button className="button button-danger" onClick={() => alert('Thanks for playing!')} tabIndex={1}>
                    Exit
                </button>
            </div>
        </motion.div>
    );
};

export default MatchResultModal;
