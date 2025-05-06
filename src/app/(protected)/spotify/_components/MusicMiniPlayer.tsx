'use client';

import { useState } from 'react';

import Image from 'next/image';

import Icon from '@/components/ui/Icon';

const MusicMiniPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <footer className="@container fixed bottom-2 left-1/2 z-50 w-full -translate-x-1/2">
            <section className="from-secondary to-tertiary text-text-secondary shadow-floating-sm mx-2 grid grid-cols-2 items-center justify-between rounded-full bg-linear-150 from-15% to-85% px-2 py-2 @md:grid-cols-3 @md:px-4 @xl:grid-cols-5">
                {/* Track Info */}
                <div className="flex items-center gap-3 justify-self-start">
                    <Image
                        src="https://picsum.photos/400"
                        alt="Album Art"
                        width={40}
                        height={40}
                        className="rounded-full border object-cover @md:rounded-xl"
                    />
                    <div>
                        <h3 className="text-text-primary line-clamp-1 text-base font-semibold">idfc</h3>
                        <p className="line-clamp-1 text-xs">blackbear</p>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="flex w-full max-w-xl flex-col items-center gap-1 justify-self-center @md:col-span-2 @xl:col-span-3">
                    <div className="flex items-center justify-center gap-5">
                        <button
                            type="button"
                            aria-label="Shuffle"
                            title="Shuffle"
                            className="hover:text-text-primary hidden cursor-pointer rounded-full p-1 @sm:inline">
                            <Icon icon="shuffle" className="size-5" />
                        </button>

                        <button
                            type="button"
                            aria-label="Previous"
                            title="Previous"
                            className="hover:text-text-primary cursor-pointer rounded-full p-1">
                            <Icon icon="previous" className="size-4" />
                        </button>

                        <button
                            type="button"
                            onClick={togglePlay}
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            title={isPlaying ? 'Pause' : 'Play'}
                            className="button button-highlight flex size-8 items-center justify-center rounded-full p-1.5">
                            <Icon icon={isPlaying ? 'pauseToPlay' : 'playToPause'} className="size-full" />
                        </button>

                        <button type="button" aria-label="Next" title="Next" className="hover:text-text-primary cursor-pointer rounded-full p-1">
                            <Icon icon="next" className="size-4" />
                        </button>

                        <button
                            type="button"
                            aria-label="Queue"
                            title="Queue"
                            className="hover:text-text-primary hidden cursor-pointer rounded-full p-1 @sm:inline">
                            <Icon icon="repeat" className="size-5" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="hidden w-full items-center justify-center gap-3 text-xs @md:flex">
                        <span>0:30</span>
                        <label className="group flex w-full max-w-md items-center">
                            <input
                                type="range"
                                aria-label="Song Progress"
                                className="[&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full bg-neutral-700 transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                            />
                        </label>
                        <span>3:27</span>
                    </div>
                </div>

                {/* Volume & Extras */}
                <div className="hidden items-center gap-1 justify-self-end @xl:flex">
                    <div className="mr-2 hidden w-28 items-center gap-1 @5xl:flex">
                        <Icon icon="volumeLoud" className="size-5 shrink-0" />
                        <label className="group flex w-full items-center">
                            <input
                                type="range"
                                aria-label="Volume"
                                className="[&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full bg-neutral-700 transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                            />
                        </label>
                    </div>

                    <button
                        type="button"
                        aria-label="Queue"
                        title="Queue"
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="musicQueue" className="size-5" />
                    </button>

                    <button
                        type="button"
                        aria-label="Fullscreen"
                        title="Fullscreen"
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="fullscreen" className="size-4" />
                    </button>
                </div>
            </section>
        </footer>
    );
};

export default MusicMiniPlayer;
