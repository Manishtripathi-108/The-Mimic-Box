'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTicTacToeContext } from '@/app/(public)/games/tic-tac-toe/_lib/TicTacToeContext';
import { Button } from '@/components/ui/Button';
import Modal, { closeModal } from '@/components/ui/Modals';
import FormField from '@/components/ui/form/FormField';
import Input from '@/components/ui/form/Input';

const playerNameSchema = z
    .string()
    .min(1, 'Player names cannot be empty!')
    .max(30, 'Player names cannot exceed 30 characters.')
    .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces allowed')
    .transform((val) => val.trim());

const playerFormSchema = z.object({ playerX: playerNameSchema, playerO: playerNameSchema }).refine((data) => data.playerX !== data.playerO, {
    message: 'Player names must be different.',
    path: ['playerO'],
});

type PlayerFormValues = z.infer<typeof playerFormSchema>;

const SetPlayerNamesModal = () => {
    const { state, setPlayers } = useTicTacToeContext();
    const { playerXData, playerOData } = state;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<PlayerFormValues>({
        resolver: zodResolver(playerFormSchema),
        defaultValues: {
            playerX: playerXData.name || '',
            playerO: playerOData.name || '',
        },
    });

    const onSubmit = (data: PlayerFormValues) => {
        setPlayers('X', data.playerX);
        setPlayers('O', data.playerO);
        closeModal('SetPlayerNamesModal');
    };

    return (
        <Modal modalId="SetPlayerNamesModal" showCloseButton={isValid} shouldClose={isValid} className="w-full max-w-96 sm:p-2">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <h2 className="text-highlight font-alegreya mb-4 text-center text-xl font-bold tracking-wide">Set Player Names</h2>

                <FormField label="Player X" error={errors.playerX?.message}>
                    <Input placeholder="Player X Name" type="text" autoComplete="name" autoCapitalize="words" {...register('playerX')} required />
                </FormField>

                <FormField label="Player O" error={errors.playerO?.message}>
                    <Input placeholder="Player O Name" type="text" autoComplete="name" autoCapitalize="words" {...register('playerO')} required />
                </FormField>

                <Button id="submitBtn" type="submit" variant="highlight" className="mt-6 w-full">
                    <span className="text-sm font-semibold">Save</span>
                </Button>
            </form>
        </Modal>
    );
};

export default SetPlayerNamesModal;
