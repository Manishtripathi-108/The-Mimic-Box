import MusicMiniPlayer from '@/app/(protected)/music/_components/MusicMiniPlayer';
import MusicSearch from '@/app/(protected)/music/_components/MusicSearch';
import { auth } from '@/auth';
import AccountLinkCTA from '@/components/layout/AccountLinkCTA';
import DownloadModal from '@/components/layout/DownloadModal';
import SpotifyPolicyNotice from '@/components/layout/SpotifyPolicyNotice';
import { spotifyPolicyConfig } from '@/lib/config/spotify-policy.config';
import { AudioDownloadProvider } from '@/contexts/AudioDownload.context';
import { AudioPlayerProvider } from '@/contexts/AudioPlayer.context';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    const spotify = session?.user?.linkedAccounts?.spotify;

    // Only require Spotify account linking when Spotify features are actually available.
    // When premium restrictions are enforced, let users through to use JioSaavn-based browsing.
    if (!spotify && spotifyPolicyConfig.isSpotifyAccessEnabled) {
        return (
            <main className="h-calc-full-height grid place-items-center">
                <AccountLinkCTA account="spotify" message="Link your Spotify account to view and manage your music library." />
            </main>
        );
    }

    return (
        <div className="min-h-calc-full-height flex w-full flex-col p-2 sm:p-6">
            <AudioPlayerProvider>
                <AudioDownloadProvider>
                    <DownloadModal />
                    <MusicSearch />
                    <SpotifyPolicyNotice className='mt-4' />
                    <main className="mt-4 w-full pb-16">{children}</main>
                    <MusicMiniPlayer />
                </AudioDownloadProvider>
            </AudioPlayerProvider>
        </div>
    );
};

export default Layout;
