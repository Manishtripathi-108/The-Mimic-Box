import { Icon } from '@iconify/react';

import ICON_SET from '@/constants/icons';

const ErrorCard = ({ message, reset }: { message: string; reset?: () => void }) => {
    return (
        <div className="bg-primary h-calc-full-height grid place-items-center rounded-lg p-6 text-center">
            <div className="to-tertiary shadow-floating-xs from-secondary flex max-w-md min-w-sm flex-col items-center justify-start rounded-2xl bg-linear-150 p-4">
                <div className="flex w-full items-start justify-end gap-1.5">
                    <div className="size-2 rounded-full bg-white hover:bg-gray-200"></div>
                    <div className="size-2 rounded-full bg-white opacity-50"></div>
                </div>

                <Icon icon={ICON_SET.ERROR} className="size-28" />

                <div className="mb-6 w-full text-center">
                    <h1 className="font-bold tracking-wider text-red-500">Error!</h1>
                    <p className="text-sm tracking-wide text-gray-500">{message || 'Oh no, something went wrong.'}</p>
                </div>

                {reset && (
                    <button onClick={() => reset()} className="button">
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorCard;
