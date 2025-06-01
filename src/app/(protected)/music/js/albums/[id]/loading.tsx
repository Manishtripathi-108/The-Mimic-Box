import { MusicActionBtnsSkeleton } from '@/app/(protected)/music/_components/MusicActionBtns';
import { MusicMediaHeaderSkeleton } from '@/app/(protected)/music/_components/MusicMediaHeader';
import MusicTrackCardSkeleton from '@/app/(protected)/music/_components/skeletons/MusicTrackCardSkeleton';

const Loading = () => {
    return (
        <>
            <MusicMediaHeaderSkeleton />
            <MusicActionBtnsSkeleton />

            <div className="mt-6 grid w-full gap-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <MusicTrackCardSkeleton key={idx} />
                ))}
            </div>
        </>
    );
};

export default Loading;
