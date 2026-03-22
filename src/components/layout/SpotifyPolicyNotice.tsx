'use client';

import { usePathname } from 'next/navigation';

import { JS_FALLBACK_ROUTE } from '@/constants/routes/spotify-blocked.routes';
import { getSpotifyPolicyBannerState } from '@/lib/config/spotify-policy.config';

type Props = {
    className?: string;
};

const SpotifyPolicyNotice = ({ className }: Props) => {
    const banner = getSpotifyPolicyBannerState();
    const pathname = usePathname();

    if (!banner.show || pathname !== JS_FALLBACK_ROUTE) return null;

    return (
        <section className={`bg-warning/10 border-warning/40 text-warning mb-4 rounded-xl border px-4 py-3 ${className || ''}`}>
            <h2 className="font-semibold tracking-wide">{banner.title}</h2>
            <p className="text-sm">{banner.description}</p>
            <p className="mt-1 text-xs">Premium-enabled mode is required to reactivate supported Spotify features.</p>
        </section>
    );
};

export default SpotifyPolicyNotice;
