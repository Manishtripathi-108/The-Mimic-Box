'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import TicTacToeRules from '@/app/(public)/games/tic-tac-toe/_components/TicTacToeRules';
import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import FormField from '@/components/ui/form/FormField';
import Input from '@/components/ui/form/Input';
import Select from '@/components/ui/form/Select';

// Define Zod schemas
const joinRoomSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required').max(6, 'Room ID must not exceed 6 characters'),
    playerName: z.string().min(1, 'Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
});

const createRoomSchema = z.object({
    mode: z.enum(['classic', 'ultimate'], 'Game Mode is required'),
    playerName: z.string().min(1, 'Player Name is required').max(20, 'Player Name must not exceed 20 characters'),
});

// Join Room Form Component
const JoinRoomForm = ({ roomId }: { roomId?: string }) => {
    const { joinRoom, state } = useTicTacToeContext();
    const { isFetching } = state;
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ resolver: zodResolver(joinRoomSchema), disabled: isFetching, defaultValues: { roomId: roomId } });

    const onSubmit = (data: z.infer<typeof joinRoomSchema>) => {
        if (isFetching) return;
        joinRoom(data.roomId, data.playerName);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Room ID" error={errors.roomId?.message}>
                <Input placeholder="ie. 1y3x56" type="text" {...register('roomId')} required />
            </FormField>

            <FormField label="Player Name" error={errors.playerName?.message}>
                <Input placeholder="Enter your name" type="text" autoComplete="name" autoCapitalize="words" {...register('playerName')} required />
            </FormField>

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

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(createRoomSchema), disabled: isFetching });

    const onSubmit = (data: z.infer<typeof createRoomSchema>) => {
        if (isFetching) return;
        createRoom(data.mode, data.playerName);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Game Mode" error={errors.mode?.message}>
                <Select {...register('mode')} className="capitalize *:capitalize" disabled={isFetching} required>
                    {createRoomSchema.shape.mode.options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </Select>
            </FormField>

            <FormField label="Player Name" error={errors.playerName?.message}>
                <Input placeholder="Enter your name" type="text" autoComplete="name" autoCapitalize="words" {...register('playerName')} required />
            </FormField>

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
        <div className="min-h-calc-full-height flex flex-col items-center justify-center gap-6 px-4 py-8">
            <div className="shadow-floating-sm bg-gradient-secondary-to-tertiary relative w-full max-w-md rounded-2xl p-8 md:p-10">
                <Icon icon="game" className="text-danger mx-auto mb-4 h-12 w-12" />
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
            </div>

            <TicTacToeRules variant="online" />
        </div>
    );
};

export default OnlineGameSetup;
