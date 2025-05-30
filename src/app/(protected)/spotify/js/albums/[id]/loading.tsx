import { MusicActionBtnsSkeleton } from '@/app/(protected)/spotify/_components/MusicActionBtns';
import { MusicMediaHeaderSkeleton } from '@/app/(protected)/spotify/_components/MusicMediaHeader';
import MusicTrackCardSkeleton from '@/app/(protected)/spotify/_components/skeletons/MusicTrackCardSkeleton';

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
