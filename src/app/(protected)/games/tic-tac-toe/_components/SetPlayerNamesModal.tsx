'use client';

import React from 'react';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Modal, { closeModal } from '@/components/Modals';
import { useTicTacToeContext } from '@/contexts/TicTacToe/TicTacToeContext';

// ✅ Define Zod schema for validation
const playerSchema = z
    .object({
        playerX: z
            .string()
            .min(1, 'Player names cannot be empty!')
            .max(30, 'Player names cannot exceed 30 characters.')
            .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces allowed'),
        playerO: z
            .string()
            .min(1, 'Player names cannot be empty!')
            .max(30, 'Player names cannot exceed 30 characters.')
            .regex(/^[a-zA-Z0-9 ]+$/, 'Only letters, numbers, and spaces allowed'),
    })
    .refine((data) => data.playerX !== data.playerO, {
        message: 'Player names must be different.',
        path: ['playerO'],
    });

// ✅ Define TypeScript type based on Zod schema
type PlayerFormValues = z.infer<typeof playerSchema>;

const SetPlayerNamesModal = () => {
    const { state, setPlayers } = useTicTacToeContext();
    const { playerXData, playerOData } = state;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
    } = useForm<PlayerFormValues>({
        resolver: zodResolver(playerSchema),
        defaultValues: {
            playerX: playerXData.name || '',
            playerO: playerOData.name || '',
        },
    });

    // ✅ Handle Form Submission
    const onSubmit = (data: PlayerFormValues) => {
        setPlayers('X', data.playerX);
        setPlayers('O', data.playerO);
        closeModal('SetPlayerNamesModal');
    };

    return (
        <Modal modalId="SetPlayerNamesModal" showCloseButton={false} className="w-full max-w-96">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <h2 className="text-highlight font-alegreya mb-4 text-center text-xl font-bold tracking-wide">Set Player Names</h2>

                {/* Player X Input */}
                <div className="form-group">
                    <label htmlFor="playerXInput" className="form-text">
                        Player X
                    </label>
                    <div className="form-field-wrapper">
                        <span className="form-icon flex items-center justify-center text-center text-2xl">X</span>
                        <input
                            id="playerXInput"
                            className="form-field"
                            type="text"
                            placeholder="Player 1 Name"
                            data-invalid={!!errors.playerX}
                            {...register('playerX')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    setFocus('playerO');
                                }
                            }}
                        />
                    </div>
                    <ErrorMessage errors={errors} name="playerX" as="p" className="text-xs text-red-500" aria-live="polite" />
                </div>

                {/* Player O Input */}
                <div className="form-group">
                    <label htmlFor="playerOInput" className="form-text">
                        Player O
                    </label>
                    <div className="form-field-wrapper">
                        <span className="form-icon flex items-center justify-center text-center text-2xl">O</span>
                        <input
                            id="playerOInput"
                            className="form-field"
                            type="text"
                            data-invalid={!!errors.playerO}
                            placeholder="Player 2 Name"
                            {...register('playerO')}
                        />
                    </div>
                    <ErrorMessage errors={errors} name="playerO" as="p" className="text-xs text-red-500" aria-live="polite" />
                </div>

                {/* Submit Button */}
                <button id="submitBtn" type="submit" className="button button-highlight mt-6 w-full">
                    <span className="text-sm font-semibold">Save</span>
                </button>
            </form>
        </Modal>
    );
};

export default SetPlayerNamesModal;
