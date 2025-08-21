const Loading = () => {
    return (
        <div className="h-calc-full-height grid w-full place-items-center">
            <div className="shadow-floating-sm bg-gradient-secondary-to-tertiary relative max-h-full w-full max-w-md space-y-4 rounded-2xl p-8 md:p-10">
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

export default Loading;
