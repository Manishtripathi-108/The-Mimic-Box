'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

import MusicDurationSlider from '@/app/(protected)/music/_components/MusicDurationSlider';
import { Button } from '@/components/ui/Button';
import { IMAGE_FALLBACKS } from '@/constants/common.constants';
import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import useMultiToggle from '@/hooks/useMultiToggle';
import cn from '@/lib/utils/cn';

// Lazy-loaded overlays
const MusicDownloadPopover = dynamic(() => import('@/app/(protected)/music/_components/MusicDownloadPopover'), { ssr: false });
const MusicQueue = dynamic(() => import('@/app/(protected)/music/_components/MusicQueue'), { ssr: false });
const MusicLyricsCard = dynamic(() => import('@/app/(protected)/music/_components/MusicLyricsCard'), { ssr: false });

const MusicPlayer = ({ className, onClose }: { className?: string; onClose: () => void }) => {
    const [toggles, { setDefault: close, toggle }] = useMultiToggle(false, true, {
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
        playNext,
        playPrevious,
    } = useAudioPlayerContext();

    if (!currentTrack) return null;

    const coverImage = currentTrack?.covers?.[2]?.url || IMAGE_FALLBACKS.AUDIO_COVER;
    const smallCover = currentTrack?.covers?.[0]?.url || IMAGE_FALLBACKS.AUDIO_COVER;

    return (
        <section
            aria-label="Music Player"
            className={cn('bg-primary text-text-secondary fixed inset-0 z-100 mx-auto flex h-dvh w-full flex-col sm:z-70', className)}>
            {/* Header */}
            <header className="bg-secondary flex items-center justify-between p-4">
                <Button className="rounded-xl" icon="leftArrow" aria-label="Go Back" onClick={onClose} />
                <h1 className="text-lg font-medium">Now Playing</h1>
                <Button className="rounded-xl" icon="info" aria-label="Track Info" />
            </header>

            {/* Album Art */}
            <div className="flex items-center justify-center py-4 sm:flex-1">
                {toggles.lyrics ? (
                    <MusicLyricsCard
                        contentOnly
                        disableClickOutside
                        onClose={() => close('lyrics')}
                        className="relative h-75 w-full bg-transparent p-0 shadow-none sm:-mt-20 sm:h-150"
                    />
                ) : (
                    <Image
                        src={coverImage}
                        width={300}
                        height={300}
                        onClick={() => toggle('lyrics')}
                        className="shadow-floating-md aspect-square cursor-pointer rounded-xl border object-cover sm:size-108"
                        alt={currentTrack?.title || 'Album Art'}
                        priority
                    />
                )}
            </div>

            {/* Song Info + Progress */}
            <div className="bg-secondary rounded-t-2xl p-2 sm:hidden">
                <div className="shadow-pressed-xs mb-1 flex min-w-0 flex-1 items-center gap-2 rounded-xl border p-1">
                    <Image
                        src={smallCover}
                        alt={currentTrack?.title || 'Album Cover'}
                        width={40}
                        height={40}
                        className="size-12 rounded-lg border object-cover"
                        priority
                    />
                    <div className="min-w-0">
                        <h2 className="text-text-primary line-clamp-1 text-base font-semibold" title={currentTrack?.title}>
                            {currentTrack?.title || 'Unknown Title'}
                        </h2>
                        <p className="line-clamp-1 text-xs">{currentTrack?.artists || 'Unknown Artist'}</p>
                    </div>
                </div>

                <MusicDurationSlider className="mx-2 my-3 flex items-center gap-3 text-xs" aria-label="Track Progress" />
            </div>

            {/* Controls */}
            <div className="bg-secondary mt-1 flex h-full items-center p-4 sm:hidden">
                <div className="flex w-full justify-around">
                    {/* Left column: Shuffle + Loop */}
                    <div className="flex flex-col items-center justify-between">
                        <Button
                            size="xl"
                            active={isShuffled}
                            onClick={toggleShuffle}
                            aria-pressed={isShuffled}
                            aria-label="Toggle Shuffle"
                            icon={isShuffled ? 'shuffle' : 'shuffleOff'}
                            className={isShuffled ? 'text-highlight' : ''}
                        />
                        <Button
                            size="xl"
                            active={loop}
                            onClick={toggleLoop}
                            aria-pressed={loop}
                            aria-label="Toggle Loop"
                            icon={loop ? 'repeatOne' : 'repeat'}
                            className={loop ? 'text-highlight' : ''}
                        />
                    </div>

                    {/* Center: Play controls */}
                    <div className="bg-tertiary relative grid aspect-square max-w-60 flex-1 place-items-center rounded-full p-2">
                        {/* Download */}
                        <Button
                            variant="ghost"
                            onClick={() => toggle('download')}
                            aria-label="Download"
                            icon="download"
                            active={toggles.download}
                            className="ignore-onClickOutside"
                        />
                        {toggles.download && <MusicDownloadPopover onClose={() => close('download')} downloadCurrent className="bottom-full z-100" />}

                        {/* Play/Pause row */}
                        <div className="flex w-full items-center justify-between py-1">
                            <Button onClick={playPrevious} variant="ghost" aria-label="Previous Track" icon="previous" />
                            <div className="bg-secondary flex items-center justify-center rounded-full p-2">
                                <Button
                                    onClick={() => toggleFadePlay()}
                                    variant="highlight"
                                    size="3xl"
                                    aria-label={playing ? 'Pause' : 'Play'}
                                    icon={loading ? 'loading' : playing ? 'pauseToPlay' : 'playToPause'}
                                />
                            </div>
                            <Button onClick={playNext} variant="ghost" aria-label="Next Track" icon="next" />
                        </div>

                        {/* Mute */}
                        <Button
                            variant="ghost"
                            onClick={toggleMute}
                            aria-label={muted || volume === 0 ? 'Unmute' : 'Mute'}
                            icon={muted || volume === 0 ? 'volumeOff' : 'volumeLoud'}
                            className={muted || volume === 0 ? 'text-highlight' : ''}
                        />
                    </div>

                    {/* Right column: Queue + Lyrics */}
                    <div className="flex flex-col items-center justify-between">
                        <Button
                            size="xl"
                            onClick={() => toggle('queue')}
                            aria-label="Open Queue"
                            icon="musicQueue"
                            active={toggles.queue}
                            className="ignore-onClickOutside"
                        />
                        <Button
                            size="xl"
                            onClick={() => toggle('lyrics')}
                            aria-label="Open Lyrics"
                            icon="lyrics"
                            active={toggles.lyrics}
                            className={`ignore-onClickOutside ${toggles.lyrics ? 'text-highlight' : ''}`}
                        />
                    </div>
                </div>
            </div>

            {/* Overlays */}
            {toggles.queue && <MusicQueue onClose={() => close('queue')} className="fixed inset-0 z-100" />}
        </section>
    );
};

export default MusicPlayer;
