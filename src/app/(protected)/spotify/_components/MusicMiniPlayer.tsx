'use client';

import Image from 'next/image';

import Icon from '@/components/ui/Icon';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
import { formatTimeDuration } from '@/lib/utils/core.utils';

const MusicMiniPlayer = () => {
    const {
        loading,
        playing,
        current,
        previous,
        togglePlay,
        queue,
        next,
        isShuffled,
        toggleShuffle,
        loopMode,
        toggleLoop,
        setVolume,
        seek,
        setQueue,
        addToQueue,
        currentTime,
        duration,
        toggleMute,
        volume,
    } = useAudioPlayerContext();

    if (!current) {
        return null;
    }

    return (
        <footer className="@container fixed bottom-2 left-1/2 z-50 w-full -translate-x-1/2">
            <section className="from-secondary to-tertiary text-text-secondary shadow-floating-sm grid grid-cols-2 items-center justify-between rounded-full bg-linear-150 from-15% to-85% px-2 py-2 @sm:mx-2 @md:grid-cols-3 @md:px-4 @xl:grid-cols-5">
                {/* Track Info */}
                <div className="flex items-center gap-3 justify-self-start">
                    <Image
                        src={current?.covers?.[0].url || IMAGE_FALLBACKS.AUDIO_COVER}
                        alt={current?.title || 'Album Art'}
                        width={40}
                        height={40}
                        className="size-10 rounded-full border object-cover @md:rounded-xl"
                    />
                    <div>
                        <h3 className="text-text-primary line-clamp-1 text-base font-semibold">{current?.title || 'Unknown Title'}</h3>
                        <p className="line-clamp-1 text-xs">{current?.artists}</p>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="flex w-full max-w-xl flex-col items-center gap-1 justify-self-center @md:col-span-2 @xl:col-span-3">
                    <div className="flex items-center justify-center gap-5">
                        <button
                            type="button"
                            aria-label="Shuffle"
                            title="Shuffle"
                            onClick={toggleShuffle}
                            className={`hidden cursor-pointer rounded-full p-1 @sm:inline ${isShuffled ? 'text-highlight' : 'hover:text-text-primary'}`}>
                            <Icon icon="shuffle" className="size-5" />
                        </button>

                        <button
                            onClick={previous}
                            type="button"
                            aria-label="Previous"
                            title="Previous"
                            className="hover:text-text-primary cursor-pointer rounded-full p-1">
                            <Icon icon="previous" className="size-4" />
                        </button>

                        <button
                            type="button"
                            onClick={togglePlay}
                            aria-label={playing ? 'Pause' : 'Play'}
                            className="button button-highlight flex size-8 items-center justify-center rounded-full p-1.5">
                            <Icon icon={loading ? 'loading' : playing ? 'pauseToPlay' : 'playToPause'} className="size-full" />
                        </button>

                        <button
                            type="button"
                            onClick={next}
                            aria-label="Next"
                            title="Next"
                            className="hover:text-text-primary cursor-pointer rounded-full p-1">
                            <Icon icon="next" className="size-4" />
                        </button>

                        <button
                            type="button"
                            aria-label={`Loop ${loopMode ? 'loopMode' : 'off'}`}
                            title={`Loop ${loopMode ? loopMode : 'off'}`}
                            onClick={toggleLoop}
                            className={`hidden cursor-pointer rounded-full p-1 @sm:inline ${loopMode ? 'text-highlight' : 'hover:text-text-primary'}`}>
                            <Icon icon={loopMode ? (loopMode === 'one' ? 'repeatOne' : 'repeat') : 'repeat'} className="size-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="hidden w-full items-center justify-center gap-3 text-xs @md:flex">
                        <span>{formatTimeDuration(currentTime * 1000, 'minutes')}</span>
                        <label className="group flex w-full max-w-md items-center">
                            <input
                                type="range"
                                aria-label="Song Progress"
                                min={0}
                                max={duration}
                                step={0.1}
                                value={currentTime}
                                onChange={(e) => seek(parseFloat(e.target.value))}
                                className="[&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full bg-neutral-700 transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                            />
                        </label>
                        <span>{formatTimeDuration(duration * 1000, 'minutes')}</span>
                    </div>
                </div>

                {/* Volume & Extras */}
                <div className="hidden items-center gap-1 justify-self-end @xl:flex">
                    <div className="mr-2 hidden w-28 items-center gap-1 @5xl:flex">
                        <button
                            type="button"
                            title={volume === 0 ? 'Unmute' : 'Mute'}
                            onClick={toggleMute}
                            className="hover:text-text-primary shrink-0 cursor-pointer rounded-full p-1">
                            <Icon icon={volume === 0 ? 'volumeOff' : 'volumeLoud'} className="size-5 shrink-0" />
                        </button>
                        <label className="group flex w-full items-center">
                            <input
                                type="range"
                                aria-label="Volume"
                                min={0}
                                max={1}
                                step={0.01}
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="[&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full bg-neutral-700 transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        aria-label="Queue"
                        title="Queue"
                        onClick={() => console.log(queue)}
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="musicQueue" className="size-5" />
                    </button>

                    <button
                        type="button"
                        aria-label="Fullscreen"
                        title="Fullscreen"
                        onClick={() =>
                            setQueue([
                                {
                                    id: 'FiWvT7d2',
                                    urls: [
                                        {
                                            quality: '12kbps',
                                            url: 'http://aac.saavncdn.com/949/6ba8b7e19ce3ae92d146ccf6929d921a_12.mp4',
                                        },
                                        {
                                            quality: '48kbps',
                                            url: 'http://aac.saavncdn.com/949/6ba8b7e19ce3ae92d146ccf6929d921a_48.mp4',
                                        },
                                        {
                                            quality: '96kbps',
                                            url: 'http://aac.saavncdn.com/949/6ba8b7e19ce3ae92d146ccf6929d921a_96.mp4',
                                        },
                                        {
                                            quality: '160kbps',
                                            url: 'http://aac.saavncdn.com/949/6ba8b7e19ce3ae92d146ccf6929d921a_160.mp4',
                                        },
                                        {
                                            quality: '320kbps',
                                            url: 'http://aac.saavncdn.com/949/6ba8b7e19ce3ae92d146ccf6929d921a_320.mp4',
                                        },
                                    ],
                                    title: 'LOS VOLTAJE (Super Slowed)',
                                    album: 'LOS VOLTAJE',
                                    artists: "Sayfalse, Yb Wasg'ood, ARIIS",
                                    covers: [
                                        {
                                            quality: '50x50',
                                            url: 'https://c.saavncdn.com/949/LOS-VOLTAJE-Portuguese-2025-20250417025343-50x50.jpg',
                                        },
                                        {
                                            quality: '150x150',
                                            url: 'https://c.saavncdn.com/949/LOS-VOLTAJE-Portuguese-2025-20250417025343-150x150.jpg',
                                        },
                                        {
                                            quality: '500x500',
                                            url: 'https://c.saavncdn.com/949/LOS-VOLTAJE-Portuguese-2025-20250417025343-500x500.jpg',
                                        },
                                    ],
                                },
                            ])
                        }
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="fullscreen" className="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Fullscreen"
                        title="Fullscreen"
                        onClick={() =>
                            addToQueue([
                                {
                                    id: 'l-FULCFa',
                                    urls: [
                                        {
                                            quality: '12kbps',
                                            url: 'http://aac.saavncdn.com/002/34392dd4582139e0bd4952b9b04ae045_12.mp4',
                                        },
                                        {
                                            quality: '48kbps',
                                            url: 'http://aac.saavncdn.com/002/34392dd4582139e0bd4952b9b04ae045_48.mp4',
                                        },
                                        {
                                            quality: '96kbps',
                                            url: 'http://aac.saavncdn.com/002/34392dd4582139e0bd4952b9b04ae045_96.mp4',
                                        },
                                        {
                                            quality: '160kbps',
                                            url: 'http://aac.saavncdn.com/002/34392dd4582139e0bd4952b9b04ae045_160.mp4',
                                        },
                                        {
                                            quality: '320kbps',
                                            url: 'http://aac.saavncdn.com/002/34392dd4582139e0bd4952b9b04ae045_320.mp4',
                                        },
                                    ],
                                    title: 'Nature',
                                    album: 'Nature',
                                    artists: 'Kabira, NJ Nindaniya',
                                    covers: [
                                        {
                                            quality: '50x50',
                                            url: 'https://c.saavncdn.com/002/Nature-Haryanvi-2022-20240813033302-50x50.jpg',
                                        },
                                        {
                                            quality: '150x150',
                                            url: 'https://c.saavncdn.com/002/Nature-Haryanvi-2022-20240813033302-150x150.jpg',
                                        },
                                        {
                                            quality: '500x500',
                                            url: 'https://c.saavncdn.com/002/Nature-Haryanvi-2022-20240813033302-500x500.jpg',
                                        },
                                    ],
                                },
                            ])
                        }
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="fullscreen" className="size-4" />
                    </button>
                </div>
            </section>
        </footer>
    );
};

export default MusicMiniPlayer;
