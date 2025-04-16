import React, { memo } from 'react';

import cn from '@/lib/utils/cn';

const ProgressBar = ({ percentage = 0, className }: { percentage?: number; className?: string }) => {
    return (
        <div className={cn('bg-primary shadow-neumorphic-inset-xs relative flex h-5 w-full items-center rounded-full border p-1', className)}>
            <span
                style={{
                    width: `${Math.min(percentage, 100)}%`,
                    transition: 'width 0.3s ease-in-out',
                }}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
                aria-label={`${percentage}% progress`}
                className="from-accent/70 to-accent after:animate-progress-after relative inline-block h-full overflow-hidden rounded-full border border-inherit bg-linear-to-t bg-cover align-middle after:absolute after:inset-0 after:bg-[linear-gradient(_45deg,#ffffff_25%,rgba(0,0,0,0)_25%,rgba(0,0,0,0)_50%,#ffffff_50%,#ffffff_75%,rgba(0,0,0,0)_75%,rgba(0,0,0,0)_)] after:bg-[length:30px_30px] after:opacity-30"></span>
        </div>
    );
};

export default memo(ProgressBar);
