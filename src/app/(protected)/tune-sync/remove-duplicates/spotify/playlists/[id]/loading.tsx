import AnimatedCircularProgressBar from '@/components/ui/AnimatedCircularProgressBar';

const Loading = () => {
    return (
        <main className="min-h-calc-full-height p-6">
            <h1 className="text-highlight font-alegreya mb-6 text-center text-3xl font-bold sm:text-4xl">Duplicate Tracks</h1>

            <div className="flex flex-col items-center justify-center">
                <AnimatedCircularProgressBar />
                <p className="text-text-primary mt-4 animate-pulse text-lg">Loading Playlist from Spotify...</p>
            </div>
        </main>
    );
};

export default Loading;
