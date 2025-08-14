'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import stringSimilarity from 'string-similarity';
import z from 'zod';

import { Button } from '@/components/ui/Button';
import CardContainer from '@/components/ui/CardContainer';
import Input from '@/components/ui/Input';

const validateStrings = z.object({
    string1: z.string().min(1, 'String 1 is required'),
    string2: z.string().min(1, 'String 2 is required'),
});

const Page = () => {
    const { handleSubmit, control } = useForm<{ string1: string; string2: string }>({
        defaultValues: { string1: '', string2: '' },
        resolver: zodResolver(validateStrings),
    });
    const [score, setScore] = useState<number | null>(null);

    const onSubmit = (data: { string1: string; string2: string }) => {
        const similarity = stringSimilarity.compareTwoStrings(data.string1, data.string2);
        setScore(similarity);
    };

    return (
        <main className="min-h-calc-full-height flex w-full flex-col items-center justify-center p-2 sm:p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Find String Similar Score</h1>
            <CardContainer className="w-full max-w-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full flex-col gap-2">
                    <Input name="string1" label="String 1" type="text" placeholder="String 1" control={control} />
                    <Input name="string2" label="String 2" type="text" placeholder="String 2" control={control} />

                    <Button variant="highlight" type="submit" className="mt-4">
                        Compare
                    </Button>
                </form>
                {score !== null && (
                    <div className="mt-6 text-center">
                        <span className="text-lg font-bold">Similarity Score: </span>
                        <span className="text-highlight font-mono text-xl">{(score * 100).toFixed(2)}%</span>
                    </div>
                )}
            </CardContainer>
        </main>
    );
};

export default Page;
