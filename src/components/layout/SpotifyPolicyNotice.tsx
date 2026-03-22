import { getSpotifyPolicyBannerState } from '@/lib/config/spotify-policy.config';

type Props = {
    className?: string;
};

const SpotifyPolicyNotice = ({ className }: Props) => {
    const banner = getSpotifyPolicyBannerState();

    if (!banner.show) return null;

    return (
        <section className={`bg-warning/10 border-warning/40 text-warning mb-4 rounded-xl border px-4 py-3 ${className || ''}`}>
            <h2 className="font-semibold tracking-wide">{banner.title}</h2>
            <p className="text-sm">{banner.description}</p>
            <p className="mt-1 text-xs">Set SPOTIFY_PREMIUM_MEMBER=true to reactivate supported Spotify features.</p>
        </section>
    );
};

export default SpotifyPolicyNotice;
