'use client';

import { motion } from 'motion/react';
import toast from 'react-hot-toast';

import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';

const WaitingRoom = () => {
    const { state, startMatch, leaveRoom } = useTicTacToeContext();
    const { playerXData, playerOData, gameRoomName, gameRoomId } = state;

    // Share room code
    const shareRoom = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: `Join my Tic Tac Toe game: ${gameRoomName}`,
                    text: `Use this room Id to join: ${gameRoomId}`,
                    url: `${APP_ROUTES.GAMES.TIC_TAC_TOE.ONLINE}?roomId=${gameRoomId}`,
                })
                .catch(() => {
                    toast('Error sharing room code. Please try again.');
                });
        } else {
            toast('Sharing is not supported on your device. Please copy the code.');
        }
    };

    // Reusable Player Block Component
    const PlayerBlock = ({ playerName, Symbol }: { playerName: string; Symbol: string }) => (
        <div className="shadow-pressed-md from-secondary to-tertiary w-full max-w-sm shrink-0 rounded-2xl border bg-linear-150 from-15% to-85% p-3 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                // transition={{ type: 'spring', stiffness: 100 }}
                className="shadow-floating-md from-secondary to-tertiary rounded-xl bg-linear-150 from-15% to-85% p-6">
                <div
                    className={`shadow-pressed-md mx-auto flex size-20 items-center justify-center rounded-full border border-inherit p-4 text-6xl md:size-44 md:text-8xl ${
                        playerName ? 'text-highlight' : 'text-text-secondary animate-blob'
                    }`}>
                    {Symbol}
                </div>
                <div className="shadow-pressed-xs mt-4 rounded-md border border-inherit p-2">{playerName || `Waiting for ${Symbol}...`}</div>
            </motion.div>
        </div>
    );

    return (
        <motion.div
            key="waiting-room"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-primary text-text-primary min-h-calc-full-height flex flex-col items-center justify-center p-4">
            {/* Room Details */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8 text-center">
                <h2 className="text-accent text-2xl font-semibold md:text-4xl">{`Room: ${gameRoomName}`}</h2>
                <div className="mt-2 flex items-center justify-center gap-x-4">
                    <p
                        className="hover:text-highlight text-text-secondary cursor-pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(gameRoomId!);
                            toast.success('Room code copied to clipboard!');
                        }}
                        title="Click to copy"
                        aria-label={`Room code ${gameRoomId}`}>
                        {`Code: ${gameRoomId}`}
                    </p>
                    <button
                        onClick={shareRoom}
                        className="button button-sm shrink-0 rounded-full p-2"
                        title="Share Room Code"
                        aria-label="Share Room Code">
                        <Icon icon="share" className="size-5" />
                    </button>
                </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-accent mb-8 text-xl font-bold capitalize">
                {!(playerXData.id && playerOData.id) ? 'Waiting for another player to join...' : 'Ready to Start!'}
            </motion.h1>

            {/* Players Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex w-full flex-col items-center justify-center gap-8 md:flex-row">
                <PlayerBlock playerName={playerXData.name} Symbol="X" />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-highlight text-3xl font-bold">
                    VS
                </motion.div>
                <PlayerBlock playerName={playerOData.name} Symbol="O" />
            </motion.div>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                className="mt-10 flex w-full items-center justify-center gap-4"
                title="Start Game">
                <button
                    onClick={() => startMatch()}
                    disabled={!(playerXData.id && playerOData.id)}
                    className={`button button-highlight disabled:${!(playerXData.id && playerOData.id) ? 'cursor-not-allowed' : ''}`}>
                    Start Game
                </button>
                <button onClick={() => leaveRoom()} className="button button-danger" title="Exit Room">
                    Leave Room
                </button>
            </motion.div>
        </motion.div>
    );
};

export default WaitingRoom;
