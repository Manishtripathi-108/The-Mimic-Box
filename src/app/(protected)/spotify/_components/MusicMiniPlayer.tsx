'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import MusicDownloads from '@/app/(protected)/spotify/_components/MusicDownloads';
import Icon from '@/components/ui/Icon';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { useAudioPlayerContext } from '@/contexts/audioPlayer.context';
import { formatTimeDuration } from '@/lib/utils/core.utils';

const MusicMiniPlayer = () => {
    const [playbackState, setPlaybackState] = useState({
        currentTime: 0,
        buffered: null as TimeRanges | null,
    });
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const lastTimeUpdateRef = useRef(0);
    const {
        currentTrack,
        queue,
        duration,
        volume,
        muted,
        playing,
        loading,
        loop,
        isShuffled,
        toggleFadePlay,
        toggleMute,
        toggleLoop,
        toggleShuffle,
        seekTo,
        setVolume,
        playNext,
        playPrevious,
        getAudioElement,
    } = useAudioPlayerContext();

    const audio = getAudioElement();

    const updatePlaybackTime = useCallback(() => {
        if (!audio) return;
        const now = performance.now();
        if (now - lastTimeUpdateRef.current < 500) return;

        lastTimeUpdateRef.current = now;
        setPlaybackState({
            currentTime: audio.currentTime,
            buffered: audio.buffered,
        });
    }, [audio]);

    useEffect(() => {
        if (!audio) return;

        audio.addEventListener('timeupdate', updatePlaybackTime);
        return () => audio.removeEventListener('timeupdate', updatePlaybackTime);
    }, [audio, updatePlaybackTime]);

    // Calculate buffered end time
    const bufferedEnd = useMemo(() => {
        if (!playbackState.buffered || playbackState.buffered.length === 0) return 0;
        return playbackState.buffered.end(playbackState.buffered.length - 1);
    }, [playbackState.buffered]);

    // Close popover on outside click
    useEffect(() => {
        if (!isPopoverOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPopoverOpen]);

    if (!currentTrack) return null;

    return (
        <footer className="@container fixed bottom-2 left-1/2 z-50 w-full -translate-x-1/2">
            <section className="from-secondary to-tertiary shadow-floating-sm text-text-secondary flex w-full flex-wrap items-center justify-between gap-2 rounded-full bg-linear-150 from-15% to-85% px-3 py-2 @md:px-4">
                {/* Track Info */}
                <div className="flex min-w-0 flex-2 items-center gap-3">
                    <Image
                        src={currentTrack?.covers?.[0]?.url || IMAGE_FALLBACKS.AUDIO_COVER}
                        alt={currentTrack?.title || 'Album Art'}
                        width={40}
                        height={40}
                        className="size-10 rounded-full border object-cover @md:rounded-xl"
                        priority
                    />
                    <div className="min-w-0">
                        <h3 className="text-text-primary line-clamp-1 text-base font-semibold">{currentTrack?.title || 'Unknown Title'}</h3>
                        <p className="line-clamp-1 text-xs">{currentTrack?.artists || 'Unknown Artist'}</p>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="@8xl:flex-8 flex flex-1 flex-col items-center gap-1 @md:flex-2 @xl:flex-4">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            type="button"
                            title="Lyrics"
                            className="hover:text-text-primary hidden cursor-pointer rounded-full p-1 @md:inline"
                            aria-label="Open Lyrics">
                            <Icon icon="lyrics" className="size-5" />
                        </button>

                        <button
                            type="button"
                            title="Shuffle"
                            onClick={toggleShuffle}
                            className={`hidden cursor-pointer rounded-full p-1 @sm:inline ${isShuffled ? 'text-highlight' : 'hover:text-text-primary'}`}
                            aria-label="Toggle Shuffle">
                            <Icon icon="shuffle" className="size-5" />
                        </button>

                        <button
                            type="button"
                            title="Previous Track"
                            onClick={playPrevious}
                            className="hover:text-text-primary cursor-pointer rounded-full p-1"
                            aria-label="Previous Track">
                            <Icon icon="previous" className="size-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => toggleFadePlay()}
                            className="button button-highlight flex size-8 items-center justify-center rounded-full p-1.5"
                            aria-label={playing ? 'Pause' : 'Play'}>
                            <Icon icon={loading ? 'loading' : playing ? 'pauseToPlay' : 'playToPause'} className="size-full" />
                        </button>

                        <button
                            type="button"
                            title="Next Track"
                            onClick={playNext}
                            className="hover:text-text-primary cursor-pointer rounded-full p-1"
                            aria-label="Next Track">
                            <Icon icon="next" className="size-4" />
                        </button>

                        <button
                            type="button"
                            title={loop ? 'Loop One' : 'Loop'}
                            onClick={toggleLoop}
                            className={`hidden cursor-pointer rounded-full p-1 @sm:inline ${loop ? 'text-highlight' : 'hover:text-text-primary'}`}
                            aria-label="Toggle Loop Mode">
                            <Icon icon={loop ? 'repeatOne' : 'repeat'} className="size-5" />
                        </button>

                        <div className="relative hidden @md:inline" ref={popoverRef}>
                            {isPopoverOpen && <MusicDownloads downloadCurrent className="right-1/2 bottom-full z-60 mb-4" />}
                            <button
                                type="button"
                                title="Download"
                                onClick={() => setIsPopoverOpen((prev) => !prev)}
                                className="hover:text-text-primary cursor-pointer rounded-full p-1"
                                aria-label="Download">
                                <Icon icon="download" className="size-6" />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="hidden w-full max-w-md items-center gap-3 text-xs @md:flex">
                        <span>{formatTimeDuration(playbackState.currentTime * 1000, 'minutes')}</span>

                        <div className="group relative flex w-full items-center overflow-hidden rounded-full bg-neutral-700">
                            {/* Buffered */}
                            <div
                                className="absolute top-1/2 left-0 z-10 h-full -translate-y-1/2 rounded-full bg-neutral-500"
                                style={{
                                    width: `${(bufferedEnd / duration) * 100}%`,
                                }}
                            />
                            {/* Slider */}
                            <input
                                type="range"
                                aria-label="Song Progress"
                                min={0}
                                max={duration}
                                step={0.1}
                                value={playbackState.currentTime}
                                onChange={(e) => seekTo(parseFloat(e.target.value))}
                                className="[&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] relative z-10 h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                            />
                        </div>

                        <span>{formatTimeDuration(duration * 1000, 'minutes')}</span>
                    </div>
                </div>

                {/* Volume & Actions */}
                <div className="hidden shrink-0 items-center gap-2 @xl:flex">
                    <div className="mr-2 hidden w-28 items-center gap-1 @5xl:flex">
                        <button
                            type="button"
                            title={muted ? 'Unmute' : 'Mute'}
                            onClick={toggleMute}
                            className="hover:text-text-primary shrink-0 cursor-pointer rounded-full p-1">
                            <Icon icon={muted ? 'volumeOff' : 'volumeLoud'} className="size-5 shrink-0" />
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
                                className="[&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full bg-neutral-700 transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                            />
                        </label>
                    </div>

                    {/* Debug Buttons */}
                    <button
                        type="button"
                        title="Queue"
                        onClick={() => console.log(queue)}
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="musicQueue" className="size-5" />
                    </button>

                    <button
                        type="button"
                        title="Fullscreen"
                        // onClick={() => setQueue(/** test queue */)}
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="fullscreen" className="size-4" />
                    </button>

                    <button
                        type="button"
                        title="Add to Queue"
                        // onClick={() => addToQueue(/** test add */)}
                        className="hover:text-text-primary flex size-7 cursor-pointer items-center justify-center rounded-full">
                        <Icon icon="fullscreen" className="size-4" />
                    </button>
                </div>
            </section>
        </footer>
    );
};

export default MusicMiniPlayer;
