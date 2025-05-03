import { HorizontalScrollSectionSkeleton } from '@/components/ui/HorizontalScrollSection';

const Loading = () => {
    return (
        <HorizontalScrollSectionSkeleton>
            {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="w-40 flex-shrink-0">
                    <div className="bg-secondary aspect-square w-full animate-pulse rounded-lg" />
                    <div className="bg-secondary mt-2 h-4 w-24 animate-pulse rounded" />
                </div>
            ))}
        </HorizontalScrollSectionSkeleton>
    );
};

export default Loading;
