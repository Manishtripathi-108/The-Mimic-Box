import { MusicActionBtnsSkeleton } from '@/app/(protected)/spotify/_components/MusicActionBtns';
import { MusicMediaHeaderSkeleton } from '@/app/(protected)/spotify/_components/MusicMediaHeader';
import { MusicTrackCardSkeleton } from '@/app/(protected)/spotify/_components/MusicTrackCard';

const Loading = () => {
    return (
        <div className="min-h-calc-full-height">
            <MusicMediaHeaderSkeleton />
            <MusicActionBtnsSkeleton className="mt-4" />

            {/* Songs List */}
            <div className="mt-6 grid w-full gap-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <MusicTrackCardSkeleton key={idx} />
                ))}
            </div>
        </div>
    );
};

export default Loading;
