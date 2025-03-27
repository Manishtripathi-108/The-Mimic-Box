'use client';

import { useState } from 'react';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ICON_SET from '@/constants/icons';
import { useTicTacToeContext } from '@/contexts/TicTacToe/TicTacToeContext';

// Define Zod schemas
const joinRoomSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required').max(6, 'Room ID must not exceed 6 characters'),
    playerName: z.string().min(1, 'Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
});

const createRoomSchema = z.object({
    roomName: z.string().min(1, 'Room Name is required').max(10, 'Room Name must not exceed 10 characters'),
    playerName: z.string().min(1, 'Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
});

// Join Room Form Component
const JoinRoomForm = () => {
    const { joinRoom, setLoading } = useTicTacToeContext();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(joinRoomSchema),
    });

    const onSubmit = (data: { roomId: string; playerName: string }) => {
        setLoading(true);
        joinRoom(data.roomId, data.playerName);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label className="form-text" htmlFor="roomId">
                    Enter Room ID
                </label>
                <input
                    id="roomId"
                    className="form-field"
                    type="text"
                    placeholder="Room ID"
                    maxLength={6}
                    autoComplete="off"
                    {...register('roomId')}
                />
                <ErrorMessage errors={errors} name="roomId" as="p" className="text-xs text-red-500" aria-live="polite" />
            </div>
            <div className="form-group">
                <label className="form-text" htmlFor="playerName">
                    Player Name
                </label>
                <input
                    id="playerName"
                    className="form-field"
                    type="text"
                    placeholder="Enter your name"
                    maxLength={20}
                    autoComplete="off"
                    {...register('playerName')}
                />
                <ErrorMessage errors={errors} name="playerName" as="p" className="text-xs text-red-500" aria-live="polite" />
            </div>
            <button type="submit" className="button button-highlight mt-6 w-full" disabled={isSubmitting}>
                Join Room
            </button>
        </form>
    );
};

// Create Room Form Component
const CreateRoomForm = () => {
    const { createRoom, setLoading } = useTicTacToeContext();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(createRoomSchema),
    });

    const onSubmit = (data: { roomName: string; playerName: string }) => {
        setLoading(true);
        createRoom(data.roomName, data.playerName);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label className="form-text" htmlFor="roomName">
                    Room Name
                </label>
                <input
                    id="roomName"
                    className="form-field"
                    type="text"
                    placeholder="Enter a room name"
                    maxLength={10}
                    autoComplete="off"
                    {...register('roomName')}
                />
                <ErrorMessage errors={errors} name="roomName" as="p" className="text-xs text-red-500" aria-live="polite" />
            </div>

            <div className="form-group">
                <label className="form-text" htmlFor="playerName">
                    Player Name
                </label>
                <input
                    id="playerName"
                    className="form-field"
                    type="text"
                    placeholder="Enter your name"
                    maxLength={20}
                    autoComplete="off"
                    {...register('playerName')}
                />
                <ErrorMessage errors={errors} name="playerName" as="p" className="text-xs text-red-500" aria-live="polite" />
            </div>

            <button type="submit" className="button button-highlight mt-6 w-full" disabled={isSubmitting}>
                Create Room
            </button>
        </form>
    );
};

const PlayOnline = () => {
    const [isJoinForm, setIsJoinForm] = useState(true);

    return (
        <div className="h-calc-full-height flex items-center justify-center">
            <div className="from-secondary shadow-floating-sm to-tertiary relative max-h-full w-full max-w-md rounded-2xl bg-linear-150 from-15% to-85% p-8 md:p-10">
                <Icon icon={ICON_SET.GAMEPAD_TURBO} className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <h2 className="text-highlight font-aladin mb-3 text-center text-4xl font-bold tracking-widest">Play Online</h2>
                <h3 className="text-text-primary mb-5 text-center font-normal tracking-wider">Join a room or create a new one to start playing</h3>

                {/* Toggle Join/Create Form */}
                <div className="mb-5 flex justify-center gap-x-4">
                    <button className={`button ${isJoinForm ? 'active' : ''}`} onClick={() => setIsJoinForm(true)}>
                        Join a Room
                    </button>
                    <button className={`button ${!isJoinForm ? 'active' : ''}`} onClick={() => setIsJoinForm(false)}>
                        Create a Room
                    </button>
                </div>

                {isJoinForm ? <JoinRoomForm /> : <CreateRoomForm />}
            </div>{' '}
        </div>
    );
};

export default PlayOnline;
