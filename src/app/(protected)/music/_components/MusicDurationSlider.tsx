'use client';

import { memo, useCallback, useEffect, useRef } from 'react';

import { useAudioPlayerContext } from '@/contexts/AudioPlayer.context';
import cn from '@/lib/utils/cn';
import { formatTimeDuration } from '@/lib/utils/core.utils';

const MusicDurationSlider = ({ className }: { className: string }) => {
    const { getAudioElement, seekTo } = useAudioPlayerContext();
    const audio = getAudioElement();

    const bufferedEndRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLInputElement>(null);
    const currentFormattedTimeRef = useRef<HTMLSpanElement>(null);
    const isSeekingRef = useRef(false);

    const updatePlaybackTime = useCallback(() => {
        if (!audio || isSeekingRef.current) return;

        // Update slider position
        if (sliderRef.current) {
            sliderRef.current.value = audio.currentTime.toString();
        }

        // Update buffered bar
        if (bufferedEndRef.current && audio.buffered.length > 0) {
            const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
            bufferedEndRef.current.style.width = `${(bufferedEnd / audio.duration) * 100}%`;
        }

        // Update current time
        if (currentFormattedTimeRef.current) {
            currentFormattedTimeRef.current.textContent = formatTimeDuration(audio.currentTime * 1000, 'minutes');
        }
    }, [audio]);

    useEffect(() => {
        if (!audio) return;
        audio.addEventListener('timeupdate', updatePlaybackTime);
        return () => audio.removeEventListener('timeupdate', updatePlaybackTime);
    }, [audio, updatePlaybackTime]);

    if (!audio) return null;

    const duration = isNaN(audio.duration) ? 0 : audio.duration;

    return (
        <div className={cn(className)}>
            <span ref={currentFormattedTimeRef} className="tabular-nums">
                00:00
            </span>

            <div className="group relative flex w-full items-center overflow-hidden rounded-full bg-neutral-700">
                {/* Buffered bar */}
                <div ref={bufferedEndRef} className="absolute top-1/2 left-0 z-10 h-full -translate-y-1/2 rounded-full bg-neutral-500" />

                {/* Slider */}
                <input
                    ref={sliderRef}
                    type="range"
                    aria-label="Song Progress"
                    min={0}
                    step={0.1}
                    defaultValue={0}
                    max={duration}
                    onChange={(e) => {
                        if (currentFormattedTimeRef.current) {
                            const value = parseFloat(e.target.value);
                            currentFormattedTimeRef.current.textContent = formatTimeDuration(value * 1000, 'minutes');
                        }
                    }}
                    onPointerDown={() => {
                        isSeekingRef.current = true;
                    }}
                    onPointerUp={(e) => {
                        isSeekingRef.current = false;
                        seekTo(parseFloat((e.target as HTMLInputElement).value));
                    }}
                    onKeyDown={() => {
                        isSeekingRef.current = true;
                    }}
                    onKeyUp={() => {
                        isSeekingRef.current = false;
                        if (sliderRef.current) {
                            seekTo(parseFloat(sliderRef.current.value));
                        }
                    }}
                    className="[&::-moz-range-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] [&::-webkit-slider-thumb]:shadow-[calc(-100vw)_0_0_100vw_theme(colors.highlight)] relative z-10 h-1 w-full cursor-pointer appearance-none overflow-hidden rounded-full transition-all duration-100 group-hover:h-2 focus:h-2 [&::-moz-range-thumb]:size-0 [&::-webkit-slider-thumb]:size-0 [&::-webkit-slider-thumb]:appearance-none"
                />
            </div>

            <span className="tabular-nums">{formatTimeDuration(duration * 1000, 'minutes')}</span>
        </div>
    );
};

export default memo(MusicDurationSlider);
