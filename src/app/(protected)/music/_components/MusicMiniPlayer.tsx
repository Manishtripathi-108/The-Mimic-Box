'use client';

import { memo } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import MusicDurationSlider from '@/app/(protected)/music/_components/MusicDurationSlider';
import Button from '@/components/ui/Button';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useMultiToggle from '@/hooks/useMultiToggle';

const MusicDownloadPopover = dynamic(() => import('@/app/(protected)/music/_components/MusicDownloadPopover'), { ssr: false });
const MusicQueue = dynamic(() => import('@/app/(protected)/music/_components/MusicQueue'), { ssr: false });
const MusicLyricsCard = dynamic(() => import('@/app/(protected)/music/_components/MusicLyricsCard'), { ssr: false });

const MusicMiniPlayer = () => {
    const [toggles, { setDefault: close, toggle }] = useMultiToggle(false, true, {
        onChange: (key, value) => {
            console.log(`Toggle ${key} changed to ${value}`);
        },
        keybinds: { global: 'Escape' },
        toggleOnKeyTo: false,
    });

    const {
        currentTrack,
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
        playbackRate,
        setPlaybackRate,
        setVolume,
        playNext,
        playPrevious,
    } = useAudioPlayerContext();

    if (!currentTrack) return null;

    return (
        <footer className="@container fixed bottom-2 left-1/2 z-50 w-full -translate-x-1/2">
            <section className="from-secondary to-tertiary shadow-floating-sm text-text-secondary flex w-full flex-wrap items-center justify-between gap-2 rounded-full bg-linear-150 from-15% to-85% p-2 @md:px-4">
                {/* Track Info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <Image
                        src={currentTrack?.covers?.[0]?.url || IMAGE_FALLBACKS.AUDIO_COVER}
                        alt={currentTrack?.title || 'Album Art'}
                        width={40}
                        height={40}
                        className="size-10 rounded-full border object-cover @md:rounded-xl"
                        priority
                    />
                    <div className="min-w-0">
                        <h3 title={currentTrack?.title} className="text-text-primary line-clamp-1 text-base font-semibold">
                            {currentTrack?.title || 'Unknown Title'}
                        </h3>
                        <p className="line-clamp-1 text-xs">{currentTrack?.artists || 'Unknown Artist'}</p>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="mr-2 flex flex-col items-center gap-1 @xl:mr-auto @xl:flex-2">
                    <div className="flex items-center justify-center gap-4">
                        <div className="relative hidden @md:flex" id="lyrics-popover-container">
                            <Button
                                variant="ghost"
                                title="Lyrics"
                                onClick={() => toggle('lyrics')}
                                aria-label="Open Lyrics"
                                icon="lyrics"
                                active={toggles.lyrics}
                                className="ignore-onClickOutside"
                            />

                            {toggles.lyrics && (
                                <MusicLyricsCard
                                    onClose={() => close('lyrics')}
                                    className="right-1/2 bottom-full z-60 mb-6 max-h-[60vh] w-sm translate-x-1/2"
                                />
                            )}
                        </div>

                        <Button
                            title="Shuffle"
                            variant="ghost"
                            onClick={toggleShuffle}
                            className={`hidden @md:inline-flex ${isShuffled ? 'text-highlight' : ''}`}
                            aria-label="Toggle Shuffle"
                            icon={isShuffled ? 'shuffle' : 'shuffleOff'}
                        />

                        <Button title="Previous Track" variant="ghost" onClick={playPrevious} aria-label="Previous Track" icon="previous" />

                        <Button
                            onClick={() => toggleFadePlay()}
                            variant="highlight"
                            title={playing ? 'Pause' : 'Play'}
                            aria-label={playing ? 'Pause' : 'Play'}
                            icon={loading ? 'loading' : playing ? 'pauseToPlay' : 'playToPause'}
                        />

                        <Button title="Next Track" onClick={playNext} variant="ghost" aria-label="Next Track" icon="next" />

                        <Button
                            title={loop ? 'Loop One' : 'Loop'}
                            onClick={toggleLoop}
                            variant="ghost"
                            className={`hidden @md:inline-flex ${loop ? 'text-highlight' : ''}`}
                            aria-label="Toggle Loop Mode"
                            icon={loop ? 'repeatOne' : 'repeat'}
                        />

                        <div className="relative hidden items-center @md:flex" id="download-popover-container">
                            {toggles.download && (
                                <MusicDownloadPopover onClose={() => close('download')} downloadCurrent className="right-1/2 bottom-full z-60 mb-4" />
                            )}
                            <Button
                                title="Download"
                                className="ignore-onClickOutside"
                                onClick={() => toggle('download')}
                                variant="ghost"
                                aria-label="Download"
                                icon="download"
                                active={toggles.download}
                            />
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <MusicDurationSlider className="hidden w-full max-w-lg items-center gap-3 text-xs @md:flex" />
                </div>

                {/* Side Controls */}
                <div className="hidden shrink-0 items-center justify-end gap-2 @2xl:flex @5xl:flex-1">
                    {/* Volume */}
                    <div className="group hidden w-24 items-center gap-1 @5xl:flex">
                        <Button
                            variant="transparent"
                            title={muted || volume === 0 ? 'Unmute' : 'Mute'}
                            onClick={toggleMute}
                            className="shrink-0"
                            aria-label="Toggle Mute"
                            icon={muted || volume === 0 ? 'volumeOff' : 'volumeLoud'}
                        />

                        <input
                            type="range"
                            aria-label="Volume Control"
                            min={0}
                            max={1}
                            step={0.01}
                            value={muted ? 0 : volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="[&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full bg-neutral-700 transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                        />
                    </div>

                    {/* Queue */}
                    <div className="relative" id="queue-popover-container">
                        <Button
                            variant="ghost"
                            title="Open Queue"
                            aria-label="Open Queue"
                            onClick={() => toggle('queue')}
                            icon="musicQueue"
                            className="ignore-onClickOutside"
                            active={toggles.queue}
                        />
                        {toggles.queue && (
                            <MusicQueue
                                onClose={() => close('queue')}
                                className="right-0 bottom-full z-60 mb-8 max-h-[60vh] w-sm origin-bottom-right"
                            />
                        )}
                    </div>

                    {/* Playback Rate */}
                    <Button
                        variant="ghost"
                        title="Change Playback Speed"
                        onClick={() => setPlaybackRate(playbackRate >= 2 ? 0.25 : playbackRate + 0.25)}
                        className="text-xs"
                        size="sm"
                        aria-label="Playback Rate">
                        {playbackRate.toFixed(2)}x
                    </Button>

                    {/* Full Screen */}
                    <Button
                        // ToDo: Make Full Screen
                        variant="ghost"
                        title="Enter Full Screen"
                        aria-label="Enter Full Screen"
                        icon="fullscreen"
                    />
                </div>
            </section>
        </footer>
    );
};

export default memo(MusicMiniPlayer);
