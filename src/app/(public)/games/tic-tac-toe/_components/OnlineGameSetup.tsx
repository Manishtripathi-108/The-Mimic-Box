'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

// Define Zod schemas
const joinRoomSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required').max(6, 'Room ID must not exceed 6 characters'),
    playerName: z.string().min(1, 'Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
});

const createRoomSchema = z.object({
    mode: z.enum(['classic', 'ultimate'], { required_error: 'Game Mode is required', message: 'Invalid Game Mode' }),
    playerName: z.string().min(1, 'Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
});

// Join Room Form Component
const JoinRoomForm = ({ roomId }: { roomId?: string }) => {
    const { joinRoom, state } = useTicTacToeContext();
    const { isFetching } = state;
    const { control, handleSubmit } = useForm({ resolver: zodResolver(joinRoomSchema), disabled: isFetching, defaultValues: { roomId: roomId } });

    const onSubmit = (data: z.infer<typeof joinRoomSchema>) => {
        if (isFetching) return;
        joinRoom(data.roomId, data.playerName);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input name="roomId" label="Room ID" type="text" placeholder="Room ID" control={control} disabled={isFetching} />
            <Input name="playerName" label="Player Name" type="text" placeholder="Enter your name" control={control} disabled={isFetching} />
            <Button type="submit" variant="highlight" className="mt-6 w-full" disabled={isFetching}>
                {isFetching ? 'Joining Room...' : 'Join Room'}
            </Button>
        </form>
    );
};

// Create Room Form Component
const CreateRoomForm = () => {
    const { state, createRoom } = useTicTacToeContext();
    const { isFetching } = state;

    const { control, handleSubmit } = useForm({ resolver: zodResolver(createRoomSchema), disabled: isFetching });

    const onSubmit = (data: z.infer<typeof createRoomSchema>) => {
        if (isFetching) return;
        createRoom(data.mode, data.playerName);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Select name="mode" label="Game Mode" options={createRoomSchema.shape.mode.options} control={control} disabled={isFetching} />
            <Input name="playerName" label="Player Name" type="text" placeholder="Enter your name" control={control} disabled={isFetching} />
            <Button type="submit" variant="highlight" className="mt-6 w-full" disabled={isFetching}>
                {isFetching ? 'Creating Room...' : 'Create Room'}
            </Button>
        </form>
    );
};

const OnlineGameSetup = () => {
    const searchParams = useSearchParams();
    const roomId = searchParams.get('roomId');
    const [isJoinForm, setIsJoinForm] = useState(true);

    return (
        <div className="h-calc-full-height flex items-center justify-center">
            <div className="from-secondary shadow-floating-sm to-tertiary relative max-h-full w-full max-w-md rounded-2xl bg-linear-150 from-15% to-85% p-8 md:p-10">
                <Icon icon="gamepadTurbo" className="mx-auto mb-4 h-12 w-12 text-red-500" />
                <h2 className="text-highlight font-aladin mb-3 text-center text-4xl font-bold tracking-widest">Play Online</h2>
                <h3 className="text-text-primary mb-5 text-center font-normal tracking-wider">Join a room or create a new one to start playing</h3>

                {/* Toggle Join/Create Form */}
                <div className="mb-5 flex justify-center gap-x-4">
                    <Button active={isJoinForm} onClick={() => setIsJoinForm(true)}>
                        Join a Room
                    </Button>
                    <Button active={!isJoinForm} onClick={() => setIsJoinForm(false)}>
                        Create a Room
                    </Button>
                </div>

                {isJoinForm ? <JoinRoomForm roomId={roomId || undefined} /> : <CreateRoomForm />}
            </div>{' '}
        </div>
    );
};

export default OnlineGameSetup;
