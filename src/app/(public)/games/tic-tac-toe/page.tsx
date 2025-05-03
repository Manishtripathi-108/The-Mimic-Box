import { Metadata } from 'next';

import Link from 'next/link';

import Icon from '@/components/ui/Icon';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Tic-Tac-Toe | Choose Your Game Mode - The Mimic Box',
    description: 'Select your preferred Tic-Tac-Toe mode: Classic, Ultimate, or Online Multiplayer. Enjoy competitive gameplay!',
    keywords: ['Tic Tac Toe Classic', 'Ultimate Tic Tac Toe', 'Multiplayer Tic Tac Toe', 'Local Tic Tac Toe'],
};

const Page = () => {
    return (
        <main className="h-calc-full-height bg-primary flex flex-col items-center justify-center p-6">
            <div className="shadow-floating-sm from-secondary to-tertiary text-text-primary w-full max-w-lg rounded-2xl border bg-linear-150 from-15% to-85% p-6">
                {/* Header */}
                <h1 className="text-highlight font-alegreya mb-6 flex items-center justify-center gap-3 text-3xl font-medium tracking-wide">
                    <Icon icon="gamepad" className="size-8" /> Select Your Game Mode
                </h1>

                {/* Mode Selection */}
                <div className="mb-6">
                    <h2 className="font-alegreya mb-3 text-lg font-medium tracking-wide">Choose a Mode:</h2>
                    <div className="flex justify-center gap-6">
                        <Link href={APP_ROUTES.GAMES_TIC_TAC_TOE_CLASSIC} className="button w-full text-center">
                            Classic
                        </Link>
                        <Link href={APP_ROUTES.GAMES_TIC_TAC_TOE_ULTIMATE} className="button w-full text-center">
                            Ultimate
                        </Link>
                    </div>
                </div>

                {/* Horizontal OR Separator */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t"></div>
                    <span className="text-text-secondary px-4 text-sm">or</span>
                    <div className="flex-grow border-t"></div>
                </div>

                {/* Play Online Section */}
                <Link href={APP_ROUTES.GAMES_TIC_TAC_TOE_ONLINE} className="button w-full text-center">
                    Play Online
                </Link>
            </div>
        </main>
    );
};

export default Page;
