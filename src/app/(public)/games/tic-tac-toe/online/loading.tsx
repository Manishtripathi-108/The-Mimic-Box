const RoomSkeleton = () => {
    return (
        <div className="h-calc-full-height grid w-full place-items-center">
            <div className="from-secondary shadow-floating-sm to-tertiary relative max-h-full w-full max-w-md space-y-4 rounded-2xl bg-linear-150 from-15% to-85% p-8 md:p-10">
                <div className="bg-primary mx-auto h-12 w-12 rounded-full" />
                <div className="bg-primary mx-auto h-10 w-3/4 rounded-lg" />
                <div className="bg-primary mx-auto h-4 w-1/2 rounded-lg" />

                <div className="flex justify-center gap-4">
                    <div className="bg-primary h-10 w-28 rounded-lg" />
                    <div className="bg-primary h-10 w-28 rounded-lg" />
                </div>

                <div className="bg-primary h-10 rounded-lg" />
                <div className="bg-primary h-10 rounded-lg" />
                <div className="bg-primary h-12 rounded-lg" />
            </div>
        </div>
    );
};

export default RoomSkeleton;
