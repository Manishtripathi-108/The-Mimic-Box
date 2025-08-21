'use client';

import { memo } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import MusicDurationSlider from '@/app/(protected)/music/_components/MusicDurationSlider';
import { Button } from '@/components/ui/Button';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useMultiToggle from '@/hooks/useMultiToggle';

// Lazy-loaded components
const MusicDownloadPopover = dynamic(() => import('@/app/(protected)/music/_components/MusicDownloadPopover'), { ssr: false });
const MusicPlayer = dynamic(() => import('@/app/(protected)/music/_components/MusicPlayer'), { ssr: false });
const MusicQueue = dynamic(() => import('@/app/(protected)/music/_components/MusicQueue'), { ssr: false });
const MusicLyricsCard = dynamic(() => import('@/app/(protected)/music/_components/MusicLyricsCard'), { ssr: false });

const MusicMiniPlayer = () => {
    const [show, { setDefault: close, toggle }] = useMultiToggle(false, true, {
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
        <>
            {show.musicPlayer && <MusicPlayer onClose={() => close('musicPlayer')} />}

            <footer className="@container fixed bottom-2 left-1/2 z-80 w-full -translate-x-1/2">
                <section className="shadow-floating-sm text-text-secondary bg-gradient-secondary-to-tertiary flex w-full flex-wrap items-center justify-between gap-2 rounded-full p-2 @md:px-4">
                    {/* Track Info */}
                    <div onClick={() => toggle('musicPlayer')} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                        <Image
                            src={currentTrack.covers?.[0]?.url || IMAGE_FALLBACKS.AUDIO_COVER}
                            alt={currentTrack.title || 'Album Art'}
                            width={40}
                            height={40}
                            className="size-10 rounded-full border object-cover @md:rounded-xl"
                            priority
                        />
                        <div className="min-w-0">
                            <h3 title={currentTrack.title} className="text-text-primary line-clamp-1 text-base font-semibold">
                                {currentTrack.title || 'Unknown Title'}
                            </h3>
                            <p className="line-clamp-1 text-xs">{currentTrack.artists || 'Unknown Artist'}</p>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="mr-2 flex flex-col items-center gap-1 @xl:mr-auto @xl:flex-2">
                        <div className="flex items-center justify-center gap-4">
                            {/* Lyrics */}
                            <div className="relative hidden @md:flex" id="lyrics-popover-container">
                                <Button
                                    variant="ghost"
                                    title="Lyrics"
                                    onClick={() => toggle('lyrics')}
                                    aria-label="Open Lyrics"
                                    icon="lyrics"
                                    active={show.lyrics}
                                    className="ignore-onClickOutside"
                                />
                                {show.lyrics && (
                                    <MusicLyricsCard
                                        onClose={() => close('lyrics')}
                                        className="right-1/2 bottom-full z-60 mb-6 max-h-[60vh] w-sm translate-x-1/2"
                                    />
                                )}
                            </div>

                            {/* Shuffle */}
                            <Button
                                title="Shuffle"
                                variant="ghost"
                                onClick={toggleShuffle}
                                aria-label="Toggle Shuffle"
                                icon={isShuffled ? 'shuffle' : 'shuffleOff'}
                                className={`hidden @md:inline-flex ${isShuffled ? 'text-highlight' : ''}`}
                            />

                            {/* Prev / Play / Next */}
                            <Button title="Previous Track" variant="ghost" onClick={playPrevious} aria-label="Previous Track" icon="previous" />
                            <Button
                                onClick={() => toggleFadePlay()}
                                variant="highlight"
                                title={playing ? 'Pause' : 'Play'}
                                aria-label={playing ? 'Pause' : 'Play'}
                                icon={loading ? 'loading' : playing ? 'pauseToPlay' : 'playToPause'}
                            />
                            <Button title="Next Track" onClick={playNext} variant="ghost" aria-label="Next Track" icon="next" />

                            {/* Loop */}
                            <Button
                                title={loop ? 'Loop One' : 'Loop'}
                                onClick={toggleLoop}
                                variant="ghost"
                                aria-label="Toggle Loop Mode"
                                icon={loop ? 'repeatOne' : 'repeat'}
                                className={`hidden @md:inline-flex ${loop ? 'text-highlight' : ''}`}
                            />

                            {/* Download */}
                            <div className="relative hidden items-center @md:flex" id="download-popover-container">
                                {show.download && (
                                    <MusicDownloadPopover
                                        onClose={() => close('download')}
                                        downloadCurrent
                                        className="right-1/2 bottom-full z-60 mb-4"
                                    />
                                )}
                                <Button
                                    title="Download"
                                    onClick={() => toggle('download')}
                                    variant="ghost"
                                    aria-label="Download"
                                    icon="download"
                                    active={show.download}
                                    className="ignore-onClickOutside"
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
                                aria-label="Toggle Mute"
                                icon={muted || volume === 0 ? 'volumeOff' : 'volumeLoud'}
                                className={`shrink-0 ${muted || volume === 0 ? 'text-highlight' : ''}`}
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
                                active={show.queue}
                                className="ignore-onClickOutside"
                            />
                            {show.queue && (
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
                            aria-label="Playback Rate"
                            size="sm"
                            className="text-xs">
                            {playbackRate.toFixed(2)}x
                        </Button>

                        {/* Full Screen */}
                        <Button
                            onClick={() => {
                                if (show.musicPlayer || document.fullscreenElement) {
                                    document.exitFullscreen();
                                } else {
                                    document.documentElement.requestFullscreen();
                                }
                                toggle('musicPlayer');
                            }}
                            variant="ghost"
                            title={show.musicPlayer ? 'Exit Full Screen' : 'Enter Full Screen'}
                            aria-label={show.musicPlayer ? 'Exit Full Screen' : 'Enter Full Screen'}
                            icon={show.musicPlayer ? 'quitFullscreen' : 'fullscreen'}
                        />
                    </div>
                </section>
            </footer>
        </>
    );
};

export default memo(MusicMiniPlayer);
